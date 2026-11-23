import {has} from '@ryandur/sand';
import {Explainer} from '@components/Explainer';
import {FC, PropsWithChildren} from 'react';
import {classNames} from '@components';
import {liveTrades, marketReads} from '../../Market';
import {useMarketRead} from '../../Market/Trading';
import {pieShapes} from './pie-shapes';
import '../chart-card.css';
import './Pie.css';
import {sideOf} from '../sides';
import {chartKinds} from '../chart-kinds';

const SIZE = 120;
const RADIUS = 56;
const DEPTH = 9;
const EXPLODE = 4;

const HALF = `M 0 0 L 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${RADIUS} Z`;

const sides = ['bought', 'sold'] as const;

export const Pie: FC<PropsWithChildren> = ({children}) => {
  const trades = useMarketRead(marketReads.liveTrades);
  const totals = pieShapes.sideTotals(trades);
  const cut = pieShapes.wedges(sides.map(side => ({side, weight: totals[side]})));
  const percents = pieShapes.wholePercents(cut);
  return <section aria-label={chartKinds.names.pie} className="pie chart padded">
    <header className="chart-header">
      {children}
    </header>
    <figure className="chart-stage paper-veiled-before">
      <svg className="split" aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE + DEPTH}`}>
        {['wall', 'face'].map(dressed => cut.map(wedge => {
          const {dx, dy} = wedge.share === 1 ? {dx: 0, dy: 0} : pieShapes.explodedBy(wedge, EXPLODE);
          const {opening, closing} = pieShapes.sweepGates(wedge);
          const lowered = dressed === 'wall' ? DEPTH : 0;
          return <g key={`${wedge.side}-${dressed}`} className={classNames('wedge', sideOf[wedge.side], wedge.side)}
            style={{'--explode-x': `${dx}px`, '--explode-y': `${dy}px`}}>
            <g className={classNames(dressed, dressed === 'wall' ? 'side-wall' : 'side-face')} transform={`translate(${SIZE / 2} ${SIZE / 2 + lowered})`}>
              <g className="spin" style={{'--turn': `${pieShapes.degrees(wedge.from)}deg`}}>
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
        {cut.map((wedge, seat) =>
          <li key={wedge.side} className={classNames(sideOf[wedge.side], 'side-ink', wedge.side)}>
            <data value={wedge.share}>{`${percents[seat]}% ${wedge.side}`}</data>
          </li>)}
      </ul>
      <figcaption className="chart-caption caption">
        {has(cut)
          ? `volume by side · up to the last ${liveTrades.cap.toLocaleString('en-US')} trades`
          : 'waiting for the first trade'}
      </figcaption>
    </figure>
    <Explainer>
      Up to the last {liveTrades.cap.toLocaleString('en-US')} trades, as one circle, split by who came and took each
      trade. The green wedge is the size buyers took from waiting sellers. The orange wedge is the size sellers took
      from waiting buyers. The fetched past doesn’t say who took each trade, so the pie starts empty and counts only the
      trades that arrive while the page is open.
    </Explainer>
  </section>;
};
