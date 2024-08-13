import {asyncFailure, Result} from '@ryandur/sand';
import {GetAllArt, GetArt, matchSource, SearchArt, Source} from './types/resource';
import {AllArt, Art, SearchOptions} from './types/response';
import {HTTPError} from '../../../data/types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';

export const resource = {
  getAllArt: ({source, ...request}: GetAllArt): Result.Async<AllArt, HTTPError> =>
    matchSource(source, {
      [Source.AIC]: () => aic.allArt(request),
      [Source.HARVARD]: () => harvard.allArt(request),
      [Source.RIJKS]: () => rijks.allArt(request)
    }).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

  getArt: ({source, id}: GetArt): Result.Async<Art, HTTPError> =>
    matchSource(source, {
      [Source.AIC]: () => aic.art(id),
      [Source.HARVARD]: () => harvard.art(id),
      [Source.RIJKS]: () => rijks.art(id)
    }).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

  searchForArt: ({source, search}: SearchArt): Result.Async<SearchOptions, HTTPError> =>
    matchSource(source, {
      [Source.AIC]: () => aic.searchOptions(search),
      [Source.HARVARD]: () => harvard.searchOptions(search),
      [Source.RIJKS]: () => rijks.searchOptions(search)
    }).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE))
};
