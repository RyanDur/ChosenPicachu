import {describe, expect, test} from 'vitest';

const sheets: Record<string, string> = import.meta.glob('/src/**/*.css', {query: '?raw', import: 'default', eager: true});

const namedLines = (): string[] =>
  [...sheets['/src/styles/spacing.css'].matchAll(/--(?:no-gutters|nav-in-a-row|search-under-the-title|room-to-stand-open|phone-held-upright|phone-on-its-side):\s*(\d+)px/g)]
    .map(([, px]) => `${px}px`);

const ownLines: Record<string, string[]> = {
  '/src/pages/Users/UserInformation/Address/Address.css': ['456px'],
  '/src/components/PillGlider/PillGlider.css': ['390px'],
  '/src/pages/Demos/Charts/Workspace.css': ['870px'],
  '/src/pages/Practice/ClassList.css': ['860px'],
  '/src/pages/Practice/PracticeDrawing.css': ['855px'],
  '/src/pages/Demos/Runs.css': ['92ch']
};

const asLine = (length: string): string => length.endsWith('rem') ? `${Math.round(parseFloat(length) * 10)}px` : length;

const queriedLines = (css: string): string[] =>
  [...css.matchAll(/\((?:width|height) [<>]=? ([\d.]+(?:px|rem|ch))\)|\(([\d.]+(?:px|rem|ch)) [<>]=? (?:width|height)\)/g)]
    .map(([, after, before]) => asLine(after ?? before));

describe('the lines the sheets break at', () => {
  test("are read in rem at the root's 10px", () => {
    expect(queriedLines('@container (width <= 45.6rem) {}')).toEqual(['456px']);
  });

  test('are read in ch, the unit a line set by a measure is written in', () => {
    expect(queriedLines('@container (width >= 92ch) {}')).toEqual(['92ch']);
  });

  test('are read in every range form a query can take', () => {
    expect(queriedLines('@media (width <= 600px), (height < 500px), (700px <= width), (800px > height) {}')).toEqual(['600px', '500px', '700px', '800px']);
  });

  test('are the named ones in spacing.css, or a line the sheet owns', () => {
    const named = namedLines();
    const strays = Object.entries(sheets).flatMap(([path, css]) =>
      queriedLines(css)
        .filter(line => !named.includes(line) && !(ownLines[path] ?? []).includes(line))
        .map(line => `${path} breaks at ${line}`));

    expect(named).toHaveLength(6);
    expect(strays).toEqual([]);
  });

  test('include a sheet\'s own line only while that sheet still breaks at it', () => {
    const unused = Object.entries(ownLines).flatMap(([path, lines]) =>
      lines.filter(line => !queriedLines(sheets[path] ?? '').includes(line)).map(line => `${path} no longer breaks at ${line}`));

    expect(unused).toEqual([]);
  });
});
