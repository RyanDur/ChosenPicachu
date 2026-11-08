import {FC, PropsWithChildren} from 'react';
import {has, Maybe} from '@ryandur/sand';
import {format} from 'date-fns';
import {money} from '../../Market';
import {Range} from './range';
import './Axes.css';

type Props = PropsWithChildren<{
  range: Maybe<Range>;
  pattern: string;
  tickEvery?: number;
  headroomMilliseconds?: number;
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
  headroomMilliseconds: number
): readonly {at: number; along: number}[] => {
  const from = times[0];
  const shownMilliseconds = times[times.length - 1] - from + headroomMilliseconds;
  return ticks.map(at => ({at, along: shownMilliseconds === 0 ? 50 : ((at - from) / shownMilliseconds) * 100}));
};

export const Axes: FC<Props> = ({
  range, pattern, tickEvery, headroomMilliseconds = 0,
  label = value => money.dollars.format(value), children
}) => <div className="axes">
  <p className="y-labels caption">{range.map(({high, low}) => <>
    <data value={high}>{label(high)}</data>
    <data value={(high + low) / 2}>{label((high + low) / 2)}</data>
    <data value={low}>{label(low)}</data>
  </>).orNull()}</p>
  <div className="chart-area">{children}</div>
  <p className="x-labels caption">{range.map(({times}) => placed(times, chosenTicks(times, tickEvery), headroomMilliseconds).map(tick =>
    <time key={tick.at}
      className="tick"
      dateTime={new Date(tick.at).toISOString()}
      style={{'--along': `${tick.along}%`}}>{format(tick.at, pattern)}</time>
  )).orNull()}</p>
</div>;
