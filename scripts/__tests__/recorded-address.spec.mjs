import {recordedAddress} from '../lighthouse/recorded-address.mjs';

describe('the address a recording is kept under', () => {
  test('should keep an address with no query as it is', () => {
    expect(recordedAddress('/products/BTC-USD/candles')).toBe('/products/BTC-USD/candles');
  });

  test('should keep a query that is not for candles', () => {
    expect(recordedAddress('/search?start=1&end=2')).toBe('/search?start=1&end=2');
  });

  test('should drop the start and end from a candles query, keeping its granularity', () => {
    expect(recordedAddress('/products/BTC-USD/candles?granularity=60&start=1&end=2')).toBe('/products/BTC-USD/candles?granularity=60');
  });

  test('should drop the question mark when only a start and end were asked', () => {
    expect(recordedAddress('/products/BTC-USD/candles?start=1&end=2')).toBe('/products/BTC-USD/candles');
  });
});
