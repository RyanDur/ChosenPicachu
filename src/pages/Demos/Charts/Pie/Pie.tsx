import {Explainer} from '@components/Explainer';
import {FC, ReactNode, useId} from 'react';
import {classNames} from '@components/class-names';
import {Trade} from '../coinbase';
import {degrees, explodedBy, sideTotals, slices, sweepGates} from './shapes';
import '../chart-card.css';
import './Pie.css';
import {sideOf} from '../sides';
import {LATEST_TRADES_CAP} from '../../store';

const SIZE = 120;
const RADIUS = 56;
const DEPTH = 9;
const EXPLODE = 4;

const HALF = `M 0 0 L 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${RADIUS} Z`;

const sides = ['bought', 'sold'] as const;

type Props = {
  trades: readonly Trade[];
  actions?: ReactNode;
};

export const Pie: FC<Props> = ({trades, actions}) => {
  const heading = `heading${useId()}`;
  const totals = sideTotals(trades);
  const cut = slices(sides.map(side => ({side, weight: totals[side]})));
  return <section aria-labelledby={heading} className="pie chart card rounded-corners lifted padded">
    <h3 id={heading} className="off-screen">pie</h3>
    <header className="chart-header">
      {actions}
    </header>
    <figure className="chart-stage paper-veiled-before">
      <svg className="split" aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE + DEPTH}`}>
        {['wall', 'face'].map(dressed => cut.map(slice => {
          const {dx, dy} = slice.share === 1 ? {dx: 0, dy: 0} : explodedBy(slice, EXPLODE);
          const {opening, closing} = sweepGates(slice);
          const drop = dressed === 'wall' ? DEPTH : 0;
          return <g key={`${slice.side}-${dressed}`} className={classNames('slice', sideOf[slice.side], slice.side)}
            style={{'--explode-x': `${dx}px`, '--explode-y': `${dy}px`}}>
            <g className={classNames(dressed, dressed === 'wall' ? 'side-wall' : 'side-face')} transform={`translate(${SIZE / 2} ${SIZE / 2 + drop})`}>
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
      <ul className="legend caption">
        {cut.map(slice =>
          <li key={slice.side} className={classNames(sideOf[slice.side], 'side-ink', slice.side)}>
            <data value={slice.share}>{`${Math.round(slice.share * 100)}% ${slice.side}`}</data>
          </li>)}
      </ul>
      <figcaption className="chart-caption caption">
        {cut.length > 0
          ? `volume by side · up to the last ${LATEST_TRADES_CAP.toLocaleString('en-US')} trades`
          : 'waiting for the first trade'}
      </figcaption>
    </figure>
    <Explainer>
      Up to the last 1,500 trades, as one circle, split by who came and took each trade. The green slice is the
      size buyers took from waiting sellers. The orange slice is the size sellers took from waiting buyers. The fetched
      past doesn’t say who took each trade, so the pie starts empty and counts only the trades that arrive while you
      watch.
    </Explainer>
  </section>;
};
