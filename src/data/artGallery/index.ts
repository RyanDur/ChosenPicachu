import {AllArt, Art, GetAllArt, GetArt, matchSource, SearchArt, SearchOptions, Source} from './types';
import {asyncEvent, asyncResult, MatchOn, OnAsyncEvent} from '@ryandur/sand';
import {explanation, Explanation, HTTPError} from '../types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';
import {http} from '../http';

const unknownSource = <T>() => asyncResult.failure<T, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN_SOURCE));

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): OnAsyncEvent<AllArt, Explanation<HTTPError>> =>
        asyncEvent(matchSource(source, {
            [Source.AIC]: () =>
                http.get(aic.allArt.endpoint({params: {page, size, search}}))
                    .flatMap(aic.allArt.validate)
                    .map(aic.allArt.transform),
            [Source.HARVARD]: () =>
                http.get(harvard.allArt.endpoint({params: {page, size, search}}))
                    .flatMap(harvard.allArt.validate)
                    .map(harvard.allArt.transform),
            [Source.RIJKS]: () =>
                http.get(rijks.allArt.endpoint({params: {page, size, search}}))
                    .flatMap(rijks.allArt.validate)
                    .map(rijks.allArt.transform(page)),
            [MatchOn.DEFAULT]: () => unknownSource<AllArt>()
        })),

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, Explanation<HTTPError>> =>
        asyncEvent(matchSource(source, {
            [Source.AIC]: () =>
                http.get(aic.art.endpoint({path: [id]}))
                    .flatMap(aic.art.validate)
                    .map(aic.art.transform),
            [Source.HARVARD]: () =>
                http.get(harvard.art.endpoint({path: [id]}))
                    .flatMap(harvard.art.validate)
                    .map(harvard.art.transform),
            [Source.RIJKS]: () =>
                http.get(rijks.art.endpoint({path: [id]}))
                    .flatMap(rijks.art.validate)
                    .map(rijks.art.transform),
            [MatchOn.DEFAULT]: () => unknownSource<Art>()
        })),

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, Explanation<HTTPError>> =>
        asyncEvent(matchSource(source, {
            [Source.AIC]: () =>
                http.get(aic.searchOptions.endpoint(search))
                    .flatMap(aic.searchOptions.validate)
                    .map(aic.searchOptions.transform),
            [Source.HARVARD]: () =>
                http.get(harvard.searchOptions.endpoint(search))
                    .flatMap(harvard.searchOptions.validate)
                    .map(harvard.searchOptions.transform),
            [Source.RIJKS]: () =>
                http.get(rijks.searchOptions.endpoint(search))
                    .flatMap(rijks.searchOptions.validate)
                    .map(rijks.searchOptions.transform),
            [MatchOn.DEFAULT]: () => unknownSource<SearchOptions>()
        }))
};