import {not} from '@ryandur/sand';

export const recordedAddress = address => {
  const queryAt = address.indexOf('?');
  if (queryAt < 0 || not(address.slice(0, queryAt).endsWith('/candles'))) return address;
  const query = new URLSearchParams(address.slice(queryAt + 1));
  query.delete('start');
  query.delete('end');
  return `${address.slice(0, queryAt)}?${query}`;
};
