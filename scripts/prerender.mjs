import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const base = '/ChosenPicachu/';
const client = 'build/client';
/** @type {Record<string, {file: string, imports?: string[]}>} */
const manifest = JSON.parse(readFileSync(join(client, '.vite/manifest.json'), 'utf8'));
const {prerender} = await import(pathToFileURL(resolve('build/server/entry.server.js')).href);

/**
 * @param {string} chunk
 * @param {Set<string>} into
 * @return {Set<string>}
 */
const withImports = (chunk, into) => {
  if (into.has(chunk)) return into;
  into.add(chunk);
  (manifest[chunk].imports ?? []).forEach(imported => withImports(imported, into));
  return into;
};

/**
 * @param {string} html
 * @param {string} entry
 * @param {string[]} rooms
 * @return {string}
 */
const loading = (html, entry, rooms) => {
  const chunks = [entry, ...rooms.map(room => `src/${room}`)].reduce((into, chunk) => withImports(chunk, into), new Set());
  const preloads = [...chunks].map(chunk => `<link rel="modulepreload" href="${base}${manifest[chunk].file}"/>`);
  const sheet = `<link rel="stylesheet" href="${base}${manifest['style.css'].file}"/>`;
  return html
    .replace('</head>', `${preloads.join('')}${sheet}</head>`)
    .replace('</body>', `<script type="module" src="${base}${manifest[entry].file}"></script></body>`);
};

/**
 * @param {string} file
 * @param {string} html
 */
const written = (file, html) => {
  mkdirSync(join(client, file, '..'), {recursive: true});
  writeFileSync(join(client, file), html);
};

for (const path of prerender.pages) {
  const {html, rooms} = await prerender.page(path);
  written(join(path, 'index.html'), loading(html, 'src/entry.client.tsx', rooms));
}
written('404.html', loading(await prerender.fallback(), 'src/entry.fallback.tsx', []));
