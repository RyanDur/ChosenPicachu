import {fold} from '../fold';
import {Trade} from '../coinbase';

const trade = (overrides: Partial<Trade>): Trade =>
  ({id: 1, price: 65000, tradedAt: 1700000000000, size: 1, takerSide: 'buy', ...overrides});

describe('the windowed aggregates', () => {
  test('should count a trade a buyer took as a buy', () => {
    const [thisMinute] = fold.aggregatesOf([
      trade({id: 1, takerSide: 'buy'}),
      trade({id: 2, takerSide: 'buy'}),
      trade({id: 3, takerSide: 'sell'})
    ]);

    expect([thisMinute.buys, thisMinute.sells]).toEqual([2, 1]);
  });
});
