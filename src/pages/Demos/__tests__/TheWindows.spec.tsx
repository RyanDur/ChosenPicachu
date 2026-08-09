import {screen, waitFor, within} from '@testing-library/react';
import {http, HttpResponse} from 'msw';
import {server} from '@test-support/server';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';

const HISTORY = 'https://api.exchange.coinbase.com';

const NOW = 1700000000000;

const recentTradesNewestFirst = [
  {trade_id: 4, price: '50004.00', size: '0.01', side: 'buy', time: new Date(NOW).toISOString()},
  {trade_id: 3, price: '50003.00', size: '0.05', side: 'buy', time: new Date(NOW - 3 * 60000).toISOString()},
  {trade_id: 2, price: '50002.00', size: '0.25', side: 'sell', time: new Date(NOW - 10 * 60000).toISOString()},
  {trade_id: 1, price: '50001.00', size: '0.10', side: 'buy', time: new Date(NOW - 30 * 60000).toISOString()}
];

const renderTables = () =>
  renderWithMemoryRouter({
    path: Paths.demos,
    element: <EnvProvider env={{tradeFeed: 'wss://feed.test', tradeHistory: HISTORY}}><DemosPage/></EnvProvider>
  }, {path: `${Paths.demos}?tab=tables`});

describe('the windows hydrate from history', () => {
  test('a pull of recent trades fills the windows before the socket speaks', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/trades`, () =>
      HttpResponse.json(recentTradesNewestFirst)));

    renderTables();

    const card = screen.getByRole('region', {name: 'live aggregations'});
    const texts = (row: HTMLElement) => [...row.querySelectorAll('th, td')].map(cell => cell.textContent);
    const rowFor = (label: string) => {
      const cell = within(card).getByText(label);
      const row = cell.closest('tr');
      if (row === null) throw new Error(`no row for ${label}`);
      return row;
    };
    await waitFor(() => expect(texts(rowFor('this minute'))).toEqual(
      ['this minute', '1', '1', '0', '0.01', '$50,004.00', '+$0.00']));
    expect(texts(rowFor('this hour'))).toEqual(
      ['this hour', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
  });

  test('a history that cannot load leaves the windows quietly empty', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/trades`, () => HttpResponse.error()));

    renderTables();

    const card = screen.getByRole('region', {name: 'live aggregations'});
    expect(await within(card).findByText('session')).toBeVisible();
    const sessionRow = within(card).getByText('session').closest('tr');
    expect(sessionRow).toHaveTextContent('0');
  });
});
