import {copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {baseOf, demosLinks, listedIn, preloaded, staticRoutesOf} from './entry-points.mjs';

const names = JSON.parse(readFileSync('src/pages/names.json', 'utf-8'));
const listings = {
  '/': names.home, '/demos/': names.demos.accordions, '/users/': names.users, '/gallery/': names.gallery, '/games/': names.games, '/record/': names.record, '/practice/': names.practice.structure
};
const unlisted = route => {
  throw new Error(`src/pages/names.json names no page at ${route}`);
};
const listed = (html, route) => listedIn(html, listings[route] ?? unlisted(route));

const staticRoutes = staticRoutesOf(readFileSync('src/pages/Paths.ts', 'utf-8'));

const manifest = JSON.parse(readFileSync('build/client/.vite/manifest.json', 'utf-8'));
const shell = readFileSync('build/client/index.html', 'utf-8');
writeFileSync('build/client/index.html', listed(shell, '/'));
const links = demosLinks(manifest, baseOf(shell));

copyFileSync('build/client/index.html', 'build/client/404.html');
for (const route of staticRoutes) {
  mkdirSync(`build/client${route}`, {recursive: true});
  writeFileSync(`build/client${route}/index.html`, listed(preloaded(shell, links, route), route));
}
rmSync('build/client/.vite', {recursive: true});
console.log(`SPA entry points: 404.html, ${staticRoutes.join(', ')}`);
