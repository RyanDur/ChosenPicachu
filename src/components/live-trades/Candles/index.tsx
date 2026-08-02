import {FC} from 'react';
import {notEmpty} from '@ryandur/sand';
import {Trade} from '@transport/coinbase';
import {bucketTrades, candleShapes, volumeShapes} from './shapes';
import './Candles.css';

const CHART_WIDTH = 240;
const CANDLE_HEIGHT = 80;
const VOLUME_HEIGHT = 24;
const BUCKET_MS = 5000;

type Props = {
  trades: readonly Trade[];
};

export const Candles: FC<Props> = ({trades}) => {
  const candles = bucketTrades(trades, BUCKET_MS);
  const bodies = candleShapes(candles, CHART_WIDTH, CANDLE_HEIGHT);
  const bars = volumeShapes(candles, CHART_WIDTH, VOLUME_HEIGHT);
  return <section aria-label="candles" className="card candles">
    <svg aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${CANDLE_HEIGHT}`}>
      {bodies.map(shape => <g key={shape.x} className={shape.direction}>
        <line x1={shape.center} y1={shape.wickTop} x2={shape.center} y2={shape.wickBottom}/>
        <rect className="body" x={shape.x} y={shape.bodyTop}
              width={shape.width} height={shape.bodyHeight}/>
      </g>)}
    </svg>
    <svg aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${VOLUME_HEIGHT}`}>
      {bars.map(shape =>
        <rect className="volume" key={shape.x} x={shape.x} y={shape.top}
              width={shape.width} height={shape.height}/>
      )}
    </svg>
    {notEmpty(candles) && <small>{`${candles.length} candles · 5s each`}</small>}
    <details>
      <summary>what am I looking at?</summary>
      <p>
        Each candle bundles 5 seconds of trades: the body spans open to close
        (green when rising, orange when falling) and the wicks reach the high and low.
        The bars beneath show how much was traded in each bundle.
      </p>
    </details>
  </section>;
};
