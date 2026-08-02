import * as D from 'schemawax';
import {attempt, Maybe, maybe} from '@ryandur/sand';

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

const toTrade = (frame: D.Output<typeof BinanceTradeDecoder>): Trade => ({
  id: frame.t,
  price: Number(frame.p)
});

export const decodeTrade = (raw: unknown): Maybe<Trade> =>
  attempt((): unknown => JSON.parse(String(raw)))
    .mBind(json => maybe(BinanceTradeDecoder.decode(json)))
    .map(toTrade);
