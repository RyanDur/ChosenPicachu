import {AllArtRequests, ArtRequests, SearchOptionsRequests} from './types/request';
import {asyncFailure, Result} from '@ryandur/sand';
import {GetAllArt, GetArt, matchSource, SearchArt, Source} from './types/resource';
import {AllArt, Art, SearchOptions} from './types/response';
import {HTTPError} from '../types';
import {http} from '../http';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): Result.Async<AllArt, HTTPError> =>
        matchSource<AllArtRequests>(source, {
            [Source.AIC]: () => aic.allArt,
            [Source.HARVARD]: () => harvard.allArt,
            [Source.RIJKS]: () => rijks.allArt(page),
        }).map(({endpoint, validate, toAllArt}) =>
            http.get(endpoint({params: {page, size, search}})).mBind(validate).map(toAllArt)
        ).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

    getArt: ({id, source}: GetArt): Result.Async<Art, HTTPError> =>
        matchSource<ArtRequests>(source, {
            [Source.AIC]: () => aic.art,
            [Source.HARVARD]: () => harvard.art,
            [Source.RIJKS]: () => rijks.art,
        }).map(({endpoint, validate, toArt}) =>
            http.get(endpoint({path: [id]})).mBind(validate).map(toArt)
        ).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

    searchForArt: ({search, source}: SearchArt): Result.Async<SearchOptions, HTTPError> =>
        matchSource<SearchOptionsRequests>(source, {
            [Source.AIC]: () => aic.searchOptions,
            [Source.HARVARD]: () => harvard.searchOptions,
            [Source.RIJKS]: () => rijks.searchOptions,
        }).map(({endpoint, validate, toSearchOptions}) =>
            http.get(endpoint(search)).mBind(validate).map(toSearchOptions)
        ).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE))
};
