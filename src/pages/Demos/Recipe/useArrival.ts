import {useEffect} from 'react';
import {NavigationType, useLocation, useNavigationType} from 'react-router';
import {maybe, notEmpty} from '@ryandur/sand';
import {useOpeningFragment} from '@components/OpeningFragment';

const foldsOpeningAround = (target: Element): Animation[] =>
  document.getAnimations().filter(({effect}) =>
    effect instanceof KeyframeEffect && effect.target instanceof Element && effect.target.contains(target));

const landOnceItsFoldsHaveOpened = (hash: string): void => {
  maybe(hash.slice(1), notEmpty).mBind(id => maybe(document.getElementById(id))).map(target =>
    Promise.allSettled(foldsOpeningAround(target).map(({finished}) => finished)).then(() => {
      if (window.location.hash === hash) target.scrollIntoView();
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
    landOnceItsFoldsHaveOpened(hash);
  }, [opening, hash]);
  useEffect(() => {
    if (navigation !== NavigationType.Pop) landOnceItsFoldsHaveOpened(hash);
  }, [navigation, hash, key]);
};
