import {AllArt, Art, GetAllArt, GetArt, SearchArt, SearchOptions, Source, toSource} from './types';
import {asyncEvent, asyncResult, OnAsyncEvent} from '@ryandur/sand';
import {explanation, Explanation, HTTPError} from '../types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';
import {http} from '../http';
import {Path} from './Path';

const unknownSource = <T>() => asyncResult.failure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN_SOURCE));

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): OnAsyncEvent<AllArt, Explanation<HTTPError>> =>
        asyncEvent(Path.from({source, params: {page, search, limit: size}})
            .map(path => http.get(path).flatMap(response => ({
                [Source.AIC]: () => aic.validateAllArt(response).map(aic.toAllArt),
                [Source.HARVARD]: () => harvard.validateAllArt(response).map(harvard.toAllArt),
                [Source.RIJKS]: () => rijks.validateAllArt(response).map(rijks.toAllArt(page)),
                [Source.UNKNOWN]: () => unknownSource<AllArt>()
            })[toSource(source)]())).orElse(unknownSource<AllArt>())),

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, Explanation<HTTPError>> =>
        asyncEvent(Path.from({source: source, path: [id]})
            .map(path => http.get(path).flatMap(response => ({
                [Source.AIC]: () => aic.validateArt(response).map(aic.toArt),
                [Source.HARVARD]: () => harvard.validateArt(response).map(harvard.toArt),
                [Source.RIJKS]: () => rijks.validateArt(response).map(rijks.toArt),
                [Source.UNKNOWN]: () => unknownSource<Art>()
            })[toSource(source)]())).orElse(unknownSource<Art>())),

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, Explanation<HTTPError>> =>
        asyncEvent(Path.createSearchFrom(search, source)
            .map(path => http.get(path).flatMap(response => ({
                [Source.AIC]: () => aic.validateSearch(response).map(aic.toSearch),
                [Source.HARVARD]: () => harvard.validateSearch(response).map(harvard.toSearch),
                [Source.RIJKS]: () => rijks.validateSearch(response).map(rijks.toSearch),
                [Source.UNKNOWN]: () => unknownSource<SearchOptions>()
            })[toSource(source)]())).orElse(unknownSource<SearchOptions>()))
};