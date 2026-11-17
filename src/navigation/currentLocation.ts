import {Context, createContext} from 'react';
import {DataRouter, Location} from 'react-router';

type CurrentLocation = {
  Read: Context<() => Location>;
  of: (router: DataRouter) => () => Location;
};

const Read = createContext<() => Location>(() => {
  throw new Error('the current location is read from a router, and none provides it');
});

const withoutBasename = (pathname: string, basename: string): string => {
  const start = basename.endsWith('/') ? basename.length - 1 : basename.length;
  const underBasename = pathname.toLowerCase().startsWith(basename.slice(0, start).toLowerCase())
    && ['', '/'].includes(pathname.charAt(start));
  return underBasename ? pathname.slice(start) || '/' : pathname;
};

// the router's location keeps the basename; useLocation and ScrollRestoration's getKey both see it stripped
const of: CurrentLocation['of'] = router => () => {
  const {location} = router.state;
  return {...location, pathname: withoutBasename(location.pathname, router.basename ?? '/')};
};

export const currentLocation: CurrentLocation = {Read, of};
