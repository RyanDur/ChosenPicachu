import {has, maybe} from '@ryandur/sand';

export const toQueryString = (queryObj = {}): string =>
  maybe(Object.entries(queryObj)
    .filter(([, value]) => has(value))
    .map(([key, value]) => `${key}=${String(value)}`).join('&')).map(query => `?${query}`).orElse('');
