import {FC, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import {Trade} from '../coinbase';
import {arcPath, explodedBy, sideTotals, slices, Slice} from './shapes';
import '../chart-card.css';
import './Pie.css';

const SIZE = 120;
const RADIUS = 56;
const DEPTH = 9;
const EXPLODE = 4;

const sides = ['bought', 'sold'];

type Props = {
  trades: readonly Trade[];
  actions?: ReactNode;
};

const disc = (slice: Slice, cy: number, dressed: string) =>
  slice.share === 1
    ? <circle className={dressed} cx={SIZE / 2} cy={cy} r={RADIUS}/>
    : <path className={dressed} d={arcPath(SIZE / 2, cy, RADIUS, slice)}/>;

export const Pie: FC<Props> = ({trades, actions}) => {
  const totals = sideTotals(trades);
  const cut = slices([totals.bought, totals.sold]);
  return <section aria-label="pie" className="pie card chart">
    <header className="chart-header">
      {actions}
    </header>
    <section className="chart-stage">
      <svg className="split" aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE + DEPTH}`}>
        {cut.map((slice, at) => {
          const {dx, dy} = slice.share === 1 ? {dx: 0, dy: 0} : explodedBy(slice, EXPLODE);
          return slice.share > 0 &&
            <g key={sides[at]} className={classNames('slice', sides[at])}
               style={{'--explode-x': `${dx}px`, '--explode-y': `${dy}px`}}>
              {disc(slice, SIZE / 2 + DEPTH, 'wall')}
              {disc(slice, SIZE / 2, 'face')}
            </g>;
        })}
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
