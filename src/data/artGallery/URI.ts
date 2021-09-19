import {toQueryString} from '../../util/URL';
import {
    aicDomain,
    defaultRecordLimit,
    defaultSearchLimit,
    harvardAPIKey,
    harvardDomain,
    rijksAPIKey,
    rijksDomain
} from '../../config';
import {Source} from './types';
import {URI as URIType} from '../types';
import {maybe, Maybe} from '@ryandur/sand';

export const shapeOfAICResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];
export const shapeOfHarvardResponse = ['id', 'title', 'people', 'primaryimageurl'];

interface Query {
    source: Source,
    path?: unknown[];
    params?: Record<string, unknown>
}

export const URI = {
    from: ({source, path, params = {}}: Query): Maybe<URIType> => {
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
                return maybe.some(search ?
                    [[aicDomain, 'search'].join('/'), queryString].join('') :
                    [[aicDomain, path?.join('/')].join(''), queryString].join(''));
            }
            case Source.HARVARD: {
                return maybe.some([harvardDomain, path,
                    toQueryString({
                        q: search,
                        fields: shapeOfHarvardResponse,
                        page,
                        ...rest,
                        apikey: harvardAPIKey,
                        size: limit
                    })].join(''));
            }
            case Source.RIJKS: {
                return maybe.some([rijksDomain, path,
                    toQueryString({
                        q: search,
                        p: page,
                        ps: limit,
                        imgonly: true,
                        key: rijksAPIKey
                    })].join(''));
            }
            default:
                return maybe.none();
        }
    },

    createSearchFrom: (search: string, source: Source): Maybe<URIType> => {
        switch (source) {
            case Source.AIC:
                return maybe.some(`${aicDomain}/search${toQueryString({
                    'query[term][title]': search,
                    fields: 'suggest_autocomplete_all',
                    limit: defaultSearchLimit
                })}`);
            case Source.HARVARD:
                return maybe.some(`${harvardDomain}${toQueryString({
                    title: search,
                    fields: 'title',
                    apikey: harvardAPIKey,
                    size: defaultSearchLimit
                })}`);
            case Source.RIJKS:
                return maybe.some([rijksDomain,
                    toQueryString({
                        q: search,
                        p: 1,
                        ps: defaultSearchLimit,
                        imgonly: true,
                        key: rijksAPIKey
                    })].join(''));
            default:
                return maybe.none();
        }
    }
};