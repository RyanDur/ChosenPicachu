import {asyncFailure, maybe, Result} from '@ryandur/sand';
import {GetAllArt, GetArt, SearchArt, Source} from './types/resource';
import {AllArt, Art, SearchOptions} from './types/response';
import {HTTPError} from '../../../data/types';
import {aic} from './aic';
import {harvard} from './harvard';
import {rijks} from './rijks';

export const art = {
  getAll: ({source, ...request}: GetAllArt): Result.Async<AllArt, HTTPError> =>
    maybe({
      [Source.AIC]: () => aic.allArt(request),
      [Source.HARVARD]: () => harvard.allArt(request),
      [Source.RIJKS]: () => rijks.allArt(request)
    }[source])
      .map(allArt => allArt())
      .orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

  get: ({source, id}: GetArt): Result.Async<Art, HTTPError> =>
    maybe({
      [Source.AIC]: () => aic.art(id),
      [Source.HARVARD]: () => harvard.art(id),
      [Source.RIJKS]: () => rijks.art(id)
    }[source])
      .map(art => art())
      .orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE)),

  search: ({source, search}: SearchArt): Result.Async<SearchOptions, HTTPError> =>
    maybe({
      [Source.AIC]: () => aic.searchOptions(search),
      [Source.HARVARD]: () => harvard.searchOptions(search),
      [Source.RIJKS]: () => rijks.searchOptions(search)
    }[source])
      .map(searchOptions => searchOptions())
      .orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE))
};
