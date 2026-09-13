import {TestApp} from '@test-support/TestApp';
import {demosAt} from '@pages/Demos/__test_support/demos';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {delay, http, HttpResponse} from 'msw';
import {HISTORY, server} from '@test-support/server';
import {format} from 'date-fns';

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

const menuFor = (label: string): HTMLElement => screen.getByLabelText(`${label} by`);

const captionOf = (chart: string): string =>
  within(screen.getByRole('region', {name: chart})).getByText(/candles ·/).textContent ?? '';

const drawnCandles = (): number => parseInt(captionOf('candles'), 10);

const drawnPoints = (): number => parseInt(captionOf('live trades'), 10);

describe('the chart periods', () => {
  test('choosing the hour draws its candles from history', async () => {
    const asked: URL[] = [];
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, ({request}) => {
      asked.push(new URL(request.url));
      return HttpResponse.json(rowsSpaced(60));
    }));

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')}/>);
    await screen.findByRole('region', {name: 'candles'});

    await userEvent.click(within(menuFor('candle period')).getByRole('button', {name: 'hour', hidden: true}));
    await waitFor(() => expect(drawnCandles()).toBe(5));
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

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')}/>);
    await screen.findByRole('region', {name: 'candles'});

    await userEvent.click(within(menuFor('price period')).getByRole('button', {name: 'day', hidden: true}));
    await waitFor(() => expect(drawnPoints()).toBe(5));
    expect(screen.getByRole('button', {name: 'price period day'})).toBeInTheDocument();
    expect(within(menuFor('price period')).getByRole('button', {name: 'day', current: true, hidden: true})).toBeInTheDocument();
    expect(screen.getByText('$50,005.00')).toBeVisible();
    expect(screen.getByText('5 candles · 1h each')).toBeVisible();
    const priceCard = screen.getByRole('region', {name: 'live trades'});
    const dayTicks = within(priceCard).getAllByRole('time');
    expect(dayTicks.map(tick => tick.textContent))
      .toEqual([0, 1, 2, 3, 4].map(hour => format((HOUR_ALIGNED + hour * 3600) * 1000, 'HH:mm')));
  });

  test('history that cannot load says so', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.error()));

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')}/>);
    await screen.findByRole('region', {name: 'candles'});

    await userEvent.click(within(menuFor('candle period')).getByRole('button', {name: 'week', hidden: true}));
    const candleCard = screen.getByRole('region', {name: 'candles'});
    expect(await within(candleCard).findByText('history unavailable')).toBeVisible();
    expect(within(screen.getByRole('alert', {hidden: true}))
      .getByText('the candle history could not be reached')).toBeInTheDocument();
  });

  test('switching the window shows the loading view until history arrives', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, async () => {
      await delay(150);
      return HttpResponse.json(rowsSpaced(3600));
    }));

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')}/>);
    await screen.findByRole('region', {name: 'candles'});

    await userEvent.click(within(menuFor('candle period')).getByRole('button', {name: 'day', hidden: true}));
    const candleCard = screen.getByRole('region', {name: 'candles'});
    expect(await within(candleCard).findByRole('progressbar')).toBeVisible();
    await waitFor(() => expect(drawnCandles()).toBe(5));
    expect(within(candleCard).queryByRole('progressbar')).toBeNull();
  });

  test('while history loads the captions say so, and the price holds its tongue', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, async () => {
      await delay(150);
      return HttpResponse.json(rowsSpaced(3600));
    }));

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')}/>);
    const candleCard = await screen.findByRole('region', {name: 'candles'});
    const priceCard = screen.getByRole('region', {name: 'live trades'});

    await userEvent.click(within(menuFor('candle period')).getByRole('button', {name: 'day', hidden: true}));
    await userEvent.click(within(menuFor('price period')).getByRole('button', {name: 'day', hidden: true}));

    expect(await within(candleCard).findByText('loading history')).toBeInTheDocument();
    expect(await within(priceCard).findByText('loading history')).toBeInTheDocument();
    expect(within(priceCard).queryByText(/^\$/)).not.toBeInTheDocument();
    await waitFor(() => expect(drawnCandles()).toBe(5));
    await waitFor(() => expect(drawnPoints()).toBe(5));
  });

  test('with history in hand and no trade yet, the captions wait', async () => {
    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')}/>);
    const candleCard = await screen.findByRole('region', {name: 'candles'});
    const priceCard = screen.getByRole('region', {name: 'live trades'});

    expect(await within(candleCard).findByText('waiting for the first trade')).toBeInTheDocument();
    expect(await within(priceCard).findByText('waiting for the first trade')).toBeInTheDocument();
  });
});
