import {useSyncExternalStore} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';

const token = (name: string): string => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const noRoom = (): Maybe<MediaQueryList> => {
  const line = token('--room-to-stand-open');
  const row = token('--nav-in-a-row');
  return line === '' || row === '' ? nothing() : some(window.matchMedia(`(width <= ${line}), (width <= ${row}) and (height <= ${line})`));
};

const subscribe = (changed: () => void): (() => void) => {
  const query = noRoom();
  query.map(list => list.addEventListener('change', changed));
  return () => {
    query.map(list => list.removeEventListener('change', changed));
  };
};

const roomToStandOpen = (): boolean => noRoom().map(list => !list.matches).orElse(true);

export const useRoomToStandOpen = (): boolean => useSyncExternalStore(subscribe, roomToStandOpen);
