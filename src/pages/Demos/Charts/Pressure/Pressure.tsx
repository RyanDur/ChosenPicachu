import {FC, ReactNode, useContext, useId} from 'react';
import {notEmpty} from '@ryandur/sand';
import {Trade} from '../coinbase';
import {bitcoin} from '../money';
import {Axes, rangeOf} from '../Axes';
import {bucketPressure, heaviestSide, pressureShapes} from './shapes';
import '../chart-card.css';
import './Pressure.css';
import {ChartHeading} from '../heading';

const CHART_WIDTH = 240;
const CHART_HEIGHT = 104;
const BUCKET_MS = 60000;
const WINDOW_CAP = 60;
const TICK_EVERY_MS = 600000;
const DEPTH_X = 1;
const DEPTH_Y = 1.5;

type Props = {
  trades: readonly Trade[];
  actions?: ReactNode;
};

export const Pressure: FC<Props> = ({trades, actions}) => {
  const Heading = useContext(ChartHeading);
  const heading = `heading${useId()}`;
  const pressures = bucketPressure(trades, BUCKET_MS).slice(-WINDOW_CAP);
  const bars = pressureShapes(pressures, CHART_WIDTH, CHART_HEIGHT, BUCKET_MS);
  const peak = heaviestSide(pressures);
  return <section aria-labelledby={heading} className="pressure chart card rounded-corners lifted padded">
    <Heading id={heading} className="off-screen">pressure</Heading>
    <header className="chart-header">
      {actions}
    </header>
    <figure className="chart-stage">
      <Axes range={rangeOf(pressures.map(pressure => pressure.openedAt), peak, -peak)} label={bitcoin}
        pattern="HH:mm"
        tickEvery={TICK_EVERY_MS}
        headroomMs={2 * BUCKET_MS}>
        <svg className="pressures" aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
          <line className="midline" x1={0} y1={CHART_HEIGHT / 2} x2={CHART_WIDTH} y2={CHART_HEIGHT / 2}/>
          {pressures.map((pressure, at) => <g key={pressure.openedAt}>
            <rect className="bought-wall" x={bars[at].x + DEPTH_X} y={bars[at].boughtTop + DEPTH_Y}
              width={bars[at].width} height={bars[at].boughtHeight}/>
            <rect className="sold-wall" x={bars[at].x + DEPTH_X} y={bars[at].soldTop + DEPTH_Y}
              width={bars[at].width} height={bars[at].soldHeight}/>
            <rect className="bought" x={bars[at].x} y={bars[at].boughtTop}
              width={bars[at].width} height={bars[at].boughtHeight}/>
            <rect className="sold" x={bars[at].x} y={bars[at].soldTop}
              width={bars[at].width} height={bars[at].soldHeight}/>
          </g>)}
        </svg>
      </Axes>
      <figcaption className="chart-caption caption">
        {notEmpty(pressures)
          ? `${pressures.length} ${pressures.length === 1 ? 'window' : 'windows'} · 1m each · since you arrived`
          : 'waiting for the first trade'}
      </figcaption>
    </figure>
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        Every trade has two orders: one that was waiting, and one that came and took it. When the one that came was a
        buyer, the trade counts as bought. When it was a seller, it counts as sold. Each bar is one minute. Bought size
        rises above the line and sold size falls below it, both on the same scale, so the taller side is the side that
        was pushing. The fetched past doesn’t say who took each trade, so this chart counts only the trades that arrive
        while you watch.
      </p>
    </details>
  </section>;
};
