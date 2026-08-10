import {Trade} from '../coinbase';

export type SideTotals = {
  bought: number;
  sold: number;
};

export const sideTotals = (trades: readonly Trade[]): SideTotals =>
  trades.reduce((totals, trade) => ({
    bought: totals.bought + (trade.side === 'buy' ? trade.size : 0),
    sold: totals.sold + (trade.side === 'sell' ? trade.size : 0)
  }), {bought: 0, sold: 0});

export type Slice = {
  share: number;
  from: number;
  to: number;
};

const TAU = 2 * Math.PI;

export const slices = (weights: readonly number[]): readonly Slice[] => {
  const whole = weights.reduce((sum, weight) => sum + weight, 0);
  return whole === 0
    ? []
    : weights.reduce<readonly Slice[]>((cut, weight) => {
      const from = cut[cut.length - 1]?.to ?? 0;
      const share = weight / whole;
      return [...cut, {share, from, to: from + share * TAU}];
    }, []);
};

export const arcPath = (cx: number, cy: number, r: number, slice: Slice): string => {
  const at = (angle: number): string =>
    `${cx + r * Math.sin(angle)} ${cy - r * Math.cos(angle)}`;
  const longWay = slice.to - slice.from > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${at(slice.from)} A ${r} ${r} 0 ${longWay} 1 ${at(slice.to)} Z`;
};
