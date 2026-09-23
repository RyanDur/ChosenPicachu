import {has, Maybe, maybe} from '@ryandur/sand';
import {allChartKinds, ChartKind, isChartKind} from './kinds';
import {Period} from './period';

export type Seat = {readonly kind: ChartKind; readonly period: Period};

const isPeriod = (period: string): period is Period => Object.values(Period).some(offered => offered === period);

const seatOf = (entry: string): Seat | undefined => {
  const [kind, period] = entry.split(':');
  return isChartKind(kind) ? {kind, period: has(period) && isPeriod(period) ? period : Period.hour} : undefined;
};

const written = ({kind, period}: Seat): string => period === Period.hour ? kind : `${kind}:${period}`;

const desk = (seats: readonly Seat[]): string => seats.map(written).join(',');

export const dealt = (charts: string): readonly Seat[] => {
  const seats = charts.split(',').map(seatOf).filter(has)
    .filter((seat, at, all) => all.findIndex(other => other.kind === seat.kind) === at);
  return seats.length > 0 ? seats : [{kind: 'price', period: Period.hour}];
};

export const added = (kind: ChartKind, seats: readonly Seat[]): string =>
  desk([{kind, period: Period.hour}, ...seats]);

export const without = (at: number, seats: readonly Seat[]): string =>
  desk(seats.filter((_, seat) => seat !== at));

export const seated = (from: number, to: number, seats: readonly Seat[]): string => {
  const next = [...seats];
  const [lifted] = next.splice(from, 1);
  next.splice(to, 0, lifted);
  return desk(next);
};

export const periodChosen = (kind: ChartKind, period: Period, seats: readonly Seat[]): string =>
  desk(seats.some(seat => seat.kind === kind)
    ? seats.map(seat => seat.kind === kind ? {...seat, period} : seat)
    : [...seats, {kind, period}]);

export const absent = (seats: readonly Seat[]): readonly ChartKind[] =>
  allChartKinds.filter(kind => !seats.some(seat => seat.kind === kind));

export const seatAfterRemoval = (at: number, seats: readonly Seat[]): Maybe<Seat> =>
  maybe(seats[Math.min(at, seats.length - 1)]);
