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
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import {Outlet, Route, RouteObject, RouterProvider, createMemoryRouter, createRoutesFromElements, useLocation, useNavigate} from 'react-router';
import {arrival} from '@navigation/arrival';
import {SiteProviders} from '../SiteProviders';
import {Opener, RoomModule, roomsOpenedBy, siteHolding} from '../routes';
import {Environment, environment} from '@transport';
import {Feed} from '@pages/Demos/__test_support/feed';

type Props = PropsWithChildren<{
  readonly at?: string;
  readonly cameFrom?: string;
  readonly feed?: Feed;
  readonly environment?: Partial<Environment>;
}>;

const Reported = createContext<readonly string[]>([]);

const Probes: FC<{backable: boolean}> = ({backable}) => {
  const {pathname, search, hash} = useLocation();
  const navigate = useNavigate();
  const errors = useContext(Reported);
  useLayoutEffect(() => window.location.replace(`${pathname}${search}${hash}`), [pathname, search, hash]);

  return <>
    <Outlet/>
    <output aria-label="url path">{pathname}</output>
    <output aria-label="url search">{search}</output>
    <output aria-label="url fragment">{hash}</output>
    <ul aria-label="errors reported">{errors.map((error, at) => <li key={`${at} ${error}`}>{error}</li>)}</ul>
    {backable && <button type="button" onClick={() => navigate(-1)}>browser back</button>}
  </>;
};

const modules = import.meta.glob<RoomModule>('../pages/**/{route,tab}.tsx', {eager: true});

const eagerly: Opener = file => {
  const {Room, ErrorBoundary} = modules[`../${file}`];
  return {Component: Room, ErrorBoundary};
};

const siteRooms = roomsOpenedBy(eagerly);

const described = (error: unknown): string => error instanceof Error ? error.message : String(error);

const routed = (children: ReactNode): boolean =>
  Children.toArray(children).every(child => isValidElement(child) && child.type === Route);

const pathOf = (at: string): string => new URL(at, 'http://test').pathname;

const everyRoom = (rooms: RouteObject[]): RouteObject[] =>
  rooms.flatMap(room => [room, ...everyRoom(room.children ?? [])]);

const roomAt = (at: string): RouteObject | undefined =>
  everyRoom(siteRooms).find(room => room.path === pathOf(at));

const routesAt = (at: string, children: ReactNode): RouteObject[] =>
  routed(children)
    ? createRoutesFromElements(children)
    : maybe(roomAt(at))
      .map(({path, ErrorBoundary}): RouteObject[] => [{path, ErrorBoundary, element: children}])
      .orElse([{path: pathOf(at), element: children}]);

export const TestApp: FC<Props> = ({at = '/', cameFrom, feed, environment: overrides = {}, children}) => {
  const backable = has(cameFrom);
  const [memory] = useState(() => createMemoryRouter([{
    id: 'probes',
    element: <Probes backable={backable}/>,
    errorElement: <Probes backable={backable}/>,
    children: [siteHolding(has(children) ? [...routesAt(at, children), {path: '*', element: null}] : siteRooms)]
  }], {initialEntries: maybe(cameFrom).map(from => [from, at]).orElse([at]), hydrationData: {}}));
  useEffect(() => arrival.follow(memory), [memory]);
  const [reported, setReported] = useState<readonly string[]>([]);
  const report = (error: unknown): void =>
    startTransition(() => setReported(errors => [...errors, described(error)]));

  return <Reported.Provider value={reported}>
    <StrictMode>
      <SiteProviders environment={Object.defineProperties(
        {...environment, ...(has(feed) ? {tradeFeed: feed.url} : {})},
        Object.getOwnPropertyDescriptors(overrides))}>
        <RouterProvider router={memory} onError={report}/>
      </SiteProviders>
    </StrictMode>
  </Reported.Provider>;
};
