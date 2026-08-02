import * as D from 'schemawax';
import {attempt, Maybe, maybe, nothing} from '@ryandur/sand';

const MatchDecoder = D.object({
  required: {
    type: D.literal('match'),
    trade_id: D.number,
    price: D.string,
    time: D.string
  }
});

export type Trade = {
  id: number;
  price: number;
  tradedAt: number;
};

export const subscribeTo = (product: string): string => JSON.stringify({
  type: 'subscribe',
  channels: [{name: 'matches', product_ids: [product]}]
});

const toTrade = (frame: D.Output<typeof MatchDecoder>): Maybe<Trade> => {
  const price = Number(frame.price);
  const tradedAt = Date.parse(frame.time);
  return Number.isNaN(price) || Number.isNaN(tradedAt)
    ? nothing()
    : maybe({id: frame.trade_id, price, tradedAt});
};

export const decodeTrade = (raw: unknown): Maybe<Trade> =>
  attempt((): unknown => JSON.parse(String(raw)))
    .mBind(json => maybe(MatchDecoder.decode(json)))
    .mBind(toTrade);
