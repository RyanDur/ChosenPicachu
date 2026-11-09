import * as schema from 'schemawax';
import {Result, not} from '@ryandur/sand';
import {decoded, http, HTTPError} from '@transport';
import {Trade, coinbase} from './coinbase';

const RecentTradesDecoder = schema.array(coinbase.TradeDecoder);

const toTrades = (rows: schema.Output<typeof RecentTradesDecoder>): readonly Trade[] =>
  rows.flatMap(row => coinbase.toTrade(row).either(trade => [trade], () => [])).reverse();

const load = (base: string, product: string): Result.Async<readonly Trade[], HTTPError> =>
  http.get(`${base}/products/${product}/trades?limit=1000`)
    .mBind(decoded.by(RecentTradesDecoder))
    .map(toTrades);

const hydrated = (history: readonly Trade[], streamed: readonly Trade[]): readonly Trade[] => {
  const streaming = new Set(streamed.map(trade => trade.id));
  return [...history.filter(trade => not(streaming.has(trade.id))), ...streamed]
    .sort((left, right) => left.tradedAt - right.tradedAt);
};

type RecentTrades = {
  load: (base: string, product: string) => Result.Async<readonly Trade[], HTTPError>;
  hydrated: (history: readonly Trade[], streamed: readonly Trade[]) => readonly Trade[];
};

export const recentTrades: RecentTrades = {load, hydrated};
