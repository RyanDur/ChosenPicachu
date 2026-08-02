import {cleanup, screen, waitFor, within} from '@testing-library/react';
import {
  broadcast,
  interceptedNetwork,
  listeningFeed,
  realSockets,
  subscribed,
  tradeFrame,
  urlOf
} from '@test-support/feed';
import {WebSocketServer} from 'ws';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';

beforeAll(realSockets);
afterAll(interceptedNetwork);

const renderTables = (feedUrl: string) =>
  renderWithMemoryRouter({
    path: Paths.demos,
    element: <EnvProvider env={{tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9'}}><DemosPage/></EnvProvider>
  }, {path: `${Paths.demos}?tab=tables`});

const feedIsSubscribed = async (): Promise<void> => {
  await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
};

describe('the tables demo', () => {
  const feeds: WebSocketServer[] = [];

  const streamingFeed = async (): Promise<WebSocketServer> => {
    const feed = await listeningFeed();
    feeds.push(feed);
    return feed;
  };

  afterEach(async () => {
    cleanup();
    subscribed.clear();
    await Promise.all(feeds.map(feed => new Promise(resolve => feed.close(resolve))));
    feeds.length = 0;
  });

  test('the measures stand as columns and each minute earns a row', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const card = screen.getByRole('region', {name: 'live aggregations'});
    for (const measure of ['time', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']) {
      expect(within(card).getByRole('columnheader', {name: new RegExp(`^${measure}`)})).toBeVisible();
    }
    broadcast(feed, [
      tradeFrame(50001, 1700000000000, '0.01', 'buy'),
      tradeFrame(50002, 1700000030000, '0.25', 'sell'),
      tradeFrame(50003, 1700000120000, '0.10', 'buy')
    ]);
    await waitFor(() => expect(within(card).getAllByRole('row')).toHaveLength(3));
    const [, newestMinute, olderMinute] = within(card).getAllByRole('row');
    const texts = (row: HTMLElement) => within(row).getAllByRole('cell').map(cell => cell.textContent);
    expect(texts(newestMinute).slice(1)).toEqual(['1', '1', '0', '0.10', '$50,003.00', '+$0.00']);
    expect(texts(olderMinute).slice(1)).toEqual(['2', '1', '1', '0.26', '$50,001.96', '+$1.00']);
  });

  test('every column is resizable', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    const card = screen.getByRole('region', {name: 'live aggregations'});
    expect(within(card).getAllByRole('separator')).toHaveLength(7);
  });
});
