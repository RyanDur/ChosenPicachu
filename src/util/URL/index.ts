export const toQueryString = (queryObj = {}): string => '?' + Object.entries(queryObj)
    .filter(([, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`).join('&');

export const toQueryObj = (queryString: string, defaultObj = {}) => queryString ? queryString.replace('?', '')
    .split('&')
    .map(query => query.split('='))
    .map(([key, value]) => ({[key]: value}))
    .reduce((acc, param) => ({...acc, ...param}), defaultObj) : defaultObj;