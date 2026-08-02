import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {server} from '@test-support/server';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';

const HISTORY = 'https://api.exchange.coinbase.com';

const rows = [
  [1700000300, 49990, 50010, 50000, 50005, 2.5],
  [1700000240, 49980, 50000, 49990, 50000, 1.5],
  [1700000180, 49970, 49995, 49985, 49990, 1.0]
];

const renderCharts = () =>
  renderWithMemoryRouter({
    path: Paths.demos,
    element: <EnvProvider env={{tradeFeed: 'ws://127.0.0.1:9', tradeHistory: HISTORY}}><DemosPage/></EnvProvider>
  }, {path: `${Paths.demos}?tab=charts`});

const menuFor = (label: string): HTMLElement => {
  const toggle = screen.getByRole('button', {name: label});
  const target = toggle.getAttribute('popovertarget') ?? '';
  const menu = document.getElementById(target);
  if (menu === null) {
    throw new Error(`no menu for ${label}`);
  }
  return menu;
};

const drawnCandleParts = (selector: string): number => {
  const region = screen.getByRole('region', {name: 'candles'});
  return region.querySelectorAll(selector).length;
};

const drawnPoints = (): string[] => {
  const region = screen.getByRole('region', {name: 'live trades'});
  return region.querySelector('polyline')?.getAttribute('points')?.split(' ') ?? [];
};

describe('the chart periods', () => {
  test('choosing the hour draws its candles from history', async () => {
    const asked: string[] = [];
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, ({request}) => {
      asked.push(new URL(request.url).searchParams.get('granularity') ?? '');
      return HttpResponse.json(rows);
    }));

    renderCharts();

    await userEvent.click(within(menuFor('candle period')).getByText('hour'));
    await waitFor(() => expect(drawnCandleParts('rect.body')).toBe(3));
    expect(drawnCandleParts('rect.volume')).toBe(3);
    expect(asked).toEqual(['60']);
    expect(screen.getByText('3 candles · 1m each')).toBeVisible();
    expect(screen.getByText('$50,010')).toBeVisible();
    expect(screen.getByText('$49,970')).toBeVisible();
  });

  test('choosing the day draws the price line from history closes', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.json(rows)));

    renderCharts();

    await userEvent.click(within(menuFor('price period')).getByText('day'));
    await waitFor(() => expect(drawnPoints()).toHaveLength(3));
    expect(screen.getByText('$50,005.00')).toBeVisible();
    expect(screen.getByText('3 candles · 1h each')).toBeVisible();
  });

  test('history that cannot load says so', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.error()));

    renderCharts();

    await userEvent.click(within(menuFor('candle period')).getByText('week'));
    await waitFor(() => expect(screen.getByText('history unavailable')).toBeVisible());
  });
});
