import * as schema from 'schemawax';
import {Result} from '@ryandur/sand';
import {http} from '@transport';
import {decoded} from '@transport';
import {HTTPError} from '@transport';
import {Candle} from '../Candles/shapes';
import {granularitySeconds, Period, periodSpanMs} from '../period';

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

export const periodQuery = (period: Period): string => {
  const now = new Date();
  const start = new Date(now.getTime() - periodSpanMs[period]);
  return `granularity=${granularitySeconds[period]}` +
    `&start=${encodeURIComponent(start.toISOString())}` +
    `&end=${encodeURIComponent(now.toISOString())}`;
};

export const periodCandles = (
  base: string,
  product: string,
  query: string
): Result.Async<readonly Candle[], HTTPError> =>
  http.get(`${base}/products/${product}/candles?${query}`)
    .mBind(decoded.by(HistoryRowsDecoder))
    .map(toCandles);
