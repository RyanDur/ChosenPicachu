import {ReactNode, StrictMode} from 'react';
import {renderToReadableStream} from 'react-dom/server';
import {createStaticHandler, createStaticRouter, RouteObject, StaticRouterProvider} from 'react-router';
import {Paths} from '@navigation';
import names from '@navigation/names.json';
import {HydrateFallback, Layout} from './root';
import {is, not} from '@ryandur/sand';
import {lazily, siteOpenedBy} from './routes';

const basename = import.meta.env.BASE_URL;

const fixed = Object.values(Paths).filter(path => path.startsWith('/') && not(path.includes(':')));
const tabsOf = (page: string, listings: object): string[] => Object.keys(listings).map(tab => `${page}${tab}/`);

const pages = [
  ...fixed,
  ...tabsOf(Paths.demos, names.demos),
  ...tabsOf(`${Paths.demos}charts/`, names.charts),
  ...tabsOf(`${Paths.demos}tables/`, names.tables),
  ...tabsOf(Paths.practice, names.practice)
];

// a boundary written out of line waits for script to reveal it, and these pages are read without script too
const written = async (app: ReactNode): Promise<string> => {
  const failures: unknown[] = [];
  const stream = await renderToReadableStream(app, {
    progressiveChunkSize: Number.POSITIVE_INFINITY,
    onError: error => {
      failures.push(error);
    }
  });
  await stream.allReady;
  if (is(failures.length)) throw failures[0];
  return new Response(stream).text();
};

const drawn = async (routes: RouteObject[], path: string): Promise<string> => {
  const handler = createStaticHandler(routes, {basename});
  const context = await handler.query(new Request(new URL(`${basename}${path.slice(1)}`, 'http://localhost')));
  if (context instanceof Response) throw new Error(`${path} answered ${context.status}, not a page`);
  return written(<StrictMode><Layout>
    <StaticRouterProvider router={createStaticRouter(handler.dataRoutes, context)} context={context} hydrate={false}/>
  </Layout></StrictMode>);
};

const page = async (path: string): Promise<{html: string; rooms: string[]}> => {
  const rooms: string[] = [];
  const html = await drawn([siteOpenedBy(lazily(file => rooms.push(file)))], path);
  return {html, rooms};
};

const fallback = (): Promise<string> => drawn([{id: 'root', path: '*', Component: HydrateFallback}], '/');

export const prerender = {pages, page, fallback};
