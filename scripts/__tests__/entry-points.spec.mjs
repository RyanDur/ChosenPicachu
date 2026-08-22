import {baseOf, demosLinks, preloaded} from '../entry-points.mjs';

const manifest = {
  'index.html': {file: 'assets/index-abc.js', imports: ['shared.ts']},
  'shared.ts': {file: 'assets/shared-abc.js'},
  'src/pages/Demos/index.tsx': {file: 'assets/Demos-abc.js', imports: ['shared.ts', 'table.ts']},
  'table.ts': {file: 'assets/table-abc.js'}
};
const shell = '<html><head><script type="module" src="/app/assets/index-abc.js"></script></head><body></body></html>';

describe('the entry points', () => {
  test('a demos entry preloads the demos chunk and its unshared deps', () => {
    const links = demosLinks(manifest, baseOf(shell));

    expect(links).toEqual([
      '    <link rel="modulepreload" crossorigin href="/app/assets/Demos-abc.js">',
      '    <link rel="modulepreload" crossorigin href="/app/assets/table-abc.js">'
    ]);
  });

  test('the links land inside the head of a demos entry', () => {
    const entry = preloaded(shell, demosLinks(manifest, baseOf(shell)), '/demos/');

    expect(entry).toContain('modulepreload');
    expect(entry.indexOf('modulepreload')).toBeLessThan(entry.indexOf('</head>'));
  });

  test('a page outside the demos keeps the shell byte for byte', () => {
    expect(preloaded(shell, demosLinks(manifest, baseOf(shell)), '/gallery/')).toBe(shell);
  });

  test('a build without the demos page refuses to stay silent', () => {
    expect(() => demosLinks({'index.html': {file: 'assets/index-abc.js'}}, '/app/'))
      .toThrow('the demos page is missing from the build manifest');
  });

  test('a hole in the manifest is named, not skipped', () => {
    const holed = {...manifest, 'src/pages/Demos/index.tsx': {file: 'assets/Demos-abc.js', imports: ['ghost.ts']}};

    expect(() => demosLinks(holed, '/app/')).toThrow('ghost.ts is missing from the build manifest');
  });

  test('a shell without an assets script refuses to guess the base', () => {
    expect(() => baseOf('<html><head></head></html>'))
      .toThrow('the shell has no assets script tag to read the base from');
  });
});
