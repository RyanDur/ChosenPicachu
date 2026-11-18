import {spawn} from 'node:child_process';
import {mkdirSync, mkdtempSync, writeFileSync} from 'node:fs';
import {connect} from 'node:net';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const stageUp = (env = {}) => new Promise((resolve, reject) => {
  const stage = spawn(process.execPath, ['scripts/lighthouse/server.mjs'], {env: {...process.env, STAGE_PORT: '0', ...env}});
  const life = {complaints: [], gone: undefined};
  stage.stderr.on('data', chunk => life.complaints.push(String(chunk)));
  stage.stdout.on('data', chunk => {
    const ready = /stub ready on (\d+)/.exec(String(chunk));
    if (ready) resolve({stage, port: Number(ready[1]), life});
  });
  stage.on('exit', code => {
    life.gone = `the stage exited with ${code}`;
    reject(new Error(`${life.gone} before it was ready`));
  });
});

const until = (life, awaited, check) => new Promise((resolve, reject) => {
  const started = Date.now();
  const look = () => {
    const gone = life.gone ?? '';
    if (gone !== '') return reject(new Error(gone));
    if (check() === true) return resolve();
    if (Date.now() - started > 2000) return reject(new Error(`gave up waiting for ${awaited}`));
    setTimeout(look, 20);
  };
  look();
});

const feedClient = port => new Promise(resolve => {
  const socket = connect(port);
  let heard = '';
  socket.on('data', chunk => {
    heard += chunk;
  });
  socket.on('connect', () => resolve({
    write: bytes => socket.write(bytes),
    heard: () => heard,
    hangUp: () => socket.destroy()
  }));
});

const answerTo = (port, request) => new Promise(resolve => {
  const socket = connect(port);
  let heard = '';
  socket.on('data', chunk => {
    heard += chunk;
  });
  socket.on('close', () => resolve(heard));
  socket.on('error', () => resolve(heard));
  socket.on('connect', () => socket.write(request));
});

const handshake = 'GET /ws-feed HTTP/1.1\r\nHost: localhost\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n';

const maskedText = text => {
  const key = [1, 2, 3, 4];
  const payload = Buffer.from(text);
  return Buffer.from([0x81, 0x80 | payload.length, ...key, ...payload.map((byte, at) => byte ^ key[at % 4])]);
};

const unreadableFrame = Buffer.from([0x8f, 0x00]);

const siteWithAUsersPage = () => {
  const site = mkdtempSync(join(tmpdir(), 'stage-site-'));
  mkdirSync(join(site, 'users'));
  writeFileSync(join(site, 'users', 'index.html'), '<title>users</title>');
  writeFileSync(join(site, 'index.html'), '<title>root</title>');
  writeFileSync(join(site, '404.html'), '<title>no page here</title>');
  return site;
};

const get = path => `GET ${path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`;

