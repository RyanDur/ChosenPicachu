import {AllArt, Art, GetAllArt, GetArt, matchSource, SearchArt, SearchOptions, Source} from './types';
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
            .map(path => http.get(path).flatMap(response => matchSource(source, {
                [Source.AIC]: () => aic.validate.allArt(response).map(aic.response.toAllArt),
                [Source.HARVARD]: () => harvard.validate.allArt(response).map(harvard.response.toAllArt),
                [Source.RIJKS]: () => rijks.validate.allArt(response).map(rijks.response.toAllArt(page)),
            }))).orElse(unknownSource<AllArt>())),

    getArt: ({id, source}: GetArt): OnAsyncEvent<Art, Explanation<HTTPError>> =>
        asyncEvent(Path.from({source: source, path: [id]})
            .map(path => http.get(path).flatMap(response => matchSource(source, {
                [Source.AIC]: () => aic.validate.art(response).map(aic.response.toArt),
                [Source.HARVARD]: () => harvard.validate.art(response).map(harvard.response.toArt),
                [Source.RIJKS]: () => rijks.validate.art(response).map(rijks.response.toArt),
            }))).orElse(unknownSource<Art>())),

    searchForArt: ({search, source}: SearchArt): OnAsyncEvent<SearchOptions, Explanation<HTTPError>> =>
        asyncEvent(Path.createSearchFrom(search, source)
            .map(path => http.get(path).flatMap(response => matchSource(source, {
                [Source.AIC]: () => aic.validate.search(response).map(aic.response.toSearch),
                [Source.HARVARD]: () => harvard.validate.search(response).map(harvard.response.toSearch),
                [Source.RIJKS]: () => rijks.validate.search(response).map(rijks.response.toSearch),
            }))).orElse(unknownSource<SearchOptions>()))
};