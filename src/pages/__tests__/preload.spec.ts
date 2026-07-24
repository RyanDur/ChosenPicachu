import {fakerHeavyPages, pageChunks} from '../preload';

const pageSources: Record<string, unknown> =
  import.meta.glob('../**/*.tsx', {query: '?raw', import: 'default', eager: true});

describe('every lazy route is warmed', () => {
  test('warm list plus the named faker-heavy exemptions covers each lazy() page', () => {
    const lazyRoutes = Object.entries(pageSources)
      .filter(([file]) => !file.includes('__tests__'))
      .flatMap(([, source]) => String(source).match(/lazy\(\(\) => import\(/g) ?? []);

    expect(pageChunks.length + fakerHeavyPages.length).toBe(lazyRoutes.length);
  });
});
