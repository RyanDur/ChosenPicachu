import {FC, useState} from 'react';
import {notEmpty} from '@ryandur/sand';
import {Menu} from '@components/Menu';
import {Trade} from '../coinbase';
import {bucketTrades, candleShapes, mergeLive, volumeShapes} from './shapes';
import {usePeriodCandles} from '../usePeriodCandles';
import {Loading} from '@components/Loading';
import {bucketLabel, bucketMs, Period, periodCap, tickEveryMs, timePattern} from '../period';
import {Axes} from '../Axes';
import '../chart-card.css';
import './Candles.css';

const CHART_WIDTH = 240;
const CANDLE_HEIGHT = 80;
const VOLUME_HEIGHT = 24;

type Props = {
  trades: readonly Trade[];
};

const captionFor = (period: Period, count: number): string =>
  `${count} candles · ${bucketLabel[period]}`;

export const Candles: FC<Props> = ({trades}) => {
  const [period, setPeriod] = useState<Period>(Period.hour);
  const history = usePeriodCandles(period);
  const candles = mergeLive(history.candles, bucketTrades(trades, bucketMs[period]), periodCap[period]);
  const bodies = candleShapes(candles, CHART_WIDTH, CANDLE_HEIGHT, bucketMs[period]);
  const bars = volumeShapes(candles, CHART_WIDTH, VOLUME_HEIGHT, bucketMs[period]);
  return <section aria-label="candles" className="candles card chart">
    <header className="chart-header">
      <Menu id="candle-period" label="candle period" toggle={period} toggleClassName="period-toggle">
        {Object.values(Period).map(option =>
          <button type="button" key={option} className="item"
                  onClick={() => setPeriod(option)}>{option}</button>
        )}
      </Menu>
    </header>
    <section className="chart-stage">
      <Axes high={notEmpty(candles) ? Math.max(...candles.map(candle => candle.high)) : 0}
            low={notEmpty(candles) ? Math.min(...candles.map(candle => candle.low)) : 0}
            times={candles.map(candle => candle.openedAt)}
            pattern={timePattern[period]}
            tickEvery={tickEveryMs[period]}
            headroomMs={2 * bucketMs[period]}>
        <svg className="candlesticks" aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${CANDLE_HEIGHT}`}>
          {bodies.map(shape => <g key={shape.x} className={shape.direction}>
            <line className="wick" x1={shape.center} y1={shape.wickTop} x2={shape.center} y2={shape.wickBottom}/>
            <rect className="body" x={shape.x} y={shape.bodyTop}
                  width={shape.width} height={shape.bodyHeight}/>
          </g>)}
        </svg>
        <svg className="volumes" aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${VOLUME_HEIGHT}`}>
          {bars.map(shape =>
            <rect className="volume" key={shape.x} x={shape.x} y={shape.top}
                  width={shape.width} height={shape.height}/>
          )}
        </svg>
      </Axes>
      <small className="span">
        {notEmpty(candles) ? captionFor(period, candles.length) : history.unavailable && 'history unavailable'}
      </small>
      {history.pending && <Loading className="chart-loading"/>}
    </section>
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        The same measurement, bundled: each candle summarizes one bucket of trades —
        the body spans the first to the last price (green when it rose, orange when
        it fell) and the wicks reach the extremes. The bars beneath show how much
        bitcoin changed hands in each bundle. New trades keep filling the newest
        candle; the period menu resizes the window — every size stays live.
      </p>
    </details>
  </section>;
};
