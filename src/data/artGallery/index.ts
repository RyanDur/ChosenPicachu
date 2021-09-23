import {AllArtRequests, ArtRequests, SearchOptionsRequests} from './types/request';
import {asyncEvent, OnAsyncEvent} from '@ryandur/sand';
import {GetAllArt, GetArt, matchSource, SearchArt, Source} from './types/resource';
import {AllArt, Art, SearchOptions} from './types/response';
import {Explanation, HTTPError} from '../types';
import {http, unknownSource} from '../http';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';

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