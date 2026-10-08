import {Explainer} from '@components/Explainer';
import {FC, ReactNode, useContext, useId} from 'react';
import {classNames} from '@components/class-names';
import {Trade} from '../coinbase';
import {degrees, explodedBy, sideTotals, slices, sweepGates} from './shapes';
import '../chart-card.css';
import './Pie.css';
import {ChartHeading} from '../heading';
import {sideOf} from '../sides';

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
  const Heading = useContext(ChartHeading);
  const heading = `heading${useId()}`;
  const totals = sideTotals(trades);
  const cut = slices([totals.bought, totals.sold]);
  return <section aria-labelledby={heading} className="pie chart card rounded-corners lifted padded">
    <Heading id={heading} className="off-screen">pie</Heading>
    <header className="chart-header">
      {actions}
    </header>
    <figure className="chart-stage paper-veiled-before">
      <svg className="split" aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE + DEPTH}`}>
        {['wall', 'face'].map(dressed => cut.map((slice, at) => {
          const {dx, dy} = slice.share === 1 ? {dx: 0, dy: 0} : explodedBy(slice, EXPLODE);
          const {opening, closing} = sweepGates(slice);
          const drop = dressed === 'wall' ? DEPTH : 0;
          return <g key={`${sides[at]}-${dressed}`} className={classNames('slice', sides[at], sideOf[sides[at]])}
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
      <p className="legend caption">
        {cut.map((slice, at) =>
          <data key={sides[at]} value={slice.share} className={classNames('share', sideOf[sides[at]], 'side-ink', sides[at])}>
            {`${Math.round(slice.share * 100)}% ${sides[at]}`}
          </data>)}
      </p>
      <figcaption className="chart-caption caption">
        {cut.length > 0
          ? 'the session’s volume by side · since you arrived'
          : 'waiting for the first trade'}
      </figcaption>
    </figure>
    <Explainer>
      Everything traded since you arrived, as one circle, split by who came and took each trade. The green slice is the
      size buyers took from waiting sellers. The orange slice is the size sellers took from waiting buyers. The fetched
      past doesn’t say who took each trade, so the pie starts empty and counts only the trades that arrive while you
      watch.
    </Explainer>
  </section>;
};
