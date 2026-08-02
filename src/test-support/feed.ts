import {WebSocket as RealWebSocket, WebSocketServer} from 'ws';
import {server as mswServer} from './server';

export const realSockets = () => {
  mswServer.close();
  vi.stubGlobal('WebSocket', RealWebSocket);
};

export const interceptedNetwork = () => {
  vi.unstubAllGlobals();
  mswServer.listen({onUnhandledRequest: 'error'});
};

type FrameParts = {
  price: string;
  id: number;
  at?: number;
  size?: string;
  side?: string;
};

export const tradeFrameWith = ({price, id, at = 1700000000000, size = '0.01', side = 'buy'}: FrameParts): string => JSON.stringify({
  type: 'match',
  trade_id: id,
  maker_order_id: 'maker',
  taker_order_id: 'taker',
  side,
  size,
  price,
  product_id: 'BTC-USD',
  sequence: id,
  time: new Date(at).toISOString()
});

export const tradeFrame = (price: number, at = 1700000000000, size = '0.01', side = 'buy'): string =>
  tradeFrameWith({price: String(price), id: 900000 + price, at, size, side});

export const nonTradeFrame = (price: number): string => JSON.stringify({
  type: 'ticker',
  trade_id: 900000 + price,
  price: String(price),
  product_id: 'BTC-USD',
  time: new Date(1700000000000).toISOString()
});

export const subscribed = new Set<RealWebSocket>();

const subscribesMatches = (raw: unknown): boolean => {
  const frame: unknown = JSON.parse(String(raw));
  return typeof frame === 'object' && frame !== null &&
    Reflect.get(frame, 'type') === 'subscribe' &&
    JSON.stringify(Reflect.get(frame, 'channels')).includes('matches') &&
    JSON.stringify(Reflect.get(frame, 'channels')).includes('BTC-USD');
};

export const listeningFeed = async (refusing = false): Promise<WebSocketServer> => {
  const feed = new WebSocketServer({
    host: '127.0.0.1',
    port: 0,
    verifyClient: () => !refusing
  });
  feed.on('connection', socket => {
    socket.on('message', raw => {
      if (subscribesMatches(raw)) {
        subscribed.add(socket);
      }
    });
  });
  await new Promise(resolve => feed.once('listening', resolve));
  return feed;
};

export const urlOf = (feed: WebSocketServer): string => {
  const address = feed.address();
  if (typeof address === 'string' || address === null) {
    throw new Error('the feed never bound a port');
  }
  return `ws://127.0.0.1:${address.port}`;
};

export const broadcast = (feed: WebSocketServer, frames: string[]): void =>
  feed.clients.forEach(socket => {
    if (subscribed.has(socket)) {
      frames.forEach(frame => socket.send(frame));
    }
  });
