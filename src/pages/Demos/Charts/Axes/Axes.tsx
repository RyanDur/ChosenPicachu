import {FC, PropsWithChildren} from 'react';
import {Maybe, maybe} from '@ryandur/sand';
import {format} from 'date-fns';
import {money} from '../../Market';
import {AxisExtent} from './axis-range';
import './Axes.css';

type Props = PropsWithChildren<{
  extent: Maybe<AxisExtent>;
  timeFormat: string;
  tickEvery?: number;
  headroomMilliseconds?: number;
  scaleText?: (value: number) => string;
}>;

const firstMidLast = (times: readonly number[]): readonly number[] =>
  [...new Set([0, Math.floor((times.length - 1) / 2), times.length - 1])]
    .map(index => times[index]);

const chosenTicks = (times: readonly number[], tickEvery?: number): readonly number[] =>
  maybe(tickEvery).map(every => times.filter(at => at % every === 0)).orElse(firstMidLast(times));

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
  extent, timeFormat, tickEvery, headroomMilliseconds = 0,
  scaleText = value => money.dollars.format(value), children
}) => <>
  <p className="y-labels caption">{extent.map(({high, low}) => <>
    <data value={high}>{scaleText(high)}</data>
    <data value={(high + low) / 2}>{scaleText((high + low) / 2)}</data>
    <data value={low}>{scaleText(low)}</data>
  </>).orNull()}</p>
  {children}
  <p className="x-labels caption">{extent.map(({times}) => placed(times, chosenTicks(times, tickEvery), headroomMilliseconds).map(tick =>
    <time key={tick.at}
      className="tick"
      dateTime={new Date(tick.at).toISOString()}
      style={{'--along': `${tick.along}%`}}>{format(tick.at, timeFormat)}</time>
  )).orNull()}</p>
</>;
