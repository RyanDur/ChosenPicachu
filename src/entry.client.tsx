import {createBrowserRouter, matchRoutes, RouteObject} from 'react-router';
import {asyncResult, asyncSuccess, foldAll, maybe, Result} from '@ryandur/sand';
import {lazily, siteOpenedBy} from './routes';
import {hydrateTheSite} from './hydrateTheSite';

const basename = import.meta.env.BASE_URL;
const site = siteOpenedBy(lazily());

const opened = (route: RouteObject): Result.Async<void, unknown> => {
  const {lazy} = route;
  return typeof lazy === 'function'
    ? asyncResult(lazy()).map(room => {
      Object.assign(route, {...room, lazy: undefined});
    })
    : asyncSuccess(undefined);
};

// the page was drawn with its rooms in place, and a room still loading would hydrate as the fallback instead
foldAll(
  maybe(matchRoutes([site], window.location, basename)).orElse([]).map(({route}) => opened(route)),
  () => asyncSuccess(undefined),
  asyncSuccess(undefined)
).onSuccess(() => hydrateTheSite.overTheBuiltPage(() => createBrowserRouter([site], {basename, hydrationData: {}})));
