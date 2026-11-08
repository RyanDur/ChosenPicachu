import {windowedAggregates} from '../fold';
import {Trade} from '@pages/Demos/Charts/coinbase';

const trade = (overrides: Partial<Trade>): Trade =>
  ({id: 1, price: 65000, tradedAt: 1700000000000, size: 1, side: 'sell', ...overrides});

describe('the windowed aggregates', () => {
  test('should count a trade Coinbase marks sell as a buy, since its waiting order was the seller and a buyer took it', () => {
    const [thisMinute] = windowedAggregates([
      trade({id: 1, side: 'sell'}),
      trade({id: 2, side: 'sell'}),
      trade({id: 3, side: 'buy'})
    ]);

    expect([thisMinute.buys, thisMinute.sells]).toEqual([2, 1]);
  });
});
