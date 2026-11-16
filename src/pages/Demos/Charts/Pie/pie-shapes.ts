import {empty, maybe} from '@ryandur/sand';
import {Trade} from '../../Market';
import {SideTotals, tally} from '../tally';

const sideTotals = (trades: readonly Trade[]): SideTotals =>
  trades.reduce(tally.add, {bought: 0, sold: 0});

export type Wedge = {
  share: number;
  from: number;
  to: number;
};

const TAU = 2 * Math.PI;

export type Weighed = {
  weight: number;
};

const wedges = <Part extends Weighed>(parts: readonly Part[]): readonly (Part & Wedge)[] => {
  const whole = parts.reduce((sum, {weight}) => sum + weight, 0);
  return whole === 0
    ? []
    : parts.reduce<readonly (Part & Wedge)[]>((cut, part) => {
      const from = maybe(cut[cut.length - 1]).map(wedge => wedge.to).orElse(0);
      const share = part.weight / whole;
      return [...cut, {...part, share, from, to: from + share * TAU}];
    }, []);
};

export type Explosion = {
  dx: number;
  dy: number;
};

const explodedBy = (wedge: Wedge, by: number): Explosion => {
  const middle = (wedge.from + wedge.to) / 2;
  return {dx: by * Math.sin(middle), dy: -by * Math.cos(middle)};
};

const degrees = (radians: number): number => (radians * 180) / Math.PI;

export type Gates = {
  opening: number;
  closing: number;
};

const sweepGates = (wedge: Wedge): Gates => {
  const sweep = degrees(wedge.to - wedge.from);
  return {opening: Math.min(sweep, 180) - 180, closing: Math.max(sweep - 180, 0)};
};

const wholePercents = (cut: readonly Wedge[]): readonly number[] => {
  const rounded = cut.slice(0, -1).map(wedge => Math.round(wedge.share * 100));
  const leftOf100 = 100 - rounded.reduce((sum, percent) => sum + percent, 0);
  return empty(cut) ? [] : [...rounded, leftOf100];
};

export const pieShapes = {sideTotals, wedges, explodedBy, degrees, sweepGates, wholePercents};
