import {useEffect} from 'react';
import {useLocation} from 'react-router';
import {maybe} from '@ryandur/sand';

// a fold that opens on arrival slides, and the step inside it has no place until it has; land once the folds around it rest
const foldsOpeningAround = (target: Element): Animation[] =>
  document.getAnimations().filter(({effect}) =>
    effect instanceof KeyframeEffect && effect.target instanceof Element && effect.target.contains(target));

export const useArrival = () => {
  const {hash, key} = useLocation();
  useEffect(() => {
    maybe(document.getElementById(hash.slice(1))).map(target =>
      Promise.allSettled(foldsOpeningAround(target).map(({finished}) => finished)).then(() => target.scrollIntoView()));
  }, [hash, key]);
};
