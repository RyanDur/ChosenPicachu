import {useEffect, useState} from 'react';
import {NavigationType, useLocation, useNavigationType} from 'react-router';
import {maybe} from '@ryandur/sand';

const foldsOpeningAround = (target: Element): Animation[] =>
  document.getAnimations().filter(({effect}) =>
    effect instanceof KeyframeEffect && effect.target instanceof Element && effect.target.contains(target));

const landOnceItsFoldsHaveOpened = (hash: string): void => {
  maybe(document.getElementById(hash.slice(1))).map(target =>
    Promise.allSettled(foldsOpeningAround(target).map(({finished}) => finished)).then(() => {
      if (window.location.hash === hash) target.scrollIntoView();
    }));
};

// the browser resolves a fragment before this page has rendered it, and restores back and forward by itself
export const useArrival = () => {
  const {hash, key} = useLocation();
  const navigation = useNavigationType();
  const [opening] = useState(hash);
  useEffect(() => landOnceItsFoldsHaveOpened(opening), [opening]);
  useEffect(() => {
    if (navigation !== NavigationType.Pop) landOnceItsFoldsHaveOpened(hash);
  }, [navigation, hash, key]);
};
