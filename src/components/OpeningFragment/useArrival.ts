import {useEffect} from 'react';
import {NavigationType, useLocation, useNavigationType} from 'react-router';
import {maybe, notEmpty} from '@ryandur/sand';
import {useOpeningFragment} from './OpeningFragmentProvider';

const framesHeldStill = 2;
const framesBeforeLandingAnyway = 120;

// a fold's ::details-content opens a few frames after its open attribute and grows the page under a target that
// is already laid out, and Chromium lists no animation for it, so the landing waits for the page to stop growing
type Watch = {readonly last: string; readonly held: number; readonly waited: number};

const watching: Watch = {last: '', held: 0, waited: 0};

const whenItHoldsStill = (target: Element, land: () => void, {last, held, waited}: Watch = watching): void => {
  requestAnimationFrame(() => {
    const now = `${target.getBoundingClientRect().top} ${document.documentElement.scrollHeight}`;
    const stillFor = target.checkVisibility() && now === last ? held + 1 : 0;
    if (stillFor >= framesHeldStill || waited >= framesBeforeLandingAnyway) {
      land();
    } else {
      whenItHoldsStill(target, land, {last: now, held: stillFor, waited: waited + 1});
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
