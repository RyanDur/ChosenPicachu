import {pageChunks} from '../preload';

const pageSources: Record<string, unknown> =
  import.meta.glob('../**/*.tsx', {query: '?raw', import: 'default', eager: true});

describe('every lazy route is warmed', () => {
  test('the preload list covers each lazy() page — add the chunk when you add the route', () => {
    const lazyRoutes = Object.entries(pageSources)
      .filter(([file]) => !file.includes('__tests__'))
      .flatMap(([, source]) => String(source).match(/lazy\(\(\) => import\(/g) ?? []);

    expect(pageChunks.length).toBe(lazyRoutes.length);
  });
});
