import {bucketTrades, mergeLive} from '../Candles/shapes';

describe('bucketTrades', () => {
  test('no trades bucket to no candles', () => {
    expect(bucketTrades([], 5000)).toEqual([]);
  });

  test('trades in one bucket carry open high low close and summed volume', () => {
    const candles = bucketTrades([
      {id: 1, price: 50001, tradedAt: 1700000000000, size: 0.01, side: 'buy'},
      {id: 2, price: 50003, tradedAt: 1700000001000, size: 0.02, side: 'buy'},
      {id: 3, price: 50000, tradedAt: 1700000002000, size: 0.01, side: 'buy'},
      {id: 4, price: 50002, tradedAt: 1700000003000, size: 0.01, side: 'buy'}
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
      {id: 1, price: 50001, tradedAt: 1700000004999, size: 0.01, side: 'buy'},
      {id: 2, price: 50002, tradedAt: 1700000005000, size: 0.02, side: 'sell'}
    ], 5000);

    expect(candles).toEqual([
      {openedAt: 1700000000000, open: 50001, high: 50001, low: 50001, close: 50001, volume: 0.01},
      {openedAt: 1700000005000, open: 50002, high: 50002, low: 50002, close: 50002, volume: 0.02}
    ]);
  });
});

describe('mergeLive', () => {
  const candleAt = (openedAt: number, close: number) =>
    ({openedAt, open: close, high: close, low: close, close, volume: 1});

  test('streamed buckets replace the seed from their first minute on', () => {
    const seed = [candleAt(0, 50001), candleAt(60000, 50002), candleAt(120000, 50003)];
    const streamed = [candleAt(120000, 50009), candleAt(180000, 50010)];

    expect(mergeLive(seed, streamed, 60)).toEqual([
      candleAt(0, 50001),
      candleAt(60000, 50002),
      candleAt(120000, 50009),
      candleAt(180000, 50010)
    ]);
  });

  test('the window keeps only the last sixty candles', () => {
    const seed = Array.from({length: 70}, (_, index) => candleAt(index * 60000, 50000 + index));

    expect(mergeLive(seed, [], 60)).toHaveLength(60);
    expect(mergeLive(seed, [], 60)[0]).toEqual(candleAt(10 * 60000, 50010));
  });
});
