import {AllArt, Art, GetAllArt, GetArt, SearchArt, SearchOptions, Source} from './types';
import {asyncEvent, asyncResult, OnAsyncEvent} from '@ryandur/sand';
import {HTTPError} from '../types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';
import {http} from '../http';
import {URI} from './URI';

const unknownSource = <T>() => asyncResult.failure<T, HTTPError>(HTTPError.UNKNOWN_SOURCE);

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): OnAsyncEvent<AllArt, HTTPError> =>
        asyncEvent(URI.from({source, params: {page, search, limit: size}})
            .map(uri => http.get(uri).flatMap(response => ({
                [Source.AIC]: aic.validateAllArt(response).map(aic.toAllArt),
                [Source.HARVARD]: harvard.validateAllArt(response).map(harvard.toAllArt),
                [Source.RIJKS]: rijks.validateAllArt(response).map(rijks.toAllArt(page)),
                [Source.UNKNOWN]: unknownSource<AllArt>()
            })[source])).orElse(unknownSource<AllArt>())),

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, HTTPError> =>
        asyncEvent(URI.from({source: source, path: `/${id}`})
            .map(uri => http.get(uri).flatMap(response => ({
                [Source.AIC]: aic.validateArt(response).map(aic.toArt),
                [Source.HARVARD]: harvard.validateArt(response).map(harvard.toArt),
                [Source.RIJKS]: rijks.validateArt(response).map(rijks.toArt),
                [Source.UNKNOWN]: unknownSource<Art>()
            })[source])).orElse(unknownSource<Art>())),

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, HTTPError> =>
        asyncEvent(URI.createSearchFrom(search, source)
            .map(uri => http.get(uri).flatMap(response => ({
                [Source.AIC]: aic.validateSearch(response).map(aic.toSearch),
                [Source.HARVARD]: harvard.validateSearch(response).map(harvard.toSearch),
                [Source.RIJKS]: rijks.validateSearch(response).map(rijks.toSearch),
                [Source.UNKNOWN]: unknownSource<SearchOptions>()
            })[source])).orElse(unknownSource<SearchOptions>()))
};