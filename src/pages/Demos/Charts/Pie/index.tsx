import {FC, ReactNode} from 'react';
import {Trade} from '../coinbase';
import {arcPath, sideTotals, slices} from './shapes';
import '../chart-card.css';
import './Pie.css';

const SIZE = 120;
const RADIUS = 56;

const sides = ['bought', 'sold'];

type Props = {
  trades: readonly Trade[];
  actions?: ReactNode;
};

export const Pie: FC<Props> = ({trades, actions}) => {
  const totals = sideTotals(trades);
  const cut = slices([totals.bought, totals.sold]);
  return <section aria-label="pie" className="pie card chart">
    <header className="chart-header">
      {actions}
    </header>
    <section className="chart-stage">
      <svg className="split" aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {cut.map((slice, at) => slice.share === 1
          ? <circle key={sides[at]} className={sides[at]} cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}/>
          : slice.share > 0 &&
            <path key={sides[at]} className={sides[at]} d={arcPath(SIZE / 2, SIZE / 2, RADIUS, slice)}/>)}
      </svg>
      <p className="legend">
        {cut.map((slice, at) =>
          <data key={sides[at]} value={slice.share} className={sides[at]}>
            {`${Math.round(slice.share * 100)}% ${sides[at]}`}
          </data>)}
      </p>
      <small className="caption">
        {cut.length > 0
          ? 'the session’s volume by side · since you arrived'
          : 'waiting for the first trade'}
      </small>
    </section>
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        The whole pot, one circle: everything traded since you arrived, split by who
        started it. The green slice is the size the buyers took; the orange slice is the
        size the sellers gave. History does not say who started each trade, so the pie
        grows from nothing and counts only the session it watched.
      </p>
    </details>
  </section>;
};
