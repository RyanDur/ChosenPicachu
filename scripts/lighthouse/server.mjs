import {createServer} from 'node:http';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {dirname, extname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync} from 'node:zlib';
import {WebSocketServer} from 'ws';

const port = 4517;
const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, '../../dist');
const fixtures = join(here, 'fixtures');

const rest = new Map(JSON.parse(readFileSync(join(fixtures, 'rest.json'), 'utf8'))
  .map(({key, ...entry}) => [key, entry]));
const frames = JSON.parse(readFileSync(join(fixtures, 'frames.json'), 'utf8'));

const types = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain',
  '.woff2': 'font/woff2', '.map': 'application/json'
};
const compressible = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.map']);

const server = createServer((request, response) => {
  const send = (status, body, contentType, compress) => {
    const headers = {'content-type': contentType, 'cache-control': 'public, max-age=600'};
    if (compress && request.headers['accept-encoding']?.includes('gzip')) {
      body = gzipSync(body);
      headers['content-encoding'] = 'gzip';
    }
    response.writeHead(status, headers);
    response.end(body);
  };

  const url = request.url ?? '/';

  if (url.split('?')[0].endsWith('/env.js')) {
    return send(200, `window.__env = ${JSON.stringify({
      tradeFeed: `ws://localhost:${port}/ws-feed`,
      tradeProduct: 'BTC-USD',
      tradeHistory: '/trade-history',
      aicDomain: '/aic',
      harvardDomain: '/harvard',
      harvardAPIKey: 'recorded',
      vamDomain: '/vam'
    })};`, 'text/javascript', true);
  }

  const image = url.match(/^\/vam-image\/(\d+)\/full\/!(\d+),/);
  if (image) {
    const sized = join(fixtures, 'assets', `vam-${image[1]}-${image[2]}.jpg`);
    const fallback = join(fixtures, 'assets', `vam-${image[1]}-800.jpg`);
    return send(200, readFileSync(existsSync(sized) ? sized : fallback), 'image/jpeg', false);
  }

  if (rest.has(url)) {
    const {contentType, body} = rest.get(url);
    return send(200, body, contentType, true);
  }

  const path = url.replace(/^\/ChosenPicachu/, '').split('?')[0];
  const file = join(dist, path);
  if (existsSync(file) && statSync(file).isFile()) {
    const kind = extname(file);
    return send(200, readFileSync(file), types[kind] ?? 'application/octet-stream',
      compressible.has(kind));
  }
  if (extname(path)) {
    return send(404, 'not found', 'text/plain', false);
  }
  send(200, readFileSync(join(dist, 'index.html')), 'text/html', true);
});

const feed = new WebSocketServer({server, path: '/ws-feed'});
feed.on('connection', socket => {
  let at = 0;
  let replay;
  socket.on('message', () => {
    if (replay) return;
    replay = setInterval(() => socket.send(frames[at++ % frames.length]), 80);
  });
  socket.on('close', () => clearInterval(replay));
});

server.listen(port, () => console.log(`stub ready on ${port}`));
