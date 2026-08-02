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
}>;

const firstMidLast = (times: readonly number[]): readonly number[] =>
  [...new Set([0, Math.floor((times.length - 1) / 2), times.length - 1])]
    .map(index => times[index]);

export const Axes: FC<Props> = ({high, low, times, pattern, children}) => {
  const populated = times.length > 0;
  return <section className="axes">
    {populated && <p className="y-labels">
      <data value={high}>{dollars.format(high)}</data>
      <data value={(high + low) / 2}>{dollars.format((high + low) / 2)}</data>
      <data value={low}>{dollars.format(low)}</data>
    </p>}
    <section className="chart-area">{children}</section>
    {populated && <p className="x-labels">{firstMidLast(times).map((at, index) =>
      <time key={`${index}-${at}`} dateTime={new Date(at).toISOString()}>{format(at, pattern)}</time>
    )}</p>}
  </section>;
};
