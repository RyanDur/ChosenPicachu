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
