import {bucketTrades} from '../Candles/shapes';

describe('bucketTrades', () => {
  test('no trades bucket to no candles', () => {
    expect(bucketTrades([], 5000)).toEqual([]);
  });

  test('trades in one bucket carry open high low close and summed volume', () => {
    const candles = bucketTrades([
      {id: 1, price: 50001, tradedAt: 1700000000000, size: 0.01},
      {id: 2, price: 50003, tradedAt: 1700000001000, size: 0.02},
      {id: 3, price: 50000, tradedAt: 1700000002000, size: 0.01},
      {id: 4, price: 50002, tradedAt: 1700000003000, size: 0.01}
    ], 5000);

    expect(candles).toEqual([{
      openedAt: 1700000000000,
      open: 50001,
      high: 50003,
      low: 50000,
      close: 50002,
      volume: 0.05
    }]);
  });

  test('a bucket boundary starts the next candle', () => {
    const candles = bucketTrades([
      {id: 1, price: 50001, tradedAt: 1700000004999, size: 0.01},
      {id: 2, price: 50002, tradedAt: 1700000005000, size: 0.02}
    ], 5000);

    expect(candles).toEqual([
      {openedAt: 1700000000000, open: 50001, high: 50001, low: 50001, close: 50001, volume: 0.01},
      {openedAt: 1700000005000, open: 50002, high: 50002, low: 50002, close: 50002, volume: 0.02}
    ]);
  });
});
