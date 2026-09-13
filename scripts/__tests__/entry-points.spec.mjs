import {readFileSync} from 'node:fs';
import {baseOf, demosLinks, preloaded, staticRoutesOf} from '../entry-points.mjs';
import {Paths} from '@pages/Paths';

const pathsSource = readFileSync('src/pages/Paths.ts', 'utf-8');

const manifest = {
  'index.html': {file: 'assets/index-abc.js', imports: ['shared.ts']},
  'shared.ts': {file: 'assets/shared-abc.js'},
  'src/pages/Demos/index.tsx': {file: 'assets/Demos-abc.js', imports: ['shared.ts', 'table.ts']},
  'table.ts': {file: 'assets/table-abc.js'}
};
// language=TEXT
const shell = '<html lang="en"><head><script type="module" src="https://site.test/app/assets/index-abc.js"></script></head><body></body></html>';

// language=TEXT
const preloadOf = file => `    <link rel="modulepreload" crossorigin href="https://site.test/app/assets/${file}">`;

describe('the entry points', () => {
  test('a demos entry preloads the demos chunk and its unshared deps', () => {
    const links = demosLinks(manifest, baseOf(shell));

    expect(links).toEqual([preloadOf('Demos-abc.js'), preloadOf('table-abc.js')]);
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
    expect(() => demosLinks({'index.html': {file: 'assets/index-abc.js'}}, 'https://site.test/app/'))
      .toThrow('the demos page is missing from the build manifest');
  });

  test('a hole in the manifest is named, not skipped', () => {
    const holed = {...manifest, 'src/pages/Demos/index.tsx': {file: 'assets/Demos-abc.js', imports: ['ghost.ts']}};

    expect(() => demosLinks(holed, 'https://site.test/app/')).toThrow('ghost.ts is missing from the build manifest');
  });

  test('a shell without an assets script refuses to guess the base', () => {
    expect(() => baseOf('<html lang="en"><head></head></html>'))
      .toThrow('the shell has no assets script tag to read the base from');
  });

  test('chunks that import each other are each preloaded once', () => {
    const circling = {
      ...manifest,
      'src/pages/Demos/index.tsx': {file: 'assets/Demos-abc.js', imports: ['a.ts']},
      'a.ts': {file: 'assets/a-abc.js', imports: ['b.ts']},
      'b.ts': {file: 'assets/b-abc.js', imports: ['a.ts']}
    };

    expect(demosLinks(circling, 'https://site.test/app/')).toEqual([preloadOf('Demos-abc.js'), preloadOf('a-abc.js'), preloadOf('b-abc.js')]);
  });
});

describe('the entry points the build writes', () => {
  test('are every path of the site that carries no parameter', () => {
    const fixed = Object.values(Paths).filter(path => path.startsWith('/') && path !== '/' && !path.includes(':'));

    expect(staticRoutesOf(pathsSource)).toEqual(fixed);
  });

  test('preload the demos on every demos path, and nowhere else', () => {
    const links = demosLinks(manifest, baseOf(shell));
    const routes = staticRoutesOf(pathsSource);
    const demos = routes.filter(route => route.startsWith('/demos/'));
    const elsewhere = routes.filter(route => !route.startsWith('/demos/'));

    expect(demos.length).toBeGreaterThan(0);
    demos.forEach(route => expect(preloaded(shell, links, route)).toContain('modulepreload'));
    elsewhere.forEach(route => expect(preloaded(shell, links, route)).toBe(shell));
  });
});
