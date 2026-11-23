import {render, waitFor} from '@testing-library/react';
import {tradeTotals} from '@pages/Demos/Market/trade-totals';
import {coinbase} from '@pages/Demos/Market/coinbase';
import {cells, marketActions, marketReads, marketStore} from '@pages/Demos/Market';
import {broadcast, hangUpEveryFeed, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {EagerTable} from '../../Builds/EagerTable';
import {tableShape, vanillaFrame} from '../__test_support';

describe('the two worlds deal the same table', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    hangUpEveryFeed();
  });

  it('the frame markup stands exactly as the react table renders', () => {
    const rows = tradeTotals.perLookback([]).map(cells.from);
    const {unmount} = render(<EagerTable caption="live aggregations" origin="hide" motion="animated" columns={cells.measures} rows={rows}/>);
    const react = tableShape.read(document.body);
    unmount();

    vanillaFrame.stand();
    const frame = tableShape.read(document.body);

    expect(frame).toEqual(react);
  });

  it('should mark a ticked cell the same way in both worlds', async () => {
    const first = tradeFrame(100);
    const second = tradeFrame(101, 1700000001000);
    const store = marketStore();
    [first, second].forEach(frame =>
      coinbase.decodeTrade(frame).map(trade => store.dispatch(marketActions.tradesArrived([trade]))));
    const {unmount} = render(<EagerTable caption="live aggregations" origin="hide" motion="animated" columns={cells.measures} rows={marketReads.rows(store.state)}/>);
    const react = tableShape.read(document.body);
    unmount();

    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed(feed);
    broadcast(feed, [first]);
    await waitFor(() => expect(vanillaFrame.cell('this minute', 'trades')).toHaveTextContent('1'));
    broadcast(feed, [second]);
    await waitFor(() => expect(vanillaFrame.markOn('this minute', 'vwap')).toBe('up'));

    expect(tableShape.read(document.body)).toEqual(react);
  });
});
