import {useEffect} from 'react';
import {NavigationType, useLocation, useNavigationType} from 'react-router';
import {maybe, notEmpty} from '@ryandur/sand';
import {useOpeningFragment} from './OpeningFragmentProvider';

const framesHeldStill = 2;
const framesBeforeLandingAnyway = 120;

// a fold's ::details-content opens a few frames after its open attribute and grows the page under a target that
// is already laid out, and Chromium lists no animation for it, so the landing waits for the page to stop growing
type Measured = {readonly top: number; readonly pageHeight: number; readonly visible: boolean};
type Watch = {readonly last?: Measured; readonly held: number; readonly waited: number};

const watching: Watch = {held: 0, waited: 0};

const unmoved = (now: Measured, last?: Measured): boolean => last?.top === now.top && last.pageHeight === now.pageHeight;

const watched = (watch: Watch, now: Measured): Watch | 'land' => {
  const held = now.visible && unmoved(now, watch.last) ? watch.held + 1 : 0;
  return held >= framesHeldStill || watch.waited >= framesBeforeLandingAnyway
    ? 'land'
    : {last: now, held, waited: watch.waited + 1};
};

const measured = (target: Element): Measured => ({
  top: target.getBoundingClientRect().top + window.scrollY,
  pageHeight: document.documentElement.scrollHeight,
  visible: target.checkVisibility()
});

const whenItHoldsStill = (target: Element, land: () => void, watch: Watch = watching): void => {
  requestAnimationFrame(() => {
    const next = watched(watch, measured(target));
    if (next === 'land') {
      land();
    } else {
      whenItHoldsStill(target, land, next);
    }
  });
};

const landingAround = (target: Element): Element => target.closest('[tabindex="-1"]') ?? target;

const landOnceItsFoldsHaveOpened = (hash: string): void => {
  maybe(hash.slice(1), notEmpty).mBind(id => maybe(document.getElementById(id))).map(target =>
    whenItHoldsStill(target, () => {
      if (window.location.hash === hash) {
        target.scrollIntoView();
        const landing = landingAround(target);
        if (landing instanceof HTMLElement) landing.focus({preventScroll: true});
      }
    }));
};

// the browser resolves a fragment before this page has rendered it, and restores back and forward by itself
export const useArrival = () => {
  const {hash, key} = useLocation();
  const navigation = useNavigationType();
  const opening = useOpeningFragment();
  useEffect(() => {
    if (opening.openingReached) return;
    opening.onOpeningReached();
    if (navigation === NavigationType.Pop) landOnceItsFoldsHaveOpened(hash);
  }, [opening, hash, navigation]);
  useEffect(() => {
    if (navigation !== NavigationType.Pop) landOnceItsFoldsHaveOpened(hash);
  }, [navigation, hash, key]);
};
