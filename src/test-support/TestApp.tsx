import {has} from '@ryandur/sand';
import {
  Children,
  FC,
  PropsWithChildren,
  ReactNode,
  createContext,
  isValidElement,
  startTransition,
  useContext,
  useState,
} from 'react';
import {Outlet, Route, RouteObject, createMemoryRouter, createRoutesFromElements, useLocation} from 'react-router';
import {App} from '../App';
import {rooms, router} from '../router';
import {env} from '@env';
import {Feed} from './feed';

type Props = PropsWithChildren<{
  readonly at?: string;
  readonly feed?: Feed;
}>;

const Reported = createContext<readonly string[]>([]);

const Probes: FC = () => {
  const {pathname, search} = useLocation();
  const errors = useContext(Reported);

  return <>
    <Outlet/>
    <output aria-label="url path">{pathname}</output>
    <output aria-label="url search">{search}</output>
    <ul aria-label="errors reported">{errors.map((error, at) => <li key={`${at} ${error}`}>{error}</li>)}</ul>
  </>;
};

const described = (error: unknown): string => error instanceof Error ? error.message : String(error);

const routed = (children: ReactNode): boolean =>
  Children.toArray(children).every(child => isValidElement(child) && child.type === Route);

const pathOf = (at: string): string => new URL(at, 'http://test').pathname;

const routesAt = (at: string, children: ReactNode): RouteObject[] =>
  routed(children) ? createRoutesFromElements(children) : [{path: pathOf(at), element: children}];

export const TestApp: FC<Props> = ({at = '/', feed, children}) => {
  const [memory] = useState(() => createMemoryRouter([{
    id: 'probes',
    element: <Probes/>,
    errorElement: <Probes/>,
    children: [has(children) ? {
      ...router,
      id: 'root',
      children: [{...rooms, children: [...routesAt(at, children), {path: '*', element: null}]}]
    } : router]
  }], {initialEntries: [at]}));
  const [reported, setReported] = useState<readonly string[]>([]);
  const report = (error: unknown): void =>
    startTransition(() => setReported(errors => [...errors, described(error)]));

  return <Reported.Provider value={reported}>
    <App router={memory} onError={report} env={has(feed) ? {...env, tradeFeed: feed.url} : env}/>
  </Reported.Provider>;
};
