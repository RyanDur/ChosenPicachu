import {AllArtRequests, ArtRequests, SearchOptionsRequests} from './types/request';
import {ArtGallery, OnAllArtAsyncEvent, OnArtAsyncEvent, OnSearchOptionsAsyncEvent} from './types';
import {asyncEvent} from '@ryandur/sand';
import {matchSource, Source} from './types/resource';
import {http, unknownSource} from '../http';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';

export const artGallery: ArtGallery = {
    getAllArt: ({page, size, source, search}): OnAllArtAsyncEvent =>
        asyncEvent(matchSource<AllArtRequests>(source, {
            [Source.AIC]: () => aic.allArt,
            [Source.HARVARD]: () => harvard.allArt,
            [Source.RIJKS]: () => rijks.allArt(page),
        }).map(({endpoint, validate, toAllArt}) =>
            http.get(endpoint({params: {page, size, search}})).flatMap(validate).map(toAllArt)
        ).orElse(unknownSource())),

    getArt: ({id, source}): OnArtAsyncEvent =>
        asyncEvent(matchSource<ArtRequests>(source, {
            [Source.AIC]: () => aic.art,
            [Source.HARVARD]: () => harvard.art,
            [Source.RIJKS]: () => rijks.art,
        }).map(({endpoint, validate, toArt}) =>
            http.get(endpoint({path: [id]})).flatMap(validate).map(toArt)
        ).orElse(unknownSource())),

    searchForArt: ({search, source}): OnSearchOptionsAsyncEvent =>
        asyncEvent(matchSource<SearchOptionsRequests>(source, {
            [Source.AIC]: () => aic.searchOptions,
            [Source.HARVARD]: () => harvard.searchOptions,
            [Source.RIJKS]: () => rijks.searchOptions,
        }).map(({endpoint, validate, toSearchOptions}) =>
            http.get(endpoint(search)).flatMap(validate).map(toSearchOptions)
        ).orElse(unknownSource()))
};