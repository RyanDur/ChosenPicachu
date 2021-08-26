import {Source} from './types';
import {toQueryString} from '../util/URL';
import {aicDomain, defaultAutocompleteLimit, defaultRecordLimit, harvardAPIKey, harvardDomain} from '../config';

export const shapeOfAICResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];
export const shapeOfHarvardResponse = ['id', 'title', 'people', 'primaryimageurl'];

interface Query {
    source: Source,
    path?: string;
    params?: Record<string, unknown>
}

export const URI = {
    from: ({source, path, params = {}}: Query): string => {
        const domain = source === Source.AIC ? aicDomain : harvardDomain;
        const {search, limit = defaultRecordLimit, ...rest} = params;
        params = source === Source.AIC ?
            {q: search, fields: shapeOfAICResponse, ...rest, limit} :
            {q: search, fields: shapeOfHarvardResponse, ...rest, apikey: harvardAPIKey, size: limit};

        const queryString = toQueryString(params);
        if (source === Source.HARVARD || !search) {
            return [domain, path, queryString].join('');
        } else return [domain, '/search', queryString].join('');
    },

    createSearchFrom: (search: string, source: Source) =>
        source === Source.AIC ? `${aicDomain}/search${toQueryString({
            'query[term][title]': search,
            fields: 'suggest_autocomplete_all',
            limit: defaultAutocompleteLimit
        })}` : `${harvardDomain}${toQueryString({
            title: search,
            fields: 'title',
            apikey: harvardAPIKey,
            size: defaultAutocompleteLimit
        })}`
};