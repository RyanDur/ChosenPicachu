import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {server} from '@test-support/server';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';
import {format} from 'date-fns';

const HISTORY = 'https://api.exchange.coinbase.com';

const HOUR_ALIGNED = 1699995600;

const pricesOldestFirst = [
  [49970, 49995, 49985, 49990, 1.0],
  [49980, 50000, 49990, 50000, 1.5],
  [49985, 50005, 50000, 50002, 2.0],
  [49990, 50010, 50002, 50004, 1.2],
  [49990, 50008, 50004, 50005, 2.5]
];

const rowsSpaced = (stepSeconds: number): number[][] =>
  pricesOldestFirst
    .map(([low, high, open, close, volume], index) =>
      [HOUR_ALIGNED + index * stepSeconds, low, high, open, close, volume])
    .reverse();

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
    const asked: URL[] = [];
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, ({request}) => {
      asked.push(new URL(request.url));
      return HttpResponse.json(rowsSpaced(60));
    }));

    renderCharts();

    await userEvent.click(within(menuFor('candle period')).getByText('hour'));
    await waitFor(() => expect(drawnCandleParts('rect.body')).toBe(5));
    expect(drawnCandleParts('rect.volume')).toBe(5);
    const chosen = asked[asked.length - 1].searchParams;
    expect(chosen.get('granularity')).toBe('60');
    expect(chosen.get('start')).not.toBeNull();
    expect(chosen.get('end')).not.toBeNull();
    const candleCard = screen.getByRole('region', {name: 'candles'});
    expect(within(candleCard).getByText('5 candles · 1m each')).toBeVisible();
    expect(within(candleCard).getByText('$50,010')).toBeVisible();
    expect(within(candleCard).getByText('$49,970')).toBeVisible();
    const hourTicks = within(candleCard).getAllByRole('time');
    expect(hourTicks.map(tick => tick.textContent))
      .toEqual([format(HOUR_ALIGNED * 1000, 'HH:mm')]);
  });

  test('choosing the day draws the price line from history closes', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.json(rowsSpaced(3600))));

    renderCharts();

    await userEvent.click(within(menuFor('price period')).getByText('day'));
    await waitFor(() => expect(drawnPoints()).toHaveLength(5));
    expect(screen.getByText('$50,005.00')).toBeVisible();
    expect(screen.getByText('5 candles · 1h each')).toBeVisible();
    const priceCard = screen.getByRole('region', {name: 'live trades'});
    const dayTicks = within(priceCard).getAllByRole('time');
    expect(dayTicks.map(tick => tick.textContent))
      .toEqual([0, 1, 2, 3, 4].map(hour => format((HOUR_ALIGNED + hour * 3600) * 1000, 'HH:mm')));
  });

  test('history that cannot load says so', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.error()));

    renderCharts();

    await userEvent.click(within(menuFor('candle period')).getByText('week'));
    const candleCard = screen.getByRole('region', {name: 'candles'});
    await waitFor(() => expect(within(candleCard).getByText('history unavailable')).toBeVisible());
  });
});
