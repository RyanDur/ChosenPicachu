import {Result} from '@ryandur/sand';
import {GetAllArt, GetArt, SearchArt, Source} from '@components/art-gallery/museums/types/resource';
import {AllArt, Art, SearchOptions} from '@components/art-gallery/museums/types/response';
import {HTTPError} from '@transport/types';
import {aic} from '@components/art-gallery/museums/aic';
import {harvard} from '@components/art-gallery/museums/harvard';
import {vam} from '@components/art-gallery/museums/vam';
import {cleveland} from '@components/art-gallery/museums/cleveland';

type ArtResource = typeof aic | typeof harvard | typeof vam | typeof cleveland;
const resources: Record<Source, ArtResource> = {
  [Source.AIC]: aic,
  [Source.HARVARD]: harvard,
  [Source.VAM]: vam,
  [Source.CLEVELAND]: cleveland
};
const fromSource = <T>(source: Source, func: (resource: ArtResource) => Result.Async<T, HTTPError>) =>
  func(resources[source]);

export const art = {
  getAll: ({source, ...request}: GetAllArt): Result.Async<AllArt, HTTPError> =>
    fromSource(source, resource => resource.allArt(request)),

  get: ({source, id}: GetArt): Result.Async<Art, HTTPError> =>
    fromSource(source, resource => resource.art(id)),

  open: (source: Source): Result.Async<boolean, HTTPError> =>
    fromSource(source, resource => resource.open()),

  search: ({source, search}: SearchArt): Result.Async<SearchOptions, HTTPError> =>
    fromSource(source, resource => resource.searchOptions(search))
};
