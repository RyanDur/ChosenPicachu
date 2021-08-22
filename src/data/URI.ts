import {Source} from './types';
import {toQueryString} from '../util/URL';
import {aicDomain, harvardAPIKey, harvardDomain} from '../config';

export const shapeOfAICResponse = ['id', 'title', 'image_id', 'artist_display', 'term_titles', 'thumbnail'];
export const shapeOfHarvardResponse = ['id','title','people', 'primaryimageurl'];
export const queryParams = {limit: 12};

interface Query {
    source: Source,
    path?: string;
    params?: Record<string, unknown>
}

export const URI = {
    from: ({source, path, params = {}}: Query): string => {
        const domain = source === Source.AIC ? aicDomain : harvardDomain;
        const {search, ...rest} = params;
        params = source === Source.AIC ?
            {q: search, fields: shapeOfAICResponse, ...rest} :
            {q: search, fields: shapeOfHarvardResponse,...rest, apikey: harvardAPIKey};

        if (source === Source.HARVARD || !search) {
            return [domain, path, toQueryString(params)].join('');
        } else return [domain, '/search', toQueryString(params)].join('');
    }
};