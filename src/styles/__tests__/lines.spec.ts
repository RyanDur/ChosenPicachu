import {describe, expect, test} from 'vitest';

const sheets: Record<string, string> = import.meta.glob('/src/**/*.css', {query: '?raw', import: 'default', eager: true});

const namedLines = (): number[] =>
  [...sheets['/src/styles/spacing.css'].matchAll(/--(?:no-gutters|nav-in-a-row|search-under-the-title|room-to-stand-open):\s*(\d+)px/g)]
    .map(([, px]) => Number(px));

const ownLines: Record<string, number[]> = {
  '/src/pages/Users/UserInformation/Address/Address.css': [456]
};

const pixels = (length: string): number => length.endsWith('rem') ? Math.round(parseFloat(length) * 10) : parseFloat(length);

const queriedLines = (css: string): number[] =>
  [...css.matchAll(/\((?:width|height) [<>]=? ([\d.]+(?:px|rem))\)|\(([\d.]+(?:px|rem)) [<>]=? (?:width|height)\)/g)]
    .map(([, after, before]) => pixels(after ?? before));

describe('the lines the sheets break at', () => {
  test("are read in rem at the root's 10px", () => {
    expect(queriedLines('@container (width <= 45.6rem) {}')).toEqual([456]);
  });

  test('are read in every range form a query can take', () => {
    expect(queriedLines('@media (width <= 600px), (height < 500px), (700px <= width), (800px > height) {}')).toEqual([600, 500, 700, 800]);
  });

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
