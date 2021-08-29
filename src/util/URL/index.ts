export const toQueryString = (queryObj?: Record<string, unknown>): string =>
    queryObj ? `?${Object.entries(queryObj)
        .filter(([, value]) => !!value)
        .map(([key, value]) => `${key}=${value}`).join('&')}` : '';

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