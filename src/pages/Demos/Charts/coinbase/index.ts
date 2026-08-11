import * as schema from 'schemawax';
import {attempt, Maybe, maybe, nothing} from '@ryandur/sand';

const MatchDecoder = schema.object({
  required: {
    type: schema.literal('match'),
    trade_id: schema.number,
    price: schema.string,
    size: schema.string,
    side: schema.literalUnion('buy', 'sell'),
    time: schema.string
  }
});

export type Trade = {
  id: number;
  price: number;
  tradedAt: number;
  size: number;
  side: 'buy' | 'sell';
};

export const subscribeTo = (product: string): string => JSON.stringify({
  type: 'subscribe',
  channels: [{name: 'matches', product_ids: [product]}]
});

const toTrade = (frame: schema.Output<typeof MatchDecoder>): Maybe<Trade> => {
  const price = Number(frame.price);
  const tradedAt = Date.parse(frame.time);
  const size = Number(frame.size);
  return Number.isNaN(price) || Number.isNaN(tradedAt) || Number.isNaN(size)
    ? nothing()
    : maybe({id: frame.trade_id, price, tradedAt, size, side: frame.side});
};

export const decodeTrade = (raw: unknown): Maybe<Trade> =>
  attempt((): unknown => JSON.parse(String(raw)))
    .mBind(json => maybe(MatchDecoder.decode(json)))
    .mBind(toTrade);
