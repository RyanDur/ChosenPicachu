import {createServer} from 'node:http';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {dirname, extname, join, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {gzipSync} from 'node:zlib';
import {is, maybe, not} from '@ryandur/sand';
import {WebSocketServer} from 'ws';
import {pageLoading} from '../page-loading.mjs';
import {stageEnvironment} from './stage-environment.mjs';

const port = Number(maybe(process.env.STAGE_PORT).orElse(4517));
const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(maybe(process.env.STAGE_SITE).orElse(join(here, '../../build/client')));
const fixtures = join(here, 'fixtures');

const published = 'public, max-age=600';
const drawnFresh = 'no-store';

/**
 * @typedef {object} Pages
 * @property {(path: string) => boolean} isOne
 * @property {(path: string) => Promise<{status: number, html: string | Buffer}>} answer
 * @property {string} caching
 */

/** @type {Pages} */
const filedPages = {
  isOne: path => existsSync(join(site, path)) && statSync(join(site, path)).isDirectory(),
  answer: async path => {
    const entry = join(site, path, 'index.html');
    return existsSync(entry)
      ? {status: 200, html: readFileSync(entry)}
      : {status: 404, html: readFileSync(join(site, '404.html'))};
  },
  caching: published
};

/** @return {Promise<Pages>} */
const renderedPages = async () => {
  const {prerender} = await import(pathToFileURL(join(site, '../server/entry.server.js')).href);
  const loading = pageLoading(site, '/ChosenPicachu/');
  return {
    isOne: path => prerender.pages.includes(`${path}/`),
    answer: async path => {
      if (not(prerender.pages.includes(path))) {
        return {status: 404, html: loading.fallback(await prerender.fallback())};
      }
      const {html, rooms} = await prerender.page(path);
      return {status: 200, html: loading.page(html, rooms)};
    },
    caching: drawnFresh
  };
};

const pages = process.env.STAGE_RENDER === 'on' ? await renderedPages() : filedPages;

const rest = new Map(JSON.parse(readFileSync(join(fixtures, 'rest.json'), 'utf8'))
  .map(({key, ...entry}) => [key, entry]));
const frames = JSON.parse(readFileSync(join(fixtures, 'frames.json'), 'utf8'));
const threads = JSON.parse(readFileSync(join(fixtures, 'threads.json'), 'utf8'));

const types = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain',
  '.woff2': 'font/woff2', '.map': 'application/json'
};
const compressible = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.map']);

/**
 * @param {{variables: {search: string}}} asked
 */
const feedbackAnswerTo = ({variables}) =>
  ({search: {nodes: threads.filter(({title}) => variables.search.includes(title.slice(title.lastIndexOf('('))))}});

/**
 * @param {import('node:http').IncomingMessage} request
 * @param {import('node:http').ServerResponse} response
 */
const answers = (request, response) => {
  const answerWith = caching => (status, body, contentType, compress) => {
    const headers = {'content-type': contentType, 'cache-control': caching};
    if (is(compress) && maybe(request.headers['accept-encoding']).orElse('').includes('gzip')) {
      body = gzipSync(body);
      headers['content-encoding'] = 'gzip';
    }
    response.writeHead(status, headers);
    response.end(body);
  };
  const send = answerWith(published);

  const url = maybe(request.url).orElse('/');

  if (url.split('?')[0].endsWith('/env.js')) {
    return send(200, `window.__environment = ${JSON.stringify(stageEnvironment(server.address().port))};`,
      'text/javascript', true);
  }

  if (request.method === 'POST' && url === '/feedback-graphql') {
    let asked = '';
    request.on('data', chunk => {
      asked += chunk;
    });
    request.on('end', () => send(200, JSON.stringify({data: feedbackAnswerTo(JSON.parse(asked))}), 'application/json', false));
    return;
  }

  if (/^\/(aic|vam)-image\/[^/]+\/info\.json$/.test(url)) {
    return send(200, '{}', 'application/json', false);
  }

  const image = url.match(/^\/vam-image\/(\d+)\/full\/!(\d+),/);
  if (image) {
    const sized = join(fixtures, 'assets', `vam-${image[1]}-${image[2]}.jpg`);
    const fallback = join(fixtures, 'assets', `vam-${image[1]}-800.jpg`);
    return send(200, readFileSync(existsSync(sized) ? sized : fallback), 'image/jpeg', false);
  }

  const recorded = [url, url.split('?')[0]].find(key => rest.has(key));
  if (is(recorded)) {
    const {contentType, body} = rest.get(recorded);
    return send(200, body, contentType, true);
  }

  const path = url.replace(/^\/ChosenPicachu/, '').split('?')[0];
  if (path.split('/').includes('..')) {
    return send(404, 'not found', 'text/plain', false);
  }
  const file = join(site, path);
  if (existsSync(file) && statSync(file).isFile()) {
    const kind = extname(file);
    return send(200, readFileSync(file), maybe(types[kind]).orElse('application/octet-stream'),
      compressible.has(kind));
  }
  if (extname(path)) {
    return send(404, 'not found', 'text/plain', false);
  }
  if (not(path.endsWith('/')) && pages.isOne(path)) {
    const queryAt = url.indexOf('?');
    response.writeHead(301, {location: queryAt < 0 ? `${url}/` : `${url.slice(0, queryAt)}/${url.slice(queryAt)}`});
    return response.end();
  }
  pages.answer(path)
    .then(({status, html}) => answerWith(pages.caching)(status, html, 'text/html', true), error => {
      console.error(`the stage could not draw ${path}`, error);
      answerWith(drawnFresh)(500, String(error), 'text/plain', false);
    });
};
const server = createServer(answers);

const feed = new WebSocketServer({server, path: '/ws-feed'});
/** @param {import('ws').WebSocket} socket */
const replaysTo = socket => {
  let at = 0;
  socket.on('error', error => console.error(`a feed client sent what the stage cannot read: ${error.message}`));
  socket.once('message', () => {
    const replay = setInterval(() => socket.send(frames[at++ % frames.length]), 80);
    socket.on('close', () => clearInterval(replay));
  });
};
feed.on('connection', replaysTo);

server.listen(port, () => console.log(`stub ready on ${server.address().port}`));
