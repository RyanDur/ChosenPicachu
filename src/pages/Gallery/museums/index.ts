import {Result} from '@ryandur/sand';
import {GetAllArt, GetArt, SearchArt, Source} from '@pages/Gallery/museums/source';
import {AllArt, Art, SearchOptions} from '@pages/Gallery/museums/art';
import {HTTPError} from '@transport/types';
import {aic} from '@pages/Gallery/museums/aic';
import {harvard} from '@pages/Gallery/museums/harvard';
import {vam} from '@pages/Gallery/museums/vam';
import {cleveland} from '@pages/Gallery/museums/cleveland';

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

export type {AllArt} from '@pages/Gallery/museums/art';
export type {MuseumReply} from '@pages/Gallery/museums/reply';
export {standingOf} from '@pages/Gallery/museums/reply';
export {sourceParam} from '@pages/Gallery/museums/source';
