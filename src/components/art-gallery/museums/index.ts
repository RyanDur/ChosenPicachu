import {asyncFailure, maybe, Result} from '@ryandur/sand';
import {GetAllArt, GetArt, SearchArt, Source} from '@components/art-gallery/museums/types/resource';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/types/response';
import {HTTPError} from '@transport/types';
import {aic} from '@components/art-gallery/museums/aic';
import {harvard} from '@components/art-gallery/museums/harvard';
import {vam} from '@components/art-gallery/museums/vam';

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
