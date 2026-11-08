import {createBrowserRouter, matchRoutes, RouteMatch} from 'react-router';
import {asyncSuccess, asyncTryCatch, foldAll, maybe, Result} from '@ryandur/sand';
import {lazily, siteOpenedBy} from './routes';
import {hydrateTheSite} from './hydrateTheSite';

const basename = import.meta.env.BASE_URL;
const site = siteOpenedBy(lazily());

type RoomNotLoaded = {readonly address: string; readonly thrown: unknown};

const loaded = (): Result.Async<void, RoomNotLoaded> => asyncSuccess(undefined);

const opened = ({route}: RouteMatch): Result.Async<void, RoomNotLoaded> => {
  const {lazy} = route;
  return typeof lazy === 'function'
    ? asyncTryCatch(lazy, (thrown): RoomNotLoaded => ({address: window.location.pathname, thrown})).map(room => {
      Object.assign(route, {...room, lazy: undefined});
    })
    : loaded();
};

// the page was drawn with its rooms in place, and a room still loading would hydrate as the fallback instead
foldAll<void, void, Result.Async<void, RoomNotLoaded>>(
  maybe(matchRoutes([site], window.location, basename)).orElse([]).map(opened),
  loaded,
  loaded()
).onSuccess(() => hydrateTheSite.overTheBuiltPage(createBrowserRouter([site], {basename, hydrationData: {}})))
  .onFailure(({address, thrown}) => console.error(`the room at ${address} did not load`, thrown));
