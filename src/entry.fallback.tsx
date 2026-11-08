import {createBrowserRouter, matchRoutes} from 'react-router';
import {lazily, siteOpenedBy} from './routes';
import {hydrateTheSite} from './hydrateTheSite';

const basename = import.meta.env.BASE_URL;
const site = siteOpenedBy(lazily());

let markDrawn = (): void => undefined;
const drawn = new Promise<void>(resolve => {
  markDrawn = resolve;
});

// the document holds the fallback, and a room that arrived before the first draw would be drawn over it instead
(matchRoutes([site], window.location, basename) ?? []).forEach(({route}) => {
  const {lazy} = route;
  if (typeof lazy === 'function') Object.assign(route, {lazy: async () => {
    await drawn;
    return lazy();
  }});
});

hydrateTheSite(() => createBrowserRouter([site], {basename}), markDrawn);
