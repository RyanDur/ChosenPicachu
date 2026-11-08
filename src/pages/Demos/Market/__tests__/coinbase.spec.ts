import {coinbase} from '../coinbase';

const match = (side: string): string => JSON.stringify({
  type: 'match', trade_id: 1, price: '65000.00', size: '0.5', side, time: '2026-11-08T12:00:00Z'
});

describe('a match from Coinbase', () => {
  test('should be a buyer’s trade when Coinbase marks it sell, since the waiting order sold', () => {
    expect(coinbase.decodeTrade(match('sell')).map(trade => trade.takerSide).orNull()).toBe('buy');
  });

  test('should be a seller’s trade when Coinbase marks it buy, since the waiting order bought', () => {
    expect(coinbase.decodeTrade(match('buy')).map(trade => trade.takerSide).orNull()).toBe('sell');
  });
});
