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
  return <section aria-label="pie" className="pie chart paper rounded-corners drop-shadow padded">
    <header className="chart-header">
      {actions}
    </header>
    <section className="chart-stage">
      <svg className="split" aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE + DEPTH}`}>
        {['wall', 'face'].map(dressed => cut.map((slice, at) => {
          const {dx, dy} = slice.share === 1 ? {dx: 0, dy: 0} : explodedBy(slice, EXPLODE);
          const {opening, closing} = sweepGates(slice);
          const drop = dressed === 'wall' ? DEPTH : 0;
          return <g key={`${sides[at]}-${dressed}`} className={classNames('slice', sides[at])}
                    style={{'--explode-x': `${dx}px`, '--explode-y': `${dy}px`}}>
            <g className={dressed} transform={`translate(${SIZE / 2} ${SIZE / 2 + drop})`}>
              <g className="spin" style={{'--turn': `${degrees(slice.from)}deg`}}>
                <svg x={0} y={-RADIUS} width={RADIUS} height={2 * RADIUS}
                     viewBox={`0 ${-RADIUS} ${RADIUS} ${2 * RADIUS}`}>
                  <path className="half" d={HALF} style={{'--swing': `${opening}deg`}}/>
                </svg>
                <svg x={-RADIUS} y={-RADIUS} width={RADIUS} height={2 * RADIUS}
                     viewBox={`${-RADIUS} ${-RADIUS} ${RADIUS} ${2 * RADIUS}`}>
                  <path className="half" d={HALF} style={{'--swing': `${closing}deg`}}/>
                </svg>
              </g>
            </g>
          </g>;
        }))}
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
