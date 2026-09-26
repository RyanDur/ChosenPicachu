import {useState} from 'react';

export const roomToStandOpen = (): boolean => {
  const line = getComputedStyle(document.documentElement).getPropertyValue('--room-to-stand-open').trim();
  return line === '' || !window.matchMedia(`(width <= ${line}), (height <= ${line})`).matches;
};

export const useRoomToStandOpen = (): boolean => {
  const [room] = useState(roomToStandOpen);
  return room;
};
