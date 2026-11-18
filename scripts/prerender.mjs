import {mkdirSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {pageLoading} from './page-loading.mjs';

const base = '/ChosenPicachu/';
const client = 'build/client';
const loading = pageLoading(client, base);
const {prerender} = await import(pathToFileURL(resolve('build/server/entry.server.js')).href);

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
  written(join(path, 'index.html'), loading.page(html, rooms));
}
written('404.html', loading.fallback(await prerender.fallback()));
