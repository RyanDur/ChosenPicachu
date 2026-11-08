import {Explainer} from '@components/Explainer';
import {FC, ReactNode, useId} from 'react';
import {notEmpty} from '@ryandur/sand';
import {liveTrades, money, Trade} from '../../Market';
import {Axes, axisRange} from '../Axes';
import {pressureShapes} from './pressure-shapes';
import '../chart-card.css';
import './Pressure.css';

const CHART_WIDTH = 240;
const CHART_HEIGHT = 104;
const BUCKET_MILLISECONDS = 60000;
const MOST_BUCKETS_SHOWN = 60;
const TICK_EVERY_MILLISECONDS = 600000;
const DEPTH_X = 1;
const DEPTH_Y = 1.5;

type Props = {
  trades: readonly Trade[];
  actions?: ReactNode;
};

export const Pressure: FC<Props> = ({trades, actions}) => {
  const heading = `heading${useId()}`;
  const pressures = pressureShapes.buckets(trades, BUCKET_MILLISECONDS).slice(-MOST_BUCKETS_SHOWN);
  const bars = pressureShapes.drawn(pressures, CHART_WIDTH, CHART_HEIGHT, BUCKET_MILLISECONDS);
  const peak = pressureShapes.heaviestSide(pressures);
  return <section aria-labelledby={heading} className="pressure chart card rounded-corners lifted padded">
    <h3 id={heading} className="off-screen">pressure</h3>
    <header className="chart-header">
      {actions}
    </header>
    <figure className="chart-stage paper-veiled-before">
      <Axes extent={axisRange.of(pressures.map(pressure => pressure.openedAt), peak, -peak)} label={money.bitcoin}
        pattern="HH:mm"
        tickEvery={TICK_EVERY_MILLISECONDS}
        headroomMilliseconds={2 * BUCKET_MILLISECONDS}>
        <svg className="pressures" aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
          <line className="midline drawn" x1={0} y1={CHART_HEIGHT / 2} x2={CHART_WIDTH} y2={CHART_HEIGHT / 2}/>
          {pressures.map((pressure, at) => <g key={pressure.openedAt}>
            <rect className="bought-wall buy-side side-wall" y={-1} width={1} height={1} style={{
              '--shape-x': `${bars[at].x + DEPTH_X}px`,
              '--shape-base': `${bars[at].boughtTop + bars[at].boughtHeight + DEPTH_Y}px`,
              '--shape-width': bars[at].width,
              '--shape-height': bars[at].boughtHeight
            }}/>
            <rect className="sold-wall sell-side side-wall" y={-1} width={1} height={1} style={{
              '--shape-x': `${bars[at].x + DEPTH_X}px`,
              '--shape-base': `${bars[at].soldTop + bars[at].soldHeight + DEPTH_Y}px`,
              '--shape-width': bars[at].width,
              '--shape-height': bars[at].soldHeight
            }}/>
            <rect className="bought buy-side side-face" y={-1} width={1} height={1} style={{
              '--shape-x': `${bars[at].x}px`,
              '--shape-base': `${bars[at].boughtTop + bars[at].boughtHeight}px`,
              '--shape-width': bars[at].width,
              '--shape-height': bars[at].boughtHeight
            }}/>
            <rect className="sold sell-side side-face" y={-1} width={1} height={1} style={{
              '--shape-x': `${bars[at].x}px`,
              '--shape-base': `${bars[at].soldTop + bars[at].soldHeight}px`,
              '--shape-width': bars[at].width,
              '--shape-height': bars[at].soldHeight
            }}/>
          </g>)}
        </svg>
      </Axes>
      <figcaption className="chart-caption caption">
        {notEmpty(pressures)
          ? `${pressures.length} ${pressures.length === 1 ? 'minute' : 'minutes'} · up to the last ${liveTrades.cap.toLocaleString('en-US')} trades`
          : 'waiting for the first trade'}
      </figcaption>
    </figure>
    <Explainer>
      Every trade has two orders: one that was waiting, and one that came and took it. When the one that came was a
      buyer, the trade counts as bought. When it was a seller, it counts as sold. Each bar is one minute. Bought size
      rises above the line and sold size falls below it, both on the same scale, so the taller side is the side that
      was pushing. The fetched past doesn’t say who took each trade, so this chart counts only the trades that arrive
      while the page is open.
    </Explainer>
  </section>;
};
