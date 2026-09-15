import {WebSocketClientConnectionProtocol as Client} from '@mswjs/interceptors/WebSocket';
import {FEED, feedLink, server} from './server';

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

export const subscribed = new Set<Client>();

const subscribesMatches = (raw: unknown): boolean => {
  const frame: unknown = JSON.parse(String(raw));
  return typeof frame === 'object' && frame !== null &&
    Reflect.get(frame, 'type') === 'subscribe' &&
    JSON.stringify(Reflect.get(frame, 'channels')).includes('matches') &&
    JSON.stringify(Reflect.get(frame, 'channels')).includes('BTC-USD');
};

export type Feed = {
  readonly url: string;
  readonly clients: Set<Client>;
  readonly connections: () => number;
};

let feeds = 0;

// the socket laws point the history at a port nobody answers; the fetch fails the way it would on the wire
// a refused feed hangs up abnormally on connection, which the page hears as a handshake failure
export const listeningFeed = (refusing = false): Promise<Feed> => {
  feeds += 1;
  const url = `${FEED}/${feeds}`;
  const clients = new Set<Client>();
  let connections = 0;
  server.use(feedLink.addEventListener('connection', ({client}) => {
    if (client.url.href !== url) {
      return;
    }
    connections += 1;
    if (refusing) {
      client.close(1006);
      return;
    }
    client.addEventListener('message', event => {
      if (subscribesMatches(event.data)) {
        subscribed.add(client);
        clients.add(client);
      }
    });
    client.addEventListener('close', () => {
      clients.delete(client);
      subscribed.delete(client);
    });
  }));
  return Promise.resolve({url, clients, connections: () => connections});
};

export const urlOf = ({url}: Feed): string => url;

export const broadcast = (feed: Feed, frames: string[]): void =>
  feed.clients.forEach(socket => {
    if (subscribed.has(socket)) {
      frames.forEach(frame => socket.send(frame));
    }
  });
