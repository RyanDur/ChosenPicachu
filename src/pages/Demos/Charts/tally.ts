import {Trade} from '../Market';

export type SideTotals = {
  bought: number;
  sold: number;
};

type Tally = {
  add: (totals: SideTotals, trade: Trade) => SideTotals;
};

const add: Tally['add'] = (totals, trade) => ({
  bought: totals.bought + (trade.takerSide === 'buy' ? trade.size : 0),
  sold: totals.sold + (trade.takerSide === 'buy' ? 0 : trade.size)
});

export const tally: Tally = {add};
