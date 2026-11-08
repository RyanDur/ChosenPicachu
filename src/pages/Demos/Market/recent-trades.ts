import * as schema from 'schemawax';
import {Result, not} from '@ryandur/sand';
import {decoded, http, HTTPError} from '@transport';
import {Trade, coinbase} from './coinbase';

const RecentTradesDecoder = schema.array(schema.object({
  required: {
    trade_id: schema.number,
    price: schema.string,
    size: schema.string,
    side: schema.literalUnion('buy', 'sell'),
    time: schema.string
  }
}));

const toTrades = (rows: schema.Output<typeof RecentTradesDecoder>): readonly Trade[] =>
  rows.map(row => ({
    id: row.trade_id,
    price: Number(row.price),
    tradedAt: Date.parse(row.time),
    size: Number(row.size),
    takerSide: coinbase.takerSideOf(row.side)
  })).filter(trade =>
    not(Number.isNaN(trade.price)) && not(Number.isNaN(trade.tradedAt)) && not(Number.isNaN(trade.size))
  ).reverse();

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
