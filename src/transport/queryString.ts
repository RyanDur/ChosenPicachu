import {has, maybe} from '@ryandur/sand';

type QueryString = {
  from: (params?: object) => string;
};

export const queryString: QueryString = {
  from: (params = {}) =>
    maybe(Object.entries(params)
      .filter(([, value]) => has(value))
      .map(([key, value]) => `${key}=${String(value)}`).join('&')).map(query => `?${query}`).orElse('')
};
