import {has, maybe} from '@ryandur/sand';

type QueryString = {
  from: (params?: object) => string;
};

export const queryString: QueryString = {
  from: (params = {}) =>
    maybe(new URLSearchParams(Object.entries(params)
      .filter(([, value]) => has(value))
      .map(([key, value]) => [key, String(value)])).toString()).map(query => `?${query}`).orElse('')
};
