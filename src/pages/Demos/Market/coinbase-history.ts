import * as schema from 'schemawax';
import {Result} from '@ryandur/sand';
import {decoded, http, HTTPError} from '@transport';
import {Candle} from './candles';
import {Period} from './Period';
import {periods} from './periods';

const HistoryRowsDecoder = schema.array(schema.array(schema.number));

const toCandle = (row: readonly number[]): Candle => ({
  openedAt: row[0] * 1000,
  low: row[1],
  high: row[2],
  open: row[3],
  close: row[4],
  volume: row[5]
});

const toCandles = (rows: readonly (readonly number[])[]): readonly Candle[] =>
  rows.filter(row => row.length === 6).map(toCandle).reverse();

const periodQuery = (period: Period): string => {
  const now = new Date();
  const start = new Date(now.getTime() - periods.spanMilliseconds[period]);
  return `granularity=${periods.granularitySeconds[period]}` +
    `&start=${encodeURIComponent(start.toISOString())}` +
    `&end=${encodeURIComponent(now.toISOString())}`;
};

const periodCandles = (
  base: string,
  product: string,
  query: string
): Result.Async<readonly Candle[], HTTPError> =>
  http.get(`${base}/products/${product}/candles?${query}`)
    .mBind(decoded.by(HistoryRowsDecoder))
    .map(toCandles);

type CoinbaseHistory = {
  periodQuery: (period: Period) => string;
  periodCandles: (base: string, product: string, query: string) => Result.Async<readonly Candle[], HTTPError>;
};

export const coinbaseHistory: CoinbaseHistory = {periodQuery, periodCandles};
