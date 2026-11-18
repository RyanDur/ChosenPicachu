import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {maybe} from '@ryandur/sand';

/**
 * @param {string} client
 * @param {string} base
 * @return {(html: string, entry: string, rooms: string[]) => string}
 */
export const pageLoading = (client, base) => {
  /** @type {Record<string, {file: string, imports?: string[]}>} */
  const manifest = JSON.parse(readFileSync(join(client, '.vite/manifest.json'), 'utf8'));

  /**
   * @param {string} chunk
   * @param {Set<string>} into
   * @return {Set<string>}
   */
  const withImports = (chunk, into) => {
    if (into.has(chunk)) return into;
    into.add(chunk);
    maybe(manifest[chunk].imports).orElse([]).forEach(imported => withImports(imported, into));
    return into;
  };

  return (html, entry, rooms) => {
    const chunks = [entry, ...rooms.map(room => `src/${room}`)].reduce((into, chunk) => withImports(chunk, into), new Set());
    const preloads = [...chunks].map(chunk => `<link rel="modulepreload" href="${base}${manifest[chunk].file}"/>`);
    const sheet = `<link rel="stylesheet" href="${base}${manifest['style.css'].file}"/>`;
    return html
      .replace('</head>', `${preloads.join('')}${sheet}</head>`)
      .replace('</body>', `<script type="module" src="${base}${manifest[entry].file}"></script></body>`);
  };
};
