import {has, maybe} from '@ryandur/sand';
import {
  Children,
  FC,
  PropsWithChildren,
  ReactNode,
  StrictMode,
  createContext,
  isValidElement,
  startTransition,
  useContext,
  useLayoutEffect,
  useState
} from 'react';
import {Outlet, Route, RouteObject, RouterProvider, createMemoryRouter, createRoutesFromElements, useLocation} from 'react-router';
import {SiteProviders} from '../SiteProviders';
import * as root from '../root';
import rooms from '../routes';
import {Env, env} from '@env';
import {Feed} from '@pages/Demos/__test_support/feed';

type Props = PropsWithChildren<{
  readonly at?: string;
  readonly feed?: Feed;
  readonly env?: Partial<Env>;
}>;

const Reported = createContext<readonly string[]>([]);

const Probes: FC = () => {
  const {pathname, search, hash} = useLocation();
  const errors = useContext(Reported);
  useLayoutEffect(() => window.location.replace(`${pathname}${search}${hash}`), [pathname, search, hash]);

  return <>
    <Outlet/>
    <output aria-label="url path">{pathname}</output>
    <output aria-label="url search">{search}</output>
    <ul aria-label="errors reported">{errors.map((error, at) => <li key={`${at} ${error}`}>{error}</li>)}</ul>
  </>;
};

type RouteModule = {readonly default: FC; readonly ErrorBoundary?: FC};

const modules = import.meta.glob<RouteModule>('../pages/**/route.tsx', {eager: true});

const roomOf = ({path, file}: {path?: string; file: string}): RouteObject => {
  const {default: Component, ErrorBoundary} = modules[`../${file}`];
  return {path, Component, ErrorBoundary};
};

const siteRoute = {
  path: '/',
  Component: root.default,
  ErrorBoundary: root.ErrorBoundary,
  HydrateFallback: root.HydrateFallback,
  children: rooms.map(roomOf)
};

const described = (error: unknown): string => error instanceof Error ? error.message : String(error);

const routed = (children: ReactNode): boolean =>
  Children.toArray(children).every(child => isValidElement(child) && child.type === Route);

const pathOf = (at: string): string => new URL(at, 'http://test').pathname;

const roomAt = (at: string): RouteObject | undefined =>
  siteRoute.children.find((room: RouteObject) => room.path === pathOf(at));

const routesAt = (at: string, children: ReactNode): RouteObject[] =>
  routed(children)
    ? createRoutesFromElements(children)
    : maybe(roomAt(at))
      .map(({path, ErrorBoundary}): RouteObject[] => [{path, ErrorBoundary, element: children}])
      .orElse([{path: pathOf(at), element: children}]);

export const TestApp: FC<Props> = ({at = '/', feed, env: overrides, children}) => {
  const [memory] = useState(() => createMemoryRouter([{
    id: 'probes',
    element: <Probes/>,
    errorElement: <Probes/>,
    children: [has(children) ? {
      ...siteRoute,
      id: 'root',
      children: [...routesAt(at, children), {path: '*', element: null}]
    } : siteRoute]
  }], {initialEntries: [at]}));
  const [reported, setReported] = useState<readonly string[]>([]);
  const report = (error: unknown): void =>
    startTransition(() => setReported(errors => [...errors, described(error)]));

  return <Reported.Provider value={reported}>
    <StrictMode>
      <SiteProviders env={{...env, ...(has(feed) ? {tradeFeed: feed.url} : {}), ...overrides}}>
        <RouterProvider router={memory} onError={report}/>
      </SiteProviders>
    </StrictMode>
  </Reported.Provider>;
};
