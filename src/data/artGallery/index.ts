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
        asyncEvent(http.get(URI.from({source, params: {page, search, limit: size}}))
            .flatMap(response => {
                switch (source) {
                    case Source.AIC:
                        return aic.validateAllArt(response).map(aic.toAllArt);
                    case Source.HARVARD:
                        return harvard.validateAllArt(response).map(harvard.toAllArt);
                    case Source.RIJKS:
                        return rijks.validateAllArt(response).map(rijks.toAllArt(page));
                    default:
                        return unknownSource();
                }
            })),

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, HTTPError> =>
        asyncEvent(http.get(URI.from({source: source, path: `/${id}`}))
            .flatMap(response => {
                switch (source) {
                    case Source.AIC:
                        return aic.validateArt(response).map(aic.toArt);
                    case Source.HARVARD:
                        return harvard.validateArt(response).map(harvard.toArt);
                    case Source.RIJKS:
                        return rijks.validateArt(response).map(rijks.toArt);
                    default:
                        return unknownSource();
                }
            })),

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, HTTPError> =>
        asyncEvent(http.get(URI.createSearchFrom(search, source))
            .flatMap(response => {
                switch (source) {
                    case Source.AIC:
                        return aic.validateSearch(response).map(aic.toSearch);
                    case Source.HARVARD:
                        return harvard.validateSearch(response).map(harvard.toSearch);
                    case Source.RIJKS:
                        return rijks.validateSearch(response).map(rijks.toSearch);
                    default:
                        return unknownSource();
                }
            }))
};