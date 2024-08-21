import {
    RIJKAllArtSchema,
    RIJKArtObjectResponse,
    RIJKArtSchema,
    RIJKSAllArtResponse,
    RIJKSArtResponse,
    RIJKSSearchSchema
} from './types';
import {defaultRecordLimit, defaultSearchLimit, rijksAPIKey, rijksDomain} from '../../../../config';
import {toQueryString} from '../../../../util/URL';
import {AllArt, Art, SearchOptions} from '../types/response';
import {GetAllArtRequest} from '../types/resource';
import {validate} from '../../../../data/validate';
import {http} from '../../../../data/http';

export const rijks = {
    allArt: ({page, search, size = defaultRecordLimit}: GetAllArtRequest) => http
        .get(`${rijksDomain}${toQueryString({
            q: search, p: page, ps: size, imgonly: true, key: rijksAPIKey
        })}`)
        .mBind(validate(RIJKAllArtSchema))
        .map((data: RIJKSAllArtResponse): AllArt => ({
            pagination: {
                total: data.count,
                limit: data.artObjects.length,
                totalPages: data.count / data.artObjects.length,
                currentPage: page
            },
            pieces: data.artObjects.map(rijksArtResponseToArtPiece)
        })),

    art: (id: string) => http
        .get(`${rijksDomain}/${id}${toQueryString({
            imgonly: true, key: rijksAPIKey
        })}`)
        .mBind(validate(RIJKArtSchema))
        .map(({artObject}: RIJKSArtResponse): Art => rijksArtResponseToArtPiece(artObject)),

    searchOptions: (search: string) => http
        .get(`${rijksDomain}${toQueryString({
            q: search, p: 1, ps: defaultSearchLimit, imgonly: true, key: rijksAPIKey
        })}`)
        .mBind(validate(RIJKSSearchSchema))
        .map(({artObjects}: RIJKSAllArtResponse): SearchOptions =>
            artObjects.map(({title}) => title))
};

const rijksArtResponseToArtPiece = (data: RIJKArtObjectResponse): Art => ({
    id: data.objectNumber,
    title: data.title,
    image: data.webImage.url,
    artistInfo: data.longTitle,
    altText: data.longTitle
});
