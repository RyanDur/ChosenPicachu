import {Trade} from '@transport/coinbase';
import {cents, deltaLabel} from './money';

export type Aggregation = {
  measure: string;
  value: string;
};

export const aggregations = (trades: readonly Trade[]): readonly Aggregation[] => {
  if (trades.length === 0) {
    return [];
  }
  const volume = trades.reduce((total, trade) => total + trade.size, 0);
  const notional = trades.reduce((total, trade) => total + trade.size * trade.price, 0);
  const buys = trades.filter(trade => trade.side === 'buy').length;
  return [
    {measure: 'trades', value: String(trades.length)},
    {measure: 'buys', value: String(buys)},
    {measure: 'sells', value: String(trades.length - buys)},
    {measure: 'volume', value: volume.toFixed(2)},
    {measure: 'vwap', value: cents.format(notional / volume)},
    {measure: 'change', value: deltaLabel(trades[0].price, trades[trades.length - 1].price)}
  ];
};
