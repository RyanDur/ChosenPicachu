import {useEffect} from 'react';
import {Maybe, maybe} from '@ryandur/sand';
import {measured} from './measured';

export const useMeasuredOnResize = <Watched extends Element, Change>(
  bodyOf: (watched: Watched) => Maybe<HTMLElement>,
  dispatch: (change: Change) => void,
  grown: (height: number) => Change,
  watched?: Watched
): void => useEffect(() => maybe(watched).map(element => {
  const watcher = new ResizeObserver(() => measured(bodyOf(element), dispatch, grown));
  watcher.observe(element);
  return () => watcher.disconnect();
}).orElse(() => undefined), [bodyOf, dispatch, grown, watched]);
