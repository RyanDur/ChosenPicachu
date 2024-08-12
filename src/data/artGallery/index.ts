import {asyncFailure, Result} from '@ryandur/sand';
import {GetAllArt, GetArt, matchSource, SearchArt, Source} from './types/resource';
import {AllArt, Art, SearchOptions} from './types/response';
import {HTTPError} from '../types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';

export const artGallery = {
  getAllArt: ({page, size, source, search}: GetAllArt): Result.Async<AllArt, HTTPError> =>
    matchSource(source, {
      [Source.AIC]: () => aic.allArt({page, size, search}),
      [Source.HARVARD]: () => harvard.allArt({page, size, search}),
      [Source.RIJKS]: () => rijks.allArt({page, size, search})
    }).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

  getArt: ({id, source}: GetArt): Result.Async<Art, HTTPError> =>
    matchSource(source, {
      [Source.AIC]: () => aic.art(id),
      [Source.HARVARD]: () => harvard.art(id),
      [Source.RIJKS]: () => rijks.art(id)
    }).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

  searchForArt: ({search, source}: SearchArt): Result.Async<SearchOptions, HTTPError> =>
    matchSource(source, {
      [Source.AIC]: () => aic.searchOptions(search),
      [Source.HARVARD]: () => harvard.searchOptions(search),
      [Source.RIJKS]: () => rijks.searchOptions(search)
    }).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE))
};
