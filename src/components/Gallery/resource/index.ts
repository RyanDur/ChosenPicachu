import {asyncFailure, maybe, Result} from '@ryandur/sand';
import {GetAllArt, GetArt, SearchArt, Source} from './types/resource';
import {AllArt, Art, SearchOptions} from './types/response';
import {HTTPError} from '../../../data/types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';

const sources = {
  [Source.AIC]: aic,
  [Source.HARVARD]: harvard,
  [Source.RIJKS]: rijks
};

export const art = {
  getAll: ({source, ...request}: GetAllArt): Result.Async<AllArt, HTTPError> =>
    maybe(sources[source]).map(resource => resource.allArt(request))
      .orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

  get: ({source, id}: GetArt): Result.Async<Art, HTTPError> =>
    maybe(sources[source]).map(resource => resource.art(id))
      .orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

  search: ({source, search}: SearchArt): Result.Async<SearchOptions, HTTPError> =>
    maybe(sources[source]).map(resource => resource.searchOptions(search))
      .orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE))
};
