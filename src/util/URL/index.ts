export const URLHelpers = {
    toQueryString: (params: { [k: string]: unknown } = {}): string => '?' + Object.entries(params)
        .map(([key, value]) => `${key}=${value}`).join('&'),

    toQueryObj: (queryString: string) => queryString ? queryString.replace('?', '')
        .split('&')
        .map(query => query.split('='))
        .map(([key, value]) => ({[key]: value}))
        .reduce((acc, param) => ({...acc, ...param}), {}) : {}
};