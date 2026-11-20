import {not} from '@ryandur/sand';

const clock = new Set(['start', 'end']);

export const recordedAddress = address => {
  const queryAt = address.indexOf('?');
  if (queryAt < 0) return address;
  const kept = address.slice(queryAt + 1).split('&').filter(pair => not(clock.has(pair.split('=')[0])));
  return `${address.slice(0, queryAt)}?${kept.join('&')}`;
};
