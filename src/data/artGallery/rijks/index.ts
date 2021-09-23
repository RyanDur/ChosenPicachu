import {RIJKAllArtSchema, RIJKArtObject, RIJKArtSchema, RIJKSAllArt, RIJKSArt, RIJKSSearchSchema} from './types';
import {validate} from '../../http';
import {has} from '@ryandur/sand';
import {defaultRecordLimit, defaultSearchLimit, rijksAPIKey, rijksDomain} from '../../../config';
import {toQueryString} from '../../../util/URL';
import {PATH} from '../../types';
import {AllArt, Art, SearchOptions} from '../types/response';
import {Query} from '../types/resource';

const rijkToPiece = (data: RIJKArtObject): Art => ({
    id: data.objectNumber,
    title: data.title,
    image: data.webImage.url,
    artistInfo: data.longTitle,
    altText: data.longTitle
});

const endpoint = ({path, params = {}}: Query): PATH => {
    const {search, limit = defaultRecordLimit, page} = params;
    return [
        [rijksDomain, path?.filter(has).join('/')].filter(has).join('/'),
        toQueryString({
            q: search,
            p: page,
            ps: limit,
            imgonly: true,
            key: rijksAPIKey
        })].join('');
};
export const rijks = {
    allArt: (page: number) => ({
        endpoint,
        validate: validate(RIJKAllArtSchema),
        toAllArt: (data: RIJKSAllArt): AllArt => ({
            pagination: {
                total: data.count,
                limit: data.artObjects.length,
                totalPages: data.count / data.artObjects.length,
                currentPage: page,
            },
            pieces: data.artObjects.map(rijkToPiece)
        })
    }),
    art: {
        endpoint,
        validate: validate(RIJKArtSchema),
        toArt: ({artObject}: RIJKSArt): Art => rijkToPiece(artObject)
    },
    searchOptions: {
        endpoint: (search: string) => [
            rijksDomain,
            toQueryString({
                q: search,
                p: 1,
                ps: defaultSearchLimit,
                imgonly: true,
                key: rijksAPIKey
            })].join(''),
        validate: validate(RIJKSSearchSchema),
        toSearchOptions: ({artObjects}: RIJKSAllArt): SearchOptions =>
            artObjects.map(({title}) => title)
    }
};