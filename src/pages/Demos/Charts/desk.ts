import {has, Maybe, maybe, nothing, some, not} from '@ryandur/sand';
import {ChartKind, chartKinds} from './chart-kinds';
import {Period} from '../Market';

export type Seat = {readonly kind: ChartKind; readonly period: Period};

const isPeriod = (period: string): period is Period => Object.values(Period).some(offered => offered === period);

const seatOf = (entry: string): Maybe<Seat> => {
  const [kind, period] = entry.split(':');
  return chartKinds.is(kind) ? some({kind, period: has(period) && isPeriod(period) ? period : Period.hour}) : nothing();
};

const entryOf = ({kind, period}: Seat): string => period === Period.hour ? kind : `${kind}:${period}`;

const written = (seats: readonly Seat[]): string => seats.map(entryOf).join(',');

const dealt = (charts: string): readonly Seat[] => {
  const seats = charts.split(',').flatMap(entry => seatOf(entry).either(seat => [seat], () => []))
    .filter((seat, at, all) => all.findIndex(other => other.kind === seat.kind) === at);
  return has(seats) ? seats : [{kind: 'price', period: Period.hour}];
};

const added = (kind: ChartKind, seats: readonly Seat[]): string =>
  written([{kind, period: Period.hour}, ...seats]);

const without = (at: number, seats: readonly Seat[]): string =>
  written(seats.filter((_, other) => other !== at));

const seated = (from: number, to: number, seats: readonly Seat[]): string => {
  const next = [...seats];
  const [lifted] = next.splice(from, 1);
  next.splice(to, 0, lifted);
  return written(next);
};

const periodChosen = (kind: ChartKind, period: Period, seats: readonly Seat[]): string =>
  written(seats.some(seat => seat.kind === kind)
    ? seats.map(seat => seat.kind === kind ? {...seat, period} : seat)
    : [...seats, {kind, period}]);

const absent = (seats: readonly Seat[]): readonly ChartKind[] =>
  chartKinds.all.filter(kind => not(seats.some(seat => seat.kind === kind)));

const atAfterRemoval = (at: number, standing: number): Maybe<number> =>
  maybe([at + 1, at - 1].find(next => next >= 0 && next < standing));

export const desk = {dealt, added, without, seated, periodChosen, absent, atAfterRemoval};
