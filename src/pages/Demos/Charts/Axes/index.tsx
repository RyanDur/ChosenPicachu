import {FC, PropsWithChildren} from 'react';
import {has} from '@ryandur/sand';
import {format} from 'date-fns';
import {dollars} from '../money';
import './Axes.css';

type Props = PropsWithChildren<{
  high: number;
  low: number;
  times: readonly number[];
  pattern: string;
  tickEvery?: number;
  headroomMs?: number;
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

export const Axes: FC<Props> = ({high, low, times, pattern, tickEvery, headroomMs = 0, children}) => {
  const populated = times.length > 0;
  return <section className="axes">
    {populated && <p className="y-labels">
      <data value={high}>{dollars.format(high)}</data>
      <data value={(high + low) / 2}>{dollars.format((high + low) / 2)}</data>
      <data value={low}>{dollars.format(low)}</data>
    </p>}
    <section className="chart-area">{children}</section>
    {populated && <p className="x-labels">{placed(times, chosenTicks(times, tickEvery), headroomMs).map(tick =>
      <time key={tick.at}
            dateTime={new Date(tick.at).toISOString()}
            style={{left: `${tick.along}%`}}>{format(tick.at, pattern)}</time>
    )}</p>}
  </section>;
};
