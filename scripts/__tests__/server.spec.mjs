import {spawn} from 'node:child_process';
import {connect} from 'node:net';

const stageUp = () => new Promise((resolve, reject) => {
  const stage = spawn(process.execPath, ['scripts/lighthouse/server.mjs'], {env: {...process.env, STAGE_PORT: '0'}});
  stage.stdout.on('data', chunk => {
    const ready = /stub ready on (\d+)/.exec(String(chunk));
    if (ready) resolve({stage, port: Number(ready[1])});
  });
  stage.on('exit', code => reject(new Error(`the stage exited with ${code} before it was ready`)));
});

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

const said = (port, ...writes) => new Promise(resolve => {
  const socket = connect(port);
  let heard = '';
  socket.on('data', chunk => {
    heard += chunk;
  });
  socket.on('error', () => resolve(heard));
  socket.on('connect', async () => {
    for (const bytes of writes) {
      socket.write(bytes);
      await pause(150);
    }
    socket.destroy();
    resolve(heard);
  });
});

const handshake = 'GET /ws-feed HTTP/1.1\r\nHost: localhost\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n';

const maskedText = text => {
  const key = [1, 2, 3, 4];
  const payload = Buffer.from(text);
  return Buffer.from([0x81, 0x80 | payload.length, ...key, ...payload.map((byte, at) => byte ^ key[at % 4])]);
};

const unreadableFrame = Buffer.from([0x8f, 0x00]);

describe('the stub stage', () => {
  test('survives a feed client that sends a frame it cannot read', async () => {
    const {stage, port} = await stageUp();
    try {
      await said(port, handshake, maskedText('subscribe'), unreadableFrame);

      expect(await said(port, 'GET /ChosenPicachu/ HTTP/1.1\r\nHost: localhost\r\n\r\n')).toMatch(/^HTTP\/1\.1 200/);
    } finally {
      stage.kill();
    }
  });
});
