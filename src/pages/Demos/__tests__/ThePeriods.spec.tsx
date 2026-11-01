import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {render, screen, waitFor, within} from '@testing-library/react';
import {http, HttpResponse} from 'msw';
import {HISTORY, server} from '@__test_support/server';
import {format} from 'date-fns';
import {chartsDesk} from '@pages/Demos/Charts/__test_support';
import {granularitySeconds, Period} from '@pages/Demos/Charts/period';

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

const chartsWithHistory = async (stepSeconds: number): Promise<void> => {
  server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.json(rowsSpaced(stepSeconds))));
  render(<TestApp at={demosAt('charts', '?charts=price,candles')}/>);
  await screen.findByRole('region', {name: 'candles'});
};

describe('the chart periods', () => {
  test('choosing the hour asks history for minute candles', async () => {
    const asked: URL[] = [];
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, ({request}) => {
      asked.push(new URL(request.url));
      return HttpResponse.json(rowsSpaced(60));
    }));

    render(<TestApp at={demosAt('charts', '?charts=price,candles')}/>);
    await screen.findByRole('region', {name: 'candles'});

    await chartsDesk.choosePeriod('candle', 'hour');

    await waitFor(() => expect(chartsDesk.drawnCandles()).toBe(5));
    const chosen = asked[asked.length - 1].searchParams;
    expect(chosen.get('granularity')).toBe('60');
    expect(chosen.get('start')).not.toBeNull();
    expect(chosen.get('end')).not.toBeNull();
  });

  test('the price line measures its move from the close of its first candle, where its dotted line starts', async () => {
    await chartsWithHistory(60);

    expect(await within(screen.getByRole('region', {name: 'live trades'})).findByText('+$15.00')).toBeVisible();
  });

  test('a period with one candle names it in the singular', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.json(rowsSpaced(60).slice(0, 1))));
    render(<TestApp at={demosAt('charts', '?charts=candles')}/>);

    expect(await within(await screen.findByRole('region', {name: 'candles'})).findByText('1 candle · 1m each')).toBeVisible();
  });

  test('choosing the hour draws its candles from history', async () => {
    await chartsWithHistory(60);

    await chartsDesk.choosePeriod('candle', 'hour');

    await waitFor(() => expect(chartsDesk.drawnCandles()).toBe(5));
    const candleCard = screen.getByRole('region', {name: 'candles'});
    expect(within(candleCard).getByText('5 candles · 1m each')).toBeVisible();
    expect(within(candleCard).getByText('$50,010')).toBeVisible();
    expect(within(candleCard).getByText('$49,970')).toBeVisible();
    const hourTicks = within(candleCard).getAllByRole('time');
    expect(hourTicks.map(tick => tick.textContent))
      .toEqual([format(HOUR_ALIGNED * 1000, 'HH:mm')]);
  });

  test('choosing the day draws the price line from history closes', async () => {
    await chartsWithHistory(3600);

    await chartsDesk.choosePeriod('price', 'day');

    await waitFor(() => expect(chartsDesk.drawnPoints()).toBe(5));
    expect(screen.getByText('$50,005.00')).toBeVisible();
    expect(screen.getByText('5 candles · 1h each')).toBeVisible();
    const priceCard = screen.getByRole('region', {name: 'live trades'});
    const dayTicks = within(priceCard).getAllByRole('time');
    expect(dayTicks.map(tick => tick.textContent))
      .toEqual([0, 1, 2, 3, 4].map(hour => format((HOUR_ALIGNED + hour * 3600) * 1000, 'HH:mm')));
  });

  test('the chosen period is marked as current', async () => {
    await chartsWithHistory(3600);

    await chartsDesk.choosePeriod('price', 'day');

    expect(await screen.findByRole('button', {name: 'price period day'})).toBeInTheDocument();
    expect(within(screen.getByLabelText('price period by')).getByRole('button', {name: 'day', current: true, hidden: true})).toBeInTheDocument();
  });

  test('history that cannot load says so', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.error()));

    render(<TestApp at={demosAt('charts', '?charts=price,candles')}/>);
    await screen.findByRole('region', {name: 'candles'});

    await chartsDesk.choosePeriod('candle', 'week');
    const candleCard = screen.getByRole('region', {name: 'candles'});
    expect(await within(candleCard).findByText('history unavailable')).toBeVisible();
    expect(within(screen.getByRole('alert', {hidden: true}))
      .getByText('the candle history could not be reached')).toBeInTheDocument();
  });

  const heldHistory = (period: Period): (() => void) => {
    let release = (): void => undefined;
    const arrived = new Promise<void>(resolve => {
      release = resolve;
    });
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, async ({request}) => {
      const granularity = Number(new URL(request.url).searchParams.get('granularity'));
      if (granularity === granularitySeconds[period]) {
        await arrived;
        return HttpResponse.json(rowsSpaced(granularity));
      }
      return HttpResponse.json(rowsSpaced(granularity).slice(0, 3));
    }));
    return release;
  };

  const chartsWithTheHourInHand = async (): Promise<void> => {
    render(<TestApp at={demosAt('charts', '?charts=price,candles')}/>);
    await chartsDesk.findChart('candles');
    await waitFor(() => expect(chartsDesk.drawnCandles()).toBe(3));
    await waitFor(() => expect(chartsDesk.drawnPoints()).toBe(3));
  };

  test('switching the window shows the loading view until history arrives', async () => {
    const releaseHistory = heldHistory(Period.day);
    await chartsWithTheHourInHand();

    await chartsDesk.choosePeriod('candle', 'day');

    const candleCard = chartsDesk.chart('candles');
    expect(await within(candleCard).findByRole('progressbar')).toBeVisible();
    releaseHistory();
    await waitFor(() => expect(chartsDesk.drawnCandles()).toBe(5));
    expect(within(candleCard).queryByRole('progressbar')).not.toBeInTheDocument();
  });

  test('while history loads the captions say so', async () => {
    const releaseHistory = heldHistory(Period.day);
    await chartsWithTheHourInHand();

    await chartsDesk.choosePeriod('candle', 'day');
    await chartsDesk.choosePeriod('price', 'day');

    expect(await within(chartsDesk.chart('candles')).findByText('loading history')).toBeInTheDocument();
    expect(await chartsDesk.findOnPriceCard('loading history')).toBeInTheDocument();
    releaseHistory();
    await waitFor(() => expect(chartsDesk.drawnCandles()).toBe(5));
    await waitFor(() => expect(chartsDesk.drawnPoints()).toBe(5));
  });

  test('while history loads the price shows no number', async () => {
    const releaseHistory = heldHistory(Period.day);
    await chartsWithTheHourInHand();

    await chartsDesk.choosePeriod('price', 'day');

    await chartsDesk.findOnPriceCard('loading history');
    expect(within(chartsDesk.priceCard()).queryByText(/^\$/)).not.toBeInTheDocument();
    releaseHistory();
    await waitFor(() => expect(chartsDesk.drawnPoints()).toBe(5));
  });

  test('while the opening history loads the candles draw no scale', async () => {
    const releaseHistory = heldHistory(Period.hour);
    render(<TestApp at={demosAt('charts', '?charts=price,candles')}/>);
    const candlesCard = await chartsDesk.findChart('candles');

    await within(candlesCard).findByText('loading history');

    expect(within(candlesCard).queryByText(/^\$/)).not.toBeInTheDocument();
    releaseHistory();
  });

  test('with history in hand and no trade yet, the captions wait', async () => {
    render(<TestApp at={demosAt('charts', '?charts=price,candles')}/>);
    const candleCard = await screen.findByRole('region', {name: 'candles'});
    const priceCard = screen.getByRole('region', {name: 'live trades'});

    expect(await within(candleCard).findByText('waiting for the first trade')).toBeInTheDocument();
    expect(await within(priceCard).findByText('waiting for the first trade')).toBeInTheDocument();
  });
});
