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
import {Source, toSource} from './types';
import {URI as URIType} from '../types';
import {has, maybe, Maybe} from '@ryandur/sand';

export const shapeOfAICResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];
export const shapeOfHarvardResponse = ['id', 'title', 'people', 'primaryimageurl'];

interface Query {
    source: Source,
    path?: (string | number)[];
    params?: Record<string, unknown>
}

export const URI = {
    from: ({source, path, params = {}}: Query): Maybe<URIType> => {
        const {search, limit = defaultRecordLimit, page, ...rest} = params;
        return ({
            [Source.AIC]: () => maybe.some(search ?
                [[aicDomain, 'search'].join('/'), toQueryString({
                    q: search,
                    fields: shapeOfAICResponse,
                    page,
                    ...rest,
                    limit
                })].join('') :
                [[aicDomain, path?.filter(has).join('/')].filter(has).join('/'), toQueryString({
                    q: search,
                    fields: shapeOfAICResponse,
                    page,
                    ...rest,
                    limit
                })].join('')),
            [Source.HARVARD]: () => maybe.some([
                [
                    harvardDomain,
                    path?.filter(has).join('/')
                ].filter(has).join('/'),
                toQueryString({
                    q: search,
                    fields: shapeOfHarvardResponse,
                    page,
                    ...rest,
                    apikey: harvardAPIKey,
                    size: limit
                })].join('')),
            [Source.RIJKS]: () => maybe.some([
                [rijksDomain, path?.filter(has).join('/')].filter(has).join('/'),
                toQueryString({
                    q: search,
                    p: page,
                    ps: limit,
                    imgonly: true,
                    key: rijksAPIKey
                })].join('')),
            [Source.UNKNOWN]: () => maybe.none<string>()
        })[toSource(source)]();
    },

    createSearchFrom: (search: string, source: Source): Maybe<URIType> => ({
        [Source.AIC]: () => maybe.some(`${aicDomain}/search${toQueryString({
            'query[term][title]': search,
            fields: 'suggest_autocomplete_all',
            limit: defaultSearchLimit
        })}`),
        [Source.HARVARD]: () => maybe.some(`${harvardDomain}${toQueryString({
            title: search,
            fields: 'title',
            apikey: harvardAPIKey,
            size: defaultSearchLimit
        })}`),
        [Source.RIJKS]: () => maybe.some([
            rijksDomain,
            toQueryString({
                q: search,
                p: 1,
                ps: defaultSearchLimit,
                imgonly: true,
                key: rijksAPIKey
            })].join('')),
        [Source.UNKNOWN]: () => maybe.none<string>()
    })[toSource(source)]()
};