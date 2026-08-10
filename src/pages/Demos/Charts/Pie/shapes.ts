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

export type Explosion = {
  dx: number;
  dy: number;
};

export const explodedBy = (slice: Slice, by: number): Explosion => {
  const middle = (slice.from + slice.to) / 2;
  return {dx: by * Math.sin(middle), dy: -by * Math.cos(middle)};
};

export const degrees = (radians: number): number => (radians * 180) / Math.PI;

export type Gates = {
  opening: number;
  closing: number;
};

export const sweepGates = (slice: Slice): Gates => {
  const sweep = degrees(slice.to - slice.from);
  return {opening: Math.min(sweep, 180) - 180, closing: sweep - 180};
};
