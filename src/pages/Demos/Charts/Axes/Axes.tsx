import {FC, PropsWithChildren} from 'react';
import {has, Maybe, maybe} from '@ryandur/sand';
import {format} from 'date-fns';
import {dollars} from '../money';
import './Axes.css';

export type Range = {high: number; low: number; times: readonly [number, ...number[]]};

export const rangeOf = (times: readonly number[], high: number, low: number): Maybe<Range> => {
  const [first, ...rest] = times;
  return maybe(first).map(at => ({high, low, times: [at, ...rest]}));
};

type Props = PropsWithChildren<{
  range: Maybe<Range>;
  pattern: string;
  tickEvery?: number;
  headroomMs?: number;
  label?: (value: number) => string;
}>;

const firstMidLast = (times: readonly number[]): readonly number[] =>
  [...new Set([0, Math.floor((times.length - 1) / 2), times.length - 1])]
    .map(index => times[index]);

const chosenTicks = (times: readonly number[], tickEvery?: number): readonly number[] =>
  has(tickEvery)
    ? times.filter(at => at % tickEvery === 0)
    : firstMidLast(times);

const placed = (
  times: readonly number[],
  ticks: readonly number[],
  headroomMs: number
): readonly {at: number; along: number}[] => {
  const from = times[0];
  const span = times[times.length - 1] - from + headroomMs;
  return ticks.map(at => ({at, along: span === 0 ? 50 : ((at - from) / span) * 100}));
};

export const Axes: FC<Props> = ({
  range, pattern, tickEvery, headroomMs = 0,
  label = value => dollars.format(value), children
}) => <div className="axes">
  <p className="y-labels caption">{range.map(({high, low}) => <>
    <data value={high}>{label(high)}</data>
    <data value={(high + low) / 2}>{label((high + low) / 2)}</data>
    <data value={low}>{label(low)}</data>
  </>).orNull()}</p>
  <div className="chart-area">{children}</div>
  <p className="x-labels caption">{range.map(({times}) => placed(times, chosenTicks(times, tickEvery), headroomMs).map(tick =>
    <time key={tick.at}
      className="tick"
      dateTime={new Date(tick.at).toISOString()}
      style={{'--along': `${tick.along}%`}}>{format(tick.at, pattern)}</time>
  )).orNull()}</p>
</div>;
