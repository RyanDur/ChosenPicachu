import {copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {baseOf, demosLinks, preloaded, staticRoutesOf} from './entry-points.mjs';

const names = JSON.parse(readFileSync('src/pages/names.json', 'utf-8'));
const namedAt = {
  '/': names.home, '/demos/': names.demos.accordions, '/users/': names.users, '/gallery/': names.gallery, '/games/': names.games
};
const escaped = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unnamed = route => {
  throw new Error(`src/pages/names.json names no page at ${route}`);
};
const untagged = tag => {
  throw new Error(`index.html has no one-line ${tag} tag for the build to fill`);
};
/**
 * @param {string} html
 * @param {string} tag
 * @param {RegExp} found
 * @param {string} written
 */
const filled = (html, tag, found, written) => found.test(html) ? html.replace(found, written) : untagged(tag);
const named = (html, route) => {
  const words = namedAt[route] ?? unnamed(route);
  const titled = filled(html, 'title', /<title>[^<]*<\/title>/, `<title>${escaped(words.title)}</title>`);
  return filled(titled, 'description', /<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${escaped(words.description)}"/>`);
};

const staticRoutes = staticRoutesOf(readFileSync('src/pages/Paths.ts', 'utf-8'));

const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf-8'));
const shell = readFileSync('dist/index.html', 'utf-8');
writeFileSync('dist/index.html', named(shell, '/'));
const links = demosLinks(manifest, baseOf(shell));

copyFileSync('dist/index.html', 'dist/404.html');
for (const route of staticRoutes) {
  mkdirSync(`dist${route}`, {recursive: true});
  writeFileSync(`dist${route}/index.html`, named(preloaded(shell, links, route), route));
}
rmSync('dist/.vite', {recursive: true});
console.log(`SPA entry points: 404.html, ${staticRoutes.join(', ')}`);
