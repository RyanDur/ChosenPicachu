import {copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {baseOf, demosLinks, preloaded, staticRoutesOf} from './entry-points.mjs';

const names = JSON.parse(readFileSync('src/pages/names.json', 'utf-8'));
const namedAt = {'/demos/': names.demos.accordions, '/users/': names.users, '/gallery/': names.gallery, '/games/': names.games};
const escaped = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unnamed = route => {
  throw new Error(`src/pages/names.json names no page at ${route}`);
};
const named = (html, route) => {
  const words = namedAt[route] ?? unnamed(route);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${escaped(words.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${escaped(words.description)}"/>`);
};

const staticRoutes = staticRoutesOf(readFileSync('src/pages/Paths.ts', 'utf-8'));

const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf-8'));
const shell = readFileSync('dist/index.html', 'utf-8');
const links = demosLinks(manifest, baseOf(shell));

copyFileSync('dist/index.html', 'dist/404.html');
for (const route of staticRoutes) {
  mkdirSync(`dist${route}`, {recursive: true});
  writeFileSync(`dist${route}/index.html`, named(preloaded(shell, links, route), route));
}
rmSync('dist/.vite', {recursive: true});
console.log(`SPA entry points: 404.html, ${staticRoutes.join(', ')}`);
