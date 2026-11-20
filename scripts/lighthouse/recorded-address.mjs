import {not} from '@ryandur/sand';

export const recordedAddress = address => {
  if (not(address.startsWith('/'))) return address;
  const url = new URL(address, 'http://stage');
  if (not(url.pathname.endsWith('/candles'))) return address;
  url.searchParams.delete('start');
  url.searchParams.delete('end');
  return `${url.pathname}${url.search}`;
};
