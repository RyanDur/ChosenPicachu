import {Trade, takerBought} from '../coinbase';

export type SideTotals = {
  bought: number;
  sold: number;
};

export const sideTotals = (trades: readonly Trade[]): SideTotals =>
  trades.reduce((totals, trade) => ({
    bought: totals.bought + (takerBought(trade) ? trade.size : 0),
    sold: totals.sold + (takerBought(trade) ? 0 : trade.size)
  }), {bought: 0, sold: 0});

export type Slice = {
  share: number;
  from: number;
  to: number;
};

const TAU = 2 * Math.PI;

export type Weighed = {
  weight: number;
};

export const slices = <Part extends Weighed>(parts: readonly Part[]): readonly (Part & Slice)[] => {
  const whole = parts.reduce((sum, {weight}) => sum + weight, 0);
  return whole === 0
    ? []
    : parts.reduce<readonly (Part & Slice)[]>((cut, part) => {
      const from = cut[cut.length - 1]?.to ?? 0;
      const share = part.weight / whole;
      return [...cut, {...part, share, from, to: from + share * TAU}];
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
  return {opening: Math.min(sweep, 180) - 180, closing: Math.max(sweep - 180, 0)};
};
