import {AllArtRequests, ArtRequests, SearchOptionsRequests} from './types/request';
import {Result} from '@ryandur/sand';
import {GetAllArt, GetArt, matchSource, SearchArt, Source} from './types/resource';
import {AllArt, Art, SearchOptions} from './types/response';
import {Explanation, HTTPError} from '../types';
import {http, unknownSource} from '../http';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';

export const artGallery = {
    getAllArt: ({page, size, source, search}: GetAllArt): Result.Async<AllArt, Explanation<HTTPError>> =>
        matchSource<AllArtRequests>(source, {
            [Source.AIC]: () => aic.allArt,
            [Source.HARVARD]: () => harvard.allArt,
            [Source.RIJKS]: () => rijks.allArt(page),
        }).map(({endpoint, validate, toAllArt}) =>
            http.get(endpoint({params: {page, size, search}})).mBind(validate).map(toAllArt)
        ).orElse(unknownSource()),

    getArt: ({id, source}: GetArt): Result.Async<Art, Explanation<HTTPError>> =>
        matchSource<ArtRequests>(source, {
            [Source.AIC]: () => aic.art,
            [Source.HARVARD]: () => harvard.art,
            [Source.RIJKS]: () => rijks.art,
        }).map(({endpoint, validate, toArt}) =>
            http.get(endpoint({path: [id]})).mBind(validate).map(toArt)
        ).orElse(unknownSource()),

    searchForArt: ({search, source}: SearchArt): Result.Async<SearchOptions, Explanation<HTTPError>> =>
        matchSource<SearchOptionsRequests>(source, {
            [Source.AIC]: () => aic.searchOptions,
            [Source.HARVARD]: () => harvard.searchOptions,
            [Source.RIJKS]: () => rijks.searchOptions,
        }).map(({endpoint, validate, toSearchOptions}) =>
            http.get(endpoint(search)).mBind(validate).map(toSearchOptions)
        ).orElse(unknownSource())
};
