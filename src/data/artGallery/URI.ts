import {toQueryString} from '../../util/URL';
import {
    aicDomain,
    defaultAutocompleteLimit,
    defaultRecordLimit,
    harvardAPIKey,
    harvardDomain,
    rijksAPIKey,
    rijksDomain
} from '../../config';
import {Source} from './types';

export const shapeOfAICResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];
export const shapeOfHarvardResponse = ['id', 'title', 'people', 'primaryimageurl'];

interface Query {
    source: Source,
    path?: string;
    params?: Record<string, unknown>
}

export const URI = {
    from: ({source, path, params = {}}: Query): string => {
        const {search, limit = defaultRecordLimit, page, ...rest} = params;
        switch (source) {
            case Source.AIC: {
                const queryString = toQueryString({
                    q: search,
                    fields: shapeOfAICResponse,
                    page,
                    ...rest,
                    limit
                });
                return search ? [aicDomain, '/search', queryString].join('') : [aicDomain, path, queryString].join('');
            }
            case Source.HARVARD: {
                return [harvardDomain, path,
                    toQueryString({
                        q: search,
                        fields: shapeOfHarvardResponse,
                        page,
                        ...rest,
                        apikey: harvardAPIKey,
                        size: limit
                    })].join('');
            }
            default: {
                return [rijksDomain, path,
                    toQueryString({
                        q: search,
                        p: page,
                        ps: limit,
                        imgonly: true,
                        key: rijksAPIKey
                    })].join('');
            }
        }
    },

    createSearchFrom: (search: string, source: Source) => {
        switch (source) {
            case Source.AIC:
                return `${aicDomain}/search${toQueryString({
                    'query[term][title]': search,
                    fields: 'suggest_autocomplete_all',
                    limit: defaultAutocompleteLimit
                })}`;
            case Source.HARVARD:
                return `${harvardDomain}${toQueryString({
                    title: search,
                    fields: 'title',
                    apikey: harvardAPIKey,
                    size: defaultAutocompleteLimit
                })}`;
            default:
                return [rijksDomain,
                    toQueryString({
                        q: search,
                        p: 1,
                        ps: 5,
                        imgonly: true,
                        key: rijksAPIKey
                    })].join('');
        }
    }
};