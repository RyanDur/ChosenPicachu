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

const distWithAUsersPage = () => {
  const dist = mkdtempSync(join(tmpdir(), 'stage-dist-'));
  mkdirSync(join(dist, 'users'));
  writeFileSync(join(dist, 'users', 'index.html'), '<title>users</title>');
  writeFileSync(join(dist, 'index.html'), '<title>root</title>');
  return dist;
};

const get = path => `GET ${path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`;

describe('the stub stage answers a page address as GitHub Pages does', () => {
  test('should send a page asked for without its slash to the address with it, keeping the query', async () => {
    const {stage, port} = await stageUp({STAGE_DIST: distWithAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/users?page=2'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 301/);
    expect(answer).toMatch(/\r\nlocation: \/ChosenPicachu\/users\/\?page=2\r\n/i);
  });

  test('should serve the page asked for with its slash', async () => {
    const {stage, port} = await stageUp({STAGE_DIST: distWithAUsersPage()});

    const answer = await answerTo(port, get('/ChosenPicachu/users/'));
    stage.kill();

    expect(answer).toMatch(/^HTTP\/1\.1 200/);
    expect(answer).toContain('<title>users</title>');
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
