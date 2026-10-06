import {has, maybe} from '@ryandur/sand';
import {
  Children,
  FC,
  PropsWithChildren,
  ReactNode,
  createContext,
  isValidElement,
  startTransition,
  useContext,
  useLayoutEffect,
  useState
} from 'react';
import {Outlet, Route, RouteObject, createMemoryRouter, createRoutesFromElements, useLocation, useNavigate} from 'react-router';
import {App} from '../App';
import {router} from '../router';
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
  const navigate = useNavigate();
  useLayoutEffect(() => window.location.replace(`${pathname}${search}${hash}`), [pathname, search, hash]);

  return <>
    <Outlet/>
    <output aria-label="url path">{pathname}</output>
    <output aria-label="url search">{search}</output>
    <button type="button" onClick={() => void navigate(-1)}>browser back</button>
    <ul aria-label="errors reported">{errors.map((error, at) => <li key={`${at} ${error}`}>{error}</li>)}</ul>
  </>;
};

const described = (error: unknown): string => error instanceof Error ? error.message : String(error);

const routed = (children: ReactNode): boolean =>
  Children.toArray(children).every(child => isValidElement(child) && child.type === Route);

const pathOf = (at: string): string => new URL(at, 'http://test').pathname;

const roomAt = (at: string): RouteObject | undefined =>
  router.children.find((room: RouteObject) => room.path === pathOf(at));

const routesAt = (at: string, children: ReactNode): RouteObject[] =>
  routed(children)
    ? createRoutesFromElements(children)
    : maybe(roomAt(at))
      .map(({path, errorElement, handle}): RouteObject[] => [{path, errorElement, handle, element: children}])
      .orElse([{path: pathOf(at), element: children}]);

export const TestApp: FC<Props> = ({at = '/', feed, env: overrides, children}) => {
  const [memory] = useState(() => createMemoryRouter([{
    id: 'probes',
    element: <Probes/>,
    errorElement: <Probes/>,
    children: [has(children) ? {
      ...router,
      id: 'root',
      children: [...routesAt(at, children), {path: '*', element: null}]
    } : router]
  }], {initialEntries: [at]}));
  const [reported, setReported] = useState<readonly string[]>([]);
  const report = (error: unknown): void =>
    startTransition(() => setReported(errors => [...errors, described(error)]));

  return <Reported.Provider value={reported}>
    <App router={memory} onError={report} env={{...env, ...(has(feed) ? {tradeFeed: feed.url} : {}), ...overrides}}/>
  </Reported.Provider>;
};
