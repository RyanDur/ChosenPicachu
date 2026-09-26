import {describe, expect, test} from 'vitest';

const sheets: Record<string, string> = import.meta.glob('/src/**/*.css', {query: '?raw', import: 'default', eager: true});

const namedLines = (): number[] =>
  [...sheets['/src/styles/spacing.css'].matchAll(/--(?:no-gutters|nav-in-a-row|search-under-the-title|room-to-stand-open):\s*(\d+)px/g)]
    .map(([, px]) => Number(px));

const ownLines: Record<string, number[]> = {
  '/src/pages/Users/UserInformation/Address/Address.css': [832],
  '/src/pages/Demos/Recipe/Recipe.css': [900]
};

const queriedLines = (css: string): number[] =>
  [...css.matchAll(/\((?:width|height) [<>]= (\d+)px\)/g)].map(([, px]) => Number(px));

describe('the lines the sheets break at', () => {
  test('are the named ones in spacing.css, or a line the sheet owns', () => {
    const named = namedLines();
    const strays = Object.entries(sheets).flatMap(([path, css]) =>
      queriedLines(css)
        .filter(line => !named.includes(line) && !(ownLines[path] ?? []).includes(line))
        .map(line => `${path} breaks at ${line}px`));

    expect(named).toHaveLength(4);
    expect(strays).toEqual([]);
  });
});
