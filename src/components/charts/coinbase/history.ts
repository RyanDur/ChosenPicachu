import * as D from 'schemawax';
import {Result} from '@ryandur/sand';
import {http} from '@transport/http';
import {validate} from '@transport/validate';
import {HTTPError} from '@transport/types';
import {Candle} from '../Candles/shapes';

const HistoryRowsDecoder = D.array(D.array(D.number));

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

export const periodCandles = (
  base: string,
  product: string,
  query: string
): Result.Async<readonly Candle[], HTTPError> =>
  http.get<unknown>(`${base}/products/${product}/candles?${query}`)
    .mBind(validate(HistoryRowsDecoder))
    .map(toCandles);
