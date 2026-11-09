import * as schema from 'schemawax';
import {asyncFailure, asyncSuccess, is, Maybe, maybe, not, Result} from '@ryandur/sand';
import {decoded, http, HTTPError} from '@transport';
import {Candle} from './candles';
import {Period} from './Period';
import {periods} from './periods';

const HistoryRowsDecoder = schema.array(schema.unknown);

const HistoryRowDecoder =
  schema.tuple(schema.number, schema.number, schema.number, schema.number, schema.number, schema.number);

const toCandle = (row: unknown): Maybe<Candle> =>
  maybe(HistoryRowDecoder.decode(row)).map(([openedAt, low, high, open, close, volume]) =>
    ({openedAt: openedAt * 1000, low, high, open, close, volume}));

const toCandles = (rows: readonly unknown[]): Result.Async<readonly Candle[], HTTPError> => {
  const candles = rows.flatMap(row => toCandle(row).either(candle => [candle], () => [])).reverse();
  return is(rows.length) && not(candles.length) ? asyncFailure(HTTPError.CANNOT_DECODE) : asyncSuccess(candles);
};

const periodQuery = (period: Period, now: Date): string => {
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
    .mBind(toCandles);

type CoinbaseHistory = {
  periodQuery: (period: Period, now: Date) => string;
  periodCandles: (base: string, product: string, query: string) => Result.Async<readonly Candle[], HTTPError>;
};

export const coinbaseHistory: CoinbaseHistory = {periodQuery, periodCandles};
