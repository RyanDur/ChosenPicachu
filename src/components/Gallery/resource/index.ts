import {asyncFailure, maybe, Result} from '@ryandur/sand';
import {GetAllArt, GetArt, SearchArt, Source} from './types/resource';
import {AllArt, Art, SearchOptions} from './types/response';
import {HTTPError} from '@transport/types';
import {aic} from './aic';
import {harvard} from './harvard';
import {vam} from './vam';

type ArtResource = typeof aic | typeof harvard | typeof vam;
const fromSource = <T>(source: Source, func: (resource: ArtResource) => Result.Async<T, HTTPError>) =>
  maybe({
    [Source.AIC]: aic,
    [Source.HARVARD]: harvard,
    [Source.VAM]: vam
  }[source]).map(func).orElse(asyncFailure(HTTPError.UNKNOWN_SOURCE));

export const art = {
  getAll: ({source, ...request}: GetAllArt): Result.Async<AllArt, HTTPError> =>
    fromSource(source, resource => resource.allArt(request)),

  get: ({source, id}: GetArt): Result.Async<Art, HTTPError> =>
    fromSource(source, resource => resource.art(id)),

  search: ({source, search}: SearchArt): Result.Async<SearchOptions, HTTPError> =>
    fromSource(source, resource => resource.searchOptions(search))
};
