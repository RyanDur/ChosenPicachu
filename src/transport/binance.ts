import * as D from 'schemawax';
import {attempt, Maybe, maybe, nothing} from '@ryandur/sand';

const BinanceTradeDecoder = D.object({
  required: {
    e: D.literal('trade'),
    t: D.number,
    p: D.string
  }
});

export type Trade = {
  id: number;
  price: number;
};

const toTrade = (frame: D.Output<typeof BinanceTradeDecoder>): Maybe<Trade> => {
  const price = Number(frame.p);
  return Number.isNaN(price) ? nothing() : maybe({id: frame.t, price});
};

export const decodeTrade = (raw: unknown): Maybe<Trade> =>
  attempt((): unknown => JSON.parse(String(raw)))
    .mBind(json => maybe(BinanceTradeDecoder.decode(json)))
    .mBind(toTrade);
