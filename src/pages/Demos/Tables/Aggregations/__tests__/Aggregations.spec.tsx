import {act, render} from '@testing-library/react';
import {sortableTable} from '@components/DragSortableTable/__test_support';
import {bought, sold} from '@pages/Demos/Charts/__test_support/trades';
import {DemosProvider} from '@pages/Demos/Provider';
import {DemosStore, demosStore, tradeArrived} from '@pages/Demos/store';
import {aggregations} from '@pages/Demos/Tables/__test_support';
import {Pace, Motion} from '@pages/Demos/Controls';
import {Aggregations} from '../Aggregations';

const now = 1700000000000;
const fourTrades = [
  bought(0.10, {id: 950001, price: 50001, tradedAt: now - 30 * 60000}),
  sold(0.25, {id: 950002, price: 50002, tradedAt: now - 10 * 60000}),
  bought(0.05, {id: 950003, price: 50003, tradedAt: now - 3 * 60000}),
  bought(0.01, {id: 950004, price: 50004, tradedAt: now})
];

const aggregationsOf = (store: DemosStore, pace: Pace = 'eager', motion: Motion = 'animated') =>
  <DemosProvider store={store}><Aggregations world="react" pace={pace} origin="hide" motion={motion}/></DemosProvider>;

describe('the live aggregations', () => {
  test('the fixed windows hold their rows while the stream fills the cells', async () => {
    const store = demosStore();
    render(aggregationsOf(store));
    await aggregations.arrived();
    expect(aggregations.columns()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(aggregations.rows()).toHaveLength(6);

    act(() => fourTrades.forEach(trade => store.dispatch(tradeArrived(trade))));

    expect(sortableTable.texts(aggregations.row('this minute'))).toEqual(
      ['this minute', '1', '1', '0', '0.01', '$50,004.00', '+$0.00']);
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
    const store = demosStore();
    const {rerender} = render(aggregationsOf(store));
    await aggregations.arrived();
    await aggregations.moveWindowByKey(1, '{ArrowDown}');
    await aggregations.moveColumnByKey('trades', '{ArrowRight}');

    rerender(aggregationsOf(store, 'lazy', 'static'));

    expect(aggregations.windows().slice(0, 2)).toEqual(['last 5 minutes', 'this minute']);
    expect(aggregations.columns().slice(0, 3)).toEqual(['window', 'buys', 'trades']);
  });
});
