import {createBrowserRouter, matchRoutes} from 'react-router';
import {lazily, siteOpenedBy} from './routes';
import {hydrateTheSite} from './hydrateTheSite';

const basename = import.meta.env.BASE_URL;
const site = siteOpenedBy(lazily());

// the page was drawn with its rooms in place, and a room still loading would hydrate as the fallback instead
await Promise.all((matchRoutes([site], window.location, basename) ?? []).map(async ({route}) => {
  const {lazy} = route;
  if (typeof lazy === 'function') Object.assign(route, {...await lazy(), lazy: undefined});
}));

hydrateTheSite.overTheBuiltPage(() => createBrowserRouter([site], {basename, hydrationData: {}}));
