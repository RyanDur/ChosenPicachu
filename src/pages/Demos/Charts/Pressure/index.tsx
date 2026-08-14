import {FC, ReactNode} from 'react';
import {notEmpty} from '@ryandur/sand';
import {Trade} from '../coinbase';
import {bitcoin} from '../money';
import {Axes} from '../Axes';
import {bucketPressure, heaviestSide, pressureShapes} from './shapes';
import '../chart-card.css';
import './Pressure.css';

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
  const pressures = bucketPressure(trades, BUCKET_MS).slice(-WINDOW_CAP);
  const bars = pressureShapes(pressures, CHART_WIDTH, CHART_HEIGHT, BUCKET_MS);
  const peak = heaviestSide(pressures);
  return <section aria-label="pressure" className="pressure chart paper rounded-corners drop-shadow padded">
    <header className="chart-header">
      {actions}
    </header>
    <section className="chart-stage">
      <Axes high={peak} low={-peak} label={bitcoin}
            times={pressures.map(pressure => pressure.openedAt)}
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
      <small className="caption">
        {notEmpty(pressures)
          ? `${pressures.length} ${pressures.length === 1 ? 'window' : 'windows'} · 1m each · since you arrived`
          : 'waiting for the first trade'}
      </small>
    </section>
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        Every trade takes a side: a buyer lifted the ask, or a seller hit the bid. Each
        bar bundles one minute — bought size rises above the line, sold size falls below,
        both on the same scale, so the taller side is the side in charge. History does
        not say who started each trade, so this card counts only what streams in while
        you watch.
      </p>
    </details>
  </section>;
};
