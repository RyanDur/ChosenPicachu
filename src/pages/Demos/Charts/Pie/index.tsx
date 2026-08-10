import {FC, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import {Trade} from '../coinbase';
import {degrees, explodedBy, sideTotals, slices, sweepGates} from './shapes';
import '../chart-card.css';
import './Pie.css';

const SIZE = 120;
const RADIUS = 56;
const DEPTH = 9;
const EXPLODE = 4;

const HALF = `M 0 0 L 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${RADIUS} Z`;

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
      <svg className="split" aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE + DEPTH}`}>
        <defs>
          <clipPath id="pie-first-gate">
            <rect x={0} y={-SIZE} width={SIZE} height={2 * SIZE}/>
          </clipPath>
          <clipPath id="pie-second-gate">
            <rect x={-SIZE} y={-SIZE} width={SIZE} height={2 * SIZE}/>
          </clipPath>
        </defs>
        {cut.map((slice, at) => {
          const {dx, dy} = slice.share === 1 ? {dx: 0, dy: 0} : explodedBy(slice, EXPLODE);
          const {opening, closing} = sweepGates(slice);
          const layer = (drop: number, dressed: string) =>
            <g className={dressed}
               style={{'--seat-x': `${SIZE / 2}px`, '--seat-y': `${SIZE / 2 + drop}px`,
                 '--turn': `${degrees(slice.from)}deg`}}>
              <g clipPath="url(#pie-first-gate)">
                <path className="half" d={HALF} style={{'--swing': `${opening}deg`}}/>
              </g>
              <g clipPath="url(#pie-second-gate)">
                <path className="half" d={HALF} style={{'--swing': `${closing}deg`}}/>
              </g>
            </g>;
          return <g key={sides[at]} className={classNames('slice', sides[at])}
                    style={{'--explode-x': `${dx}px`, '--explode-y': `${dy}px`}}>
            {layer(DEPTH, 'wall')}
            {layer(0, 'face')}
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
