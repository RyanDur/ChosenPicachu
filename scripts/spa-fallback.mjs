import {copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {baseOf, demosLinks, listedIn, preloaded, staticRoutesOf} from './entry-points.mjs';

const names = JSON.parse(readFileSync('src/pages/names.json', 'utf-8'));
const listings = {
  '/': names.home, '/demos/': names.demos.accordions, '/users/': names.users, '/gallery/': names.gallery, '/games/': names.games
};
const unlisted = route => {
  throw new Error(`src/pages/names.json names no page at ${route}`);
};
const listed = (html, route) => listedIn(html, listings[route] ?? unlisted(route));

const staticRoutes = staticRoutesOf(readFileSync('src/pages/Paths.ts', 'utf-8'));

const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf-8'));
const shell = readFileSync('dist/index.html', 'utf-8');
writeFileSync('dist/index.html', listed(shell, '/'));
const links = demosLinks(manifest, baseOf(shell));

copyFileSync('dist/index.html', 'dist/404.html');
for (const route of staticRoutes) {
  mkdirSync(`dist${route}`, {recursive: true});
  writeFileSync(`dist${route}/index.html`, listed(preloaded(shell, links, route), route));
}
rmSync('dist/.vite', {recursive: true});
console.log(`SPA entry points: 404.html, ${staticRoutes.join(', ')}`);
