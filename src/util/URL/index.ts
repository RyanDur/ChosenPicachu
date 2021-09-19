import {maybe} from '@ryandur/sand';

export const toQueryString = (queryObj = {}): string =>
    maybe.of(Object.entries(queryObj)
        .filter(([, value]) => !!value)
        .map(([key, value]) => `${key}=${value}`).join('&')).map(query => `?${query}`).orElse('');

export const toQueryObj = (queryString: string, defaultObj = {}) =>
    queryString ? queryString.replace('?', '')
        .split('&')
        .map(query => query.split('='))
        .map(([key, value]) => ({[key]: parse(value)}))
        .reduce((acc, param) => ({...acc, ...param}), defaultObj) : defaultObj;

const parse = (value: string) => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
};