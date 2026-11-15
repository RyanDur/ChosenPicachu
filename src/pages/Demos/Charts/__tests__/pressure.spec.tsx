import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {Trading} from '@pages/Demos/Market/Trading';
import {format} from 'date-fns';
import {pressureShapes} from '@pages/Demos/Charts/Pressure/pressure-shapes';
import {Pressure} from '@pages/Demos/Charts/Pressure';
import {money} from '@pages/Demos/Market';
import {bought, chartsDesk, sold} from '@pages/Demos/Charts/__test_support';

const now = 1700000000000;

describe('pressure', () => {
  test('trades bucket by minute, split by side', () => {
    expect(pressureShapes.buckets([
      bought(2, {tradedAt: 60000}),
      sold(1, {id: 2, tradedAt: 61000}),
      sold(3, {id: 3, tradedAt: 120000})
    ], 60000)).toEqual([
      {openedAt: 60000, bought: 2, sold: 1},
      {openedAt: 120000, bought: 0, sold: 3}
    ]);
  });

  test('the heaviest side sets one scale for both directions', () => {
    const shapes = pressureShapes.drawn([
      {openedAt: 0, bought: 4, sold: 2},
      {openedAt: 60000, bought: 1, sold: 0}
    ], 240, 100, 60000);

    expect(shapes[0].boughtTop).toBe(0);
    expect(shapes[0].boughtHeight).toBe(50);
    expect(shapes[0].soldTop).toBe(50);
    expect(shapes[0].soldHeight).toBe(25);
    expect(shapes[1].boughtHeight).toBe(12.5);
    expect(shapes[1].soldHeight).toBe(0);
  });

  test('the card counts the minutes on show in the plural', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pressure/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    broadcast(feed, [tradeFrame(65001, now, '2', 'bought'), tradeFrame(65002, now + 60000, '1', 'sold')]);

    await waitFor(() => expect(chartsDesk.chart('pressure')).toHaveTextContent('2 minutes · up to the last 1,500 trades'));
  });

  test('the card bars the sides around the midline', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pressure/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    broadcast(feed, [tradeFrame(65001, now, '2', 'bought'), tradeFrame(65002, now + 1000, '1', 'sold')]);

    const card = chartsDesk.chart('pressure');
    await waitFor(() => expect(card).toHaveTextContent('1 minute · up to the last 1,500 trades'));
    expect(card).toHaveTextContent('2 BTC');
    expect(card).toHaveTextContent('-2 BTC');
  });

  test('a size under a whole unit keeps its digits', () => {
    expect(money.bitcoin(0.0042)).toBe('0.0042 BTC');
  });

  test('a larger size rounds to one decimal', () => {
    expect(money.bitcoin(12.63)).toBe('12.6 BTC');
    expect(money.bitcoin(0)).toBe('0 BTC');
  });

  test('an empty stream leaves the card waiting, not broken', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pressure/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    const card = chartsDesk.chart('pressure');
    expect(card).toHaveTextContent('waiting for the first trade');
  });

  test('an empty stream draws no scale beside the empty chart', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pressure/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    expect(chartsDesk.chart('pressure')).not.toHaveTextContent('BTC');
  });

  test('the hour chart marks the time every ten minutes', async () => {
    const onTheTen = 1700000400000;
    const minute = 60000;
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Pressure/></Trading></TestApp>);
    await feedIsSubscribed(feed);

    broadcast(feed, Array.from({length: 21}, (_, step) => tradeFrame(65001 + step, onTheTen + step * minute, '1', 'bought')));

    await waitFor(() => expect(chartsDesk.ticksOn('pressure'))
      .toEqual([0, 10, 20].map(minutes => format(onTheTen + minutes * minute, 'HH:mm'))));
  });
});
