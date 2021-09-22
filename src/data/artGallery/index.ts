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
import {asyncEvent, asyncResult, maybe, OnAsyncEvent} from '@ryandur/sand';
import {explanation, Explanation, HTTPError} from '../types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';
import {http} from '../http';

const unknownSource = <T>() => asyncResult.failure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN_SOURCE));

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): OnAsyncEvent<AllArt, Explanation<HTTPError>> =>
        asyncEvent(maybe.of(matchSource<AllArtRequests>(source, {
            [Source.AIC]: () => aic.allArt,
            [Source.HARVARD]: () => harvard.allArt,
            [Source.RIJKS]: () => rijks.allArt(page),
        })).map(resource => http.get(resource.endpoint({params: {page, size, search}}))
            .flatMap(resource.validate)
            .map(resource.toAllArt))
            .orElse(unknownSource())),

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, Explanation<HTTPError>> =>
        asyncEvent(maybe.of(matchSource<ArtRequests>(source, {
            [Source.AIC]: () => aic.art,
            [Source.HARVARD]: () => harvard.art,
            [Source.RIJKS]: () => rijks.art,
        })).map(resource => http.get(resource.endpoint({path: [id]}))
            .flatMap(resource.validate)
            .map(resource.toArt))
            .orElse(unknownSource())),

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, Explanation<HTTPError>> =>
        asyncEvent(maybe.of(matchSource<SearchOptionsRequests>(source, {
            [Source.AIC]: () => aic.searchOptions,
            [Source.HARVARD]: () => harvard.searchOptions,
            [Source.RIJKS]: () => rijks.searchOptions,
        })).map(resource => http.get(resource.endpoint(search))
            .flatMap(resource.validate)
            .map(resource.toSearchOptions))
            .orElse(unknownSource()))
};