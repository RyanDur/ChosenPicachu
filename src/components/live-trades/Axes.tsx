import {FC, PropsWithChildren} from 'react';
import {format} from 'date-fns';
import './Axes.css';

const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

type Props = PropsWithChildren<{
  high: number;
  low: number;
  times: readonly number[];
  pattern: string;
  tickEvery?: number;
}>;

const firstMidLast = (times: readonly number[]): readonly number[] =>
  [...new Set([0, Math.floor((times.length - 1) / 2), times.length - 1])]
    .map(index => times[index]);

const chosenTicks = (times: readonly number[], tickEvery?: number): readonly number[] =>
  tickEvery === undefined
    ? firstMidLast(times)
    : times.filter(at => at % tickEvery === 0);

const placed = (times: readonly number[], ticks: readonly number[]): readonly {at: number; along: number}[] => {
  const from = times[0];
  const span = times[times.length - 1] - from;
  return ticks.map(at => ({at, along: span === 0 ? 50 : ((at - from) / span) * 100}));
};

export const Axes: FC<Props> = ({high, low, times, pattern, tickEvery, children}) => {
  const populated = times.length > 0;
  return <section className="axes">
    {populated && <p className="y-labels">
      <data value={high}>{dollars.format(high)}</data>
      <data value={(high + low) / 2}>{dollars.format((high + low) / 2)}</data>
      <data value={low}>{dollars.format(low)}</data>
    </p>}
    <section className="chart-area">{children}</section>
    {populated && <p className="x-labels">{placed(times, chosenTicks(times, tickEvery)).map(tick =>
      <time key={tick.at}
            dateTime={new Date(tick.at).toISOString()}
            style={{left: `${tick.along}%`}}>{format(tick.at, pattern)}</time>
    )}</p>}
  </section>;
};
