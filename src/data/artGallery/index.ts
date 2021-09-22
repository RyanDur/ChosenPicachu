import {
    AllArt,
    AllArtRequests,
    Art,
    ArtRequests,
    GetAllArt,
    GetArt,
    matchSource,
    SearchArt,
    SearchOptions,
    SearchOptionsRequests,
    Source
} from './types';
import {asyncEvent, asyncResult, OnAsyncEvent} from '@ryandur/sand';
import {explanation, Explanation, HTTPError} from '../types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';
import {http} from '../http';

const unknownSource = <T>() => asyncResult.failure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN_SOURCE));

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): OnAsyncEvent<AllArt, Explanation<HTTPError>> =>
        asyncEvent(matchSource<AllArtRequests>(source, {
            [Source.AIC]: () => aic.allArt,
            [Source.HARVARD]: () => harvard.allArt,
            [Source.RIJKS]: () => rijks.allArt(page),
        }).map(({endpoint, validate, toAllArt}) =>
            http.get(endpoint({params: {page, size, search}})).flatMap(validate).map(toAllArt)
        ).orElse(unknownSource())),

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, Explanation<HTTPError>> =>
        asyncEvent(matchSource<ArtRequests>(source, {
            [Source.AIC]: () => aic.art,
            [Source.HARVARD]: () => harvard.art,
            [Source.RIJKS]: () => rijks.art,
        }).map(({endpoint, validate, toArt}) =>
            http.get(endpoint({path: [id]})).flatMap(validate).map(toArt)
        ).orElse(unknownSource())),

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, Explanation<HTTPError>> =>
        asyncEvent(matchSource<SearchOptionsRequests>(source, {
            [Source.AIC]: () => aic.searchOptions,
            [Source.HARVARD]: () => harvard.searchOptions,
            [Source.RIJKS]: () => rijks.searchOptions,
        }).map(({endpoint, validate, toSearchOptions}) =>
            http.get(endpoint(search)).flatMap(validate).map(toSearchOptions)
        ).orElse(unknownSource()))
};