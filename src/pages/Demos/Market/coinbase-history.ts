import * as schema from 'schemawax';
import {is, maybe, not, Result} from '@ryandur/sand';
import {decoded, http, HTTPError} from '@transport';
import {Candle} from './candles';
import {Period} from './Period';
import {periods} from './periods';

const CandleFields =
  schema.tuple(schema.number, schema.number, schema.number, schema.number, schema.number, schema.number);

const HistoryRowDecoder = schema.array(schema.unknown).andThen(row => {
  if (row.length !== 6) {
    throw new schema.DecoderError(`A history row is six numbers, not ${row.length}`);
  }
  return CandleFields.forceDecode(row);
});

type HistoryRow = schema.Output<typeof HistoryRowDecoder>;

const HistoryRowsDecoder = schema.array(schema.unknown).andThen(rows => {
  const readable = rows.flatMap(row => maybe(HistoryRowDecoder.decode(row)).map(built => [built]).orElse([]));
  if (is(rows.length) && not(readable.length)) {
    throw new schema.DecoderError('No row of this history is six numbers');
  }
  return readable;
});

const toCandle = ([openedAt, low, high, open, close, volume]: HistoryRow): Candle =>
  ({openedAt: openedAt * 1000, low, high, open, close, volume});

const toCandles = (rows: readonly HistoryRow[]): readonly Candle[] => rows.map(toCandle).reverse();

const periodQuery = (period: Period, now: Date): string => {
  const start = new Date(now.getTime() - periods.lengthMilliseconds[period]);
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
  periodQuery: (period: Period, now: Date) => string;
  periodCandles: (base: string, product: string, query: string) => Result.Async<readonly Candle[], HTTPError>;
};

export const coinbaseHistory: CoinbaseHistory = {periodQuery, periodCandles};
