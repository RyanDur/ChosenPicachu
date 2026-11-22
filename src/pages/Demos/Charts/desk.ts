import {has, is, Maybe, maybe, nothing, some, not} from '@ryandur/sand';
import {ChartKind, chartKinds} from './chart-kinds';
import {Period} from '../Market';

export type Seat = {readonly kind: ChartKind; readonly period: Period};

type Omission = {readonly why: 'unknown'; readonly entry: string} | {readonly why: 'repeat'; readonly kind: ChartKind};

export type LeftOut = Omission | {readonly why: 'none seated'};

const periodNamed = (name?: string): Maybe<Period> => maybe(Object.values(Period).find(offered => offered === name));

const seatOf = (entry: string): Maybe<Seat> => {
  const [kind, period] = entry.split(':');
  return chartKinds.is(kind) ? some({kind, period: periodNamed(period).orElse(Period.hour)}) : nothing();
};

const entryOf = ({kind, period}: Seat): string => period === Period.hour ? kind : `${kind}:${period}`;

const written = (seats: readonly Seat[]): string => seats.map(entryOf).join(',');

type Reading = {readonly seats: readonly Seat[]; readonly omitted: readonly Omission[]};

const toldAs = (omission: Omission): string =>
  omission.why === 'unknown' ? `“${omission.entry}”` : omission.kind;

const toldOnce = (omitted: readonly Omission[], omission: Omission): readonly Omission[] =>
  omitted.some(other => toldAs(other) === toldAs(omission)) ? omitted : [...omitted, omission];

const reading = (charts: string): Reading =>
  charts.split(',').map(entry => entry.trim()).filter(entry => is(entry))
    .reduce<Reading>(({seats, omitted}, entry) => seatOf(entry).either(
      seat => seats.some(({kind}) => kind === seat.kind)
        ? {seats, omitted: toldOnce(omitted, {why: 'repeat', kind: seat.kind})}
        : {seats: [...seats, seat], omitted},
      () => ({seats, omitted: toldOnce(omitted, {why: 'unknown', entry})})
    ), {seats: [], omitted: []});

const dealt = (charts: string): readonly Seat[] => {
  const {seats} = reading(charts);
  return has(seats) ? seats : [{kind: 'price', period: Period.hour}];
};

const leftOut = (charts: string): readonly LeftOut[] => {
  const {seats, omitted} = reading(charts);
  return has(omitted) && not(has(seats)) ? [...omitted, {why: 'none seated'}] : omitted;
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

export const desk = {dealt, added, without, seated, periodChosen, absent, atAfterRemoval, leftOut};