describe('the stub stage answers a page address as GitHub Pages does', () => {
  test('should send a page asked for without its slash to the address with it, keeping the query', async () => {
    const {stage, port} = await stageUp({STAGE_SITE: siteWithAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/users?page=2'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 301/);
    expect(answer).toMatch(/\r\nlocation: \/ChosenPicachu\/users\/\?page=2\r\n/i);
  });

  test('should serve the page asked for with its slash', async () => {
    const {stage, port} = await stageUp({STAGE_SITE: siteWithAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/users/'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 200/);
    expect(answer).toContain('<title>users</title>');
  });

  test('should answer an address with no page of its own with 404.html', async () => {
    const {stage, port} = await stageUp({STAGE_SITE: siteWithAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/nowhere/'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 404/);
    expect(answer).toContain('<title>no page here</title>');
  });
});

describe('the stub stage', () => {
  test('survives a feed client that sends a frame it cannot read', async () => {
    const {stage, port, life} = await stageUp();
    try {
      const client = await feedClient(port);
      client.write(handshake);
      await until(life, 'the handshake to be accepted', () => client.heard().includes('101 Switching Protocols'));
      client.write(maskedText('subscribe'));
      client.write(unreadableFrame);
      await until(life, 'the stage to complain about the frame', () => life.complaints.join('').includes('a feed client sent what the stage cannot read'));
      client.hangUp();

      const answer = await answerTo(port, 'GET /ChosenPicachu/env.js HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n');

      expect(answer).toMatch(/^HTTP\/1\.1 200/);
      expect(answer).toContain(`ws://localhost:${port}/ws-feed`);
    } finally {
      stage.kill();
    }
  });
});

const asked = (query, variables) => {
  const body = JSON.stringify({query, variables});
  return `POST /feedback-graphql HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${Buffer.byteLength(body)}\r\nConnection: close\r\n\r\n${body}`;
};

const searchFor = key => asked('query($search: String!) { search(query: $search) { nodes { id } } }', {search: `repo:RyanDur/ChosenPicachu in:title "(${key})"`});

const bodyOf = answer => JSON.parse(answer.slice(answer.indexOf('{'), answer.lastIndexOf('}') + 1));

describe('the stub stage answers the gallery’s museums from recordings', () => {
  test('should answer the gallery’s first look at Harvard with its recorded wall', async () => {
    const {stage, port} = await stageUp();

    const answer = await answerTo(port, get('/harvard?q=imagepermissionlevel%3A0+AND+_exists_%3Aprimaryimageurl&page=1&size=8&fields=id%2Ctitle%2Cpeople%2Cprimaryimageurl&apikey=recorded'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 200/);
    expect(answer).toMatch(/\r\ncontent-type: application\/json/i);
  });

  test('should answer the gallery’s first look at Cleveland with its recorded wall', async () => {
    const {stage, port} = await stageUp();

    const answer = await answerTo(port, get('/cleveland/?skip=0&limit=8&has_image=1&fields=id%2Ctitle%2Ccreators%2Ctombstone%2Cimages'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 200/);
    expect(answer).toMatch(/\r\ncontent-type: application\/json/i);
  });
});

describe('the stub stage answers Feedback’s questions in place of GitHub', () => {
  test('should name its own endpoint in env.js', async () => {
    const {stage, port} = await stageUp();

    const answer = await answerTo(port, get('/ChosenPicachu/env.js'));
    stage.kill();

    expect(answer).toContain('"feedbackEndpoint":"/feedback-graphql"');
  });

  test('should find the thread of a page that has one', async () => {
    const {stage, port} = await stageUp();

    const answer = await answerTo(port, searchFor('/demos/accordions/'));
    stage.kill();

    expect(bodyOf(answer).data.search.nodes).toEqual([
      {id: 'D_4', url: 'https://github.com/RyanDur/ChosenPicachu/discussions/4', title: 'Feedback: Demos Accordions (/demos/accordions/)'}
    ]);
  });

  test('should find no thread for a page that has none', async () => {
    const {stage, port} = await stageUp();

    const answer = await answerTo(port, searchFor('/record/'));
    stage.kill();

    expect(bodyOf(answer).data.search.nodes).toEqual([]);
  });
});

const aBuildThatDrawsAUsersPage = () => {
  const build = mkdtempSync(join(tmpdir(), 'stage-build-'));
  const client = join(build, 'client');
  mkdirSync(join(client, '.vite'), {recursive: true});
  mkdirSync(join(build, 'server'));
  writeFileSync(join(client, '.vite', 'manifest.json'), JSON.stringify({
    'src/entry.client.tsx': {file: 'assets/client.js'},
    'src/entry.fallback.tsx': {file: 'assets/fallback.js'},
    'style.css': {file: 'assets/style.css'}
  }));
  writeFileSync(join(client, 'env.js'), 'window.__environment = {"tradeProduct": "the build’s own"};');
  writeFileSync(join(build, 'server', 'entry.server.js'), `export const prerender = {
  pages: ['/users/', '/broken/'],
  page: async path => {
    if (path === '/broken/') throw new Error('the users page would not draw');
    return {html: '<html><head></head><body>drawn users</body></html>', rooms: []};
  },
  fallback: async () => '<html><head></head><body>drawn fallback</body></html>'
};
`);
  return client;
};

describe('the stub stage rendering on request', () => {
  test('should draw a page when it is asked for', async () => {
    const {stage, port} = await stageUp({STAGE_RENDER: 'on', STAGE_SITE: aBuildThatDrawsAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/users/'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 200/);
    expect(answer).toMatch(/drawn users<script type="module" src="\/ChosenPicachu\/assets\/client\.js">/);
  });

  test('should answer an address the build does not know with the drawn fallback', async () => {
    const {stage, port} = await stageUp({STAGE_RENDER: 'on', STAGE_SITE: aBuildThatDrawsAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/nowhere/'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 404/);
    expect(answer).toContain('drawn fallback');
  });

  test('should send a page asked for without its slash to the address with it', async () => {
    const {stage, port} = await stageUp({STAGE_RENDER: 'on', STAGE_SITE: aBuildThatDrawsAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/users'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 301/);
    expect(answer).toMatch(/\r\nlocation: \/ChosenPicachu\/users\/\r\n/i);
  });

  test('should answer a page that fails to draw with a server error', async () => {
    const {stage, port} = await stageUp({STAGE_RENDER: 'on', STAGE_SITE: aBuildThatDrawsAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/broken/'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 500/);
    expect(answer).toContain('the users page would not draw');
  });

  test('should serve the build’s own environment, the values its pages were drawn with', async () => {
    const {stage, port} = await stageUp({STAGE_RENDER: 'on', STAGE_SITE: aBuildThatDrawsAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/env.js'));
    stage.kill();

    expect(answer).toContain('"tradeProduct": "the build’s own"');
  });
});
