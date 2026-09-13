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
const shell = '<html><head><script type="module" src="/app/assets/index-abc.js"></script></head><body></body></html>';

describe('the entry points the build writes', () => {
  test('are every path of the site that carries no parameter, the front door being the shell itself', () => {
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
