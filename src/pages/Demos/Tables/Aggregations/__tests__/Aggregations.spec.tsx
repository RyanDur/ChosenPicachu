import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {sortableTable} from '@components/DragSortableTable/__test_support';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {Trading} from '@pages/Demos/Market/Trading';
import {aggregations, tableControls} from '@pages/Demos/Tables/__test_support';
import {TableControls} from '../../TableControls';
import {Aggregations} from '../Aggregations';

const now = 1700000000000;
const fourTrades = [
  tradeFrame(50001, now - 30 * 60000, '0.10', 'bought'),
  tradeFrame(50002, now - 10 * 60000, '0.25', 'sold'),
  tradeFrame(50003, now - 3 * 60000, '0.05', 'bought'),
  tradeFrame(50004, now, '0.01', 'bought')
];

describe('the live aggregations', () => {
  test('the fixed lookbacks hold their rows while the stream fills the cells', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Aggregations/></Trading></TestApp>);
    await feedIsSubscribed(feed);
    await aggregations.arrived();
    expect(aggregations.columns()).toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(aggregations.rows()).toHaveLength(6);

    broadcast(feed, fourTrades);

    await waitFor(() => expect(sortableTable.texts(aggregations.row('this minute'))).toEqual(
      ['this minute', '1', '1', '0', '0.01', '$50,004.00', '+$0.00']));
    expect(sortableTable.texts(aggregations.row('last 5 minutes'))).toEqual(
      ['last 5 minutes', '2', '2', '0', '0.06', '$50,003.17', '+$1.00']);
    expect(sortableTable.texts(aggregations.row('last 15 minutes'))).toEqual(
      ['last 15 minutes', '3', '2', '1', '0.31', '$50,002.23', '+$2.00']);
    expect(sortableTable.texts(aggregations.row('this hour'))).toEqual(
      ['this hour', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
    expect(sortableTable.texts(aggregations.row('session'))).toEqual(
      ['session', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
  });

  test('should mark a number a trade moves', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Aggregations/></Trading></TestApp>);
    await aggregations.afterItsFirstTrade(feed, tradeFrame(50001, now));

    broadcast(feed, [tradeFrame(50002, now + 1000)]);

    await waitFor(() => expect(aggregations.markOn('this minute', 'trades')).toBe('up'));
  });

  test('should mark a number a trade moves in the lazy build as in the eager one', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/?pace=lazy" feed={feed}><Trading><Aggregations/></Trading></TestApp>);
    await aggregations.afterItsFirstTrade(feed, tradeFrame(50001, now));

    broadcast(feed, [tradeFrame(50002, now + 1000)]);

    await waitFor(() => expect(aggregations.markOn('this minute', 'trades')).toBe('up'));
  });

  test('should tell a screen reader only the number in a cell a trade moved', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Aggregations/></Trading></TestApp>);
    await aggregations.afterItsFirstTrade(feed, tradeFrame(50001, now));
    broadcast(feed, [tradeFrame(50002, now + 1000)]);
    await waitFor(() => expect(aggregations.markOn('this minute', 'trades')).toBe('up'));

    expect(aggregations.spokenIn('this minute', 'trades')).toBe('2');
  });

  test('should clear the mark from a number the next trade leaves as it is', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Aggregations/></Trading></TestApp>);
    await aggregations.afterItsFirstTrade(feed, tradeFrame(50001, now, '0.01', 'bought'));
    broadcast(feed, [tradeFrame(50002, now + 1000, '0.01', 'sold')]);
    await waitFor(() => expect(aggregations.markOn('this minute', 'sells')).toBe('up'));

    broadcast(feed, [tradeFrame(50003, now + 2000, '0.01', 'bought')]);

    await waitFor(() => expect(aggregations.markOn('this minute', 'sells')).toBe('none'));
  });

  test('the arrangement survives a change of table: the order belongs to the page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at="/" feed={feed}><Trading><Aggregations/></Trading><TableControls/></TestApp>);
    await feedIsSubscribed(feed);
    await aggregations.arrived();
    await aggregations.moveWindowByKey(1, '{ArrowDown}');
    await aggregations.moveColumnByKey('trades', '{ArrowRight}');

    await tableControls.choose('Lazy', 'Static');

    expect(aggregations.lookbacks().slice(0, 2)).toEqual(['last 5 minutes', 'this minute']);
    expect(aggregations.columns().slice(0, 3)).toEqual(['lookback', 'buys', 'trades']);
  });
});
