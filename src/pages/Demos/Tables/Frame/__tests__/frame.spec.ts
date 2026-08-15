import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {WebSocketServer} from 'ws';
import {broadcast, interceptedNetwork, listeningFeed, realSockets, subscribed, tradeFrame, urlOf} from '@test-support/feed';
import {wire} from '../frame';
import tableHtml from '../table.html?raw';

beforeAll(realSockets);
afterAll(interceptedNetwork);

describe('the frame table', () => {
  const feeds: WebSocketServer[] = [];

  const streamingFeed = async (): Promise<WebSocketServer> => {
    const feed = await listeningFeed();
    feeds.push(feed);
    return feed;
  };

  const deal = (feedUrl?: string): void => {
    window.__env = feedUrl
      ? {tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9', tradeProduct: 'BTC-USD',
         aicDomain: '', harvardDomain: '', harvardAPIKey: '', vamDomain: ''}
      : undefined;
    document.body.innerHTML = tableHtml;
    wire(document);
  };

  const windowNames = (): string[] =>
    screen.getAllByRole('rowheader').map(header => (header.textContent ?? '').trim());

  const sortMenu = (column: string) =>
    within(screen.getByRole('columnheader', {name: new RegExp(column)}));

  const measure = (window: string, at: number): HTMLElement =>
    within(screen.getByRole('row', {name: new RegExp(window)})).getAllByRole('cell')[at];

  afterEach(async () => {
    document.body.innerHTML = '';
    window.__env = undefined;
    subscribed.clear();
    await Promise.all(feeds.map(feed => new Promise(resolve => {
      feed.clients.forEach(client => client.terminate());
      feed.close(resolve);
    })));
    feeds.length = 0;
  });

  it('without an environment the dealt zeros stand, and the rule still announces', async () => {
    deal();

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
    expect(sortMenu('trades').getByRole('button', {name: 'sort trades'})).toHaveTextContent('▼');
  });

  it('as dealt restores the birth order and withdraws the announcement', async () => {
    deal();

    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'as dealt', hidden: true}));

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('columnheader', {name: /buys/})).not.toHaveAttribute('aria-sort');
    expect(sortMenu('buys').getByRole('button', {name: 'sort buys'})).toHaveTextContent('⇅');
  });

  it('a new rule releases the old column', async () => {
    deal();

    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    expect(screen.getByRole('columnheader', {name: /buys/})).not.toHaveAttribute('aria-sort');
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });

  it('trades fold into the windows', async () => {
    const feed = await streamingFeed();
    deal(urlOf(feed));
    await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() => expect(measure('session', 0)).toHaveTextContent('2'));
    expect(measure('this minute', 0)).toHaveTextContent('1');
  });

  it('the rule stands while trades land', async () => {
    const feed = await streamingFeed();
    deal(urlOf(feed));
    await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() =>
      expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });
});
