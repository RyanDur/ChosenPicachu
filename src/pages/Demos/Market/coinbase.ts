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

type Side = 'buy' | 'sell';

export type Trade = {
  id: number;
  price: number;
  tradedAt: number;
  size: number;
  takerSide: Side;
};

// Coinbase marks a match with the side of the order that was waiting, so a buyer took the trade when that order sold
const takerSideOf = (mark: Side): Side => mark === 'sell' ? 'buy' : 'sell';

const subscribeTo = (product: string): string => JSON.stringify({
  type: 'subscribe',
  channels: [{name: 'matches', product_ids: [product]}]
});

const toTrade = (frame: schema.Output<typeof MatchDecoder>): Maybe<Trade> => {
  const price = Number(frame.price);
  const tradedAt = Date.parse(frame.time);
  const size = Number(frame.size);
  return Number.isNaN(price) || Number.isNaN(tradedAt) || Number.isNaN(size)
    ? nothing()
    : maybe({id: frame.trade_id, price, tradedAt, size, takerSide: takerSideOf(frame.side)});
};

const decodeTrade = (raw: unknown): Maybe<Trade> =>
  attempt((): unknown => JSON.parse(String(raw)))
    .mBind(json => maybe(MatchDecoder.decode(json)))
    .mBind(toTrade);

type Coinbase = {
  takerSideOf: (mark: Side) => Side;
  subscribeTo: (product: string) => string;
  decodeTrade: (raw: unknown) => Maybe<Trade>;
};

export const coinbase: Coinbase = {takerSideOf, subscribeTo, decodeTrade};
