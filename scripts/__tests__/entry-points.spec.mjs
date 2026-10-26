import {readFileSync} from 'node:fs';
import {baseOf, demosLinks, listedIn, preloaded, staticRoutesOf} from '../entry-points.mjs';
import {Paths} from '@pages/Paths';
import {not} from '@ryandur/sand';

const pathsSource = readFileSync('src/pages/Paths.ts', 'utf-8');

/**
 * @param {string} path
 */
const carriesNoParameter = path => path.startsWith('/') && path !== '/' && not(path.includes(':'));

const demosRoute = 'src/pages/Demos/route.tsx?__react-router-build-client-route';
const manifest = {
  'src/entry.client.tsx': {file: 'assets/entry-abc.js', imports: ['shared.ts']},
  'src/root.tsx?__react-router-build-client-route': {file: 'assets/root-abc.js', imports: ['shared.ts']},
  'shared.ts': {file: 'assets/shared-abc.js'},
  [demosRoute]: {file: 'assets/route-abc.js', imports: ['shared.ts'], dynamicImports: ['src/pages/Demos/DemosPage.tsx']},
  'src/pages/Demos/DemosPage.tsx': {file: 'assets/Demos-abc.js', imports: ['shared.ts', 'table.ts']},
  'table.ts': {file: 'assets/table-abc.js'}
};
// language=TEXT
const shell = '<html lang="en"><head><link rel="icon" href="https://site.test/app/favicon.svg"/><link rel="modulepreload" href="https://site.test/app/assets/entry-abc.js"/></head><body></body></html>';

// language=TEXT
const preloadOf = file => `    <link rel="modulepreload" crossorigin href="https://site.test/app/assets/${file}">`;

describe('the entry points', () => {
  test('a demos entry preloads the demos route, its page, and their deps the shell does not hold', () => {
    const links = demosLinks(manifest, baseOf(shell));

    expect(links).toEqual([preloadOf('route-abc.js'), preloadOf('Demos-abc.js'), preloadOf('table-abc.js')]);
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
    const {['src/pages/Demos/DemosPage.tsx']: _page, ...withoutTheDemos} = manifest;

    expect(() => demosLinks(withoutTheDemos, 'https://site.test/app/'))
      .toThrow('the demos page is missing from the build manifest');
  });

  test('a hole in the manifest is named, not skipped', () => {
    const holed = {...manifest, 'src/pages/Demos/DemosPage.tsx': {file: 'assets/Demos-abc.js', imports: ['ghost.ts']}};

    expect(() => demosLinks(holed, 'https://site.test/app/')).toThrow('ghost.ts is missing from the build manifest');
  });

  test('a shell without an assets link refuses to guess the base', () => {
    expect(() => baseOf('<html lang="en"><head><link rel="icon" href="https://site.test/app/favicon.svg"/></head></html>'))
      .toThrow('the shell has no assets link to read the base from');
  });

  test('chunks that import each other are each preloaded once', () => {
    const circling = {
      ...manifest,
      'src/pages/Demos/DemosPage.tsx': {file: 'assets/Demos-abc.js', imports: ['a.ts']},
      'a.ts': {file: 'assets/a-abc.js', imports: ['b.ts']},
      'b.ts': {file: 'assets/b-abc.js', imports: ['a.ts']}
    };

    expect(demosLinks(circling, 'https://site.test/app/')).toEqual([preloadOf('route-abc.js'), preloadOf('Demos-abc.js'), preloadOf('a-abc.js'), preloadOf('b-abc.js')]);
  });

  describe('a page’s listing', () => {
    const head = '<head><meta charSet="UTF-8"/></head>';

    test('should be written into the head as its title and description, escaped', () => {
      expect(listedIn(head, {title: 'Tom & Jerry', description: 'A "cat" <and> a mouse.'}))
        .toBe('<head><meta charSet="UTF-8"/><title>Tom &amp; Jerry</title><meta name="description" content="A &quot;cat&quot; &lt;and&gt; a mouse."/></head>');
    });

    test('should stop the build when the shell has no head to write it into', () => {
      expect(() => listedIn('<html lang="en"><body></body></html>', {title: 'a', description: 'b'}))
        .toThrow('the shell has no head for the build to list the page in');
    });
  });
});

describe('the entry points the build writes', () => {
  test('are every path of the site that carries no parameter', () => {
    const fixed = Object.values(Paths).filter(carriesNoParameter);

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
