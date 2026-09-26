import {useSyncExternalStore} from 'react';

const token = (name: string): string => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const noRoom = (): MediaQueryList | undefined => {
  const line = token('--room-to-stand-open');
  const row = token('--nav-in-a-row');
  return line === '' || row === '' ? undefined : window.matchMedia(`(width <= ${line}), (width <= ${row}) and (height <= ${line})`);
};

const subscribe = (changed: () => void): (() => void) => {
  const query = noRoom();
  query?.addEventListener('change', changed);
  return () => query?.removeEventListener('change', changed);
};

const roomToStandOpen = (): boolean => !(noRoom()?.matches ?? false);

export const useRoomToStandOpen = (): boolean => useSyncExternalStore(subscribe, roomToStandOpen);
