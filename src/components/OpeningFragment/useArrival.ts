import {useEffect} from 'react';
import {NavigationType, useLocation, useNavigationType} from 'react-router';
import {maybe, notEmpty} from '@ryandur/sand';
import {useOpeningFragment} from './OpeningFragmentProvider';
import {Measured, Watch, watched, watching} from './landing';

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

const openFoldsAround = (target: Element): void => {
  const fold = target.closest('details:not([open])');
  if (fold instanceof HTMLDetailsElement) {
    fold.open = true;
    openFoldsAround(fold);
  }
};

const landOnceItsFoldsHaveOpened = (hash: string): void => {
  maybe(hash.slice(1), notEmpty).mBind(id => maybe(document.getElementById(id))).map(target => {
    openFoldsAround(target);
    whenItHoldsStill(target, () => {
      if (window.location.hash === hash) {
        target.scrollIntoView();
        const landing = landingAround(target);
        if (landing instanceof HTMLElement) landing.focus({preventScroll: true});
      }
    });
  });
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
