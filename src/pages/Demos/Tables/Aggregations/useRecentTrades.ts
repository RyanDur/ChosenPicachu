import {useEffect, useState} from 'react';
import * as D from 'schemawax';
import {useEnv} from '@components/Env';
import {http} from '@transport/http';
import {validate} from '@transport/validate';
import {Trade} from '../../Charts/coinbase';

const RecentTradesDecoder = D.array(D.object({
  required: {
    trade_id: D.number,
    price: D.string,
    size: D.string,
    side: D.literalUnion('buy', 'sell'),
    time: D.string
  }
}));

const toTrades = (rows: D.Output<typeof RecentTradesDecoder>): readonly Trade[] =>
  rows.map(row => ({
    id: row.trade_id,
    price: Number(row.price),
    tradedAt: Date.parse(row.time),
    size: Number(row.size),
    side: row.side
  })).filter(trade =>
    !Number.isNaN(trade.price) && !Number.isNaN(trade.tradedAt) && !Number.isNaN(trade.size)
  ).reverse();

export const useRecentTrades = (): readonly Trade[] => {
  const {tradeHistory, tradeProduct} = useEnv();
  const [history, setHistory] = useState<readonly Trade[]>([]);

  useEffect(() => {
    const fetching = http.get<unknown>(`${tradeHistory}/products/${tradeProduct}/trades?limit=1000`)
      .mBind(validate(RecentTradesDecoder))
      .map(toTrades)
      .onSuccess(setHistory);
    return () => fetching.cancel();
  }, [tradeHistory, tradeProduct]);

  return history;
};

export const hydrated = (history: readonly Trade[], streamed: readonly Trade[]): readonly Trade[] => {
  const streaming = new Set(streamed.map(trade => trade.id));
  return [...history.filter(trade => !streaming.has(trade.id)), ...streamed]
    .sort((left, right) => left.tradedAt - right.tradedAt);
};
