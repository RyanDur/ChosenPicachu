import {FC, useState, ReactNode} from 'react';
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
const DEPTH_X = 1;
const DEPTH_Y = 1.5;

type Props = {
  trades: readonly Trade[];
  id?: string;
  actions?: ReactNode;
};

const captionFor = (period: Period, count: number): string =>
  `${count} candles · ${bucketLabel[period]}`;

export const Candles: FC<Props> = ({trades, id = 'candle', actions}) => {
  const [period, setPeriod] = useState<Period>(Period.hour);
  const history = usePeriodCandles(period);
  const candles = mergeLive(history.candles, bucketTrades(trades, bucketMs[period]), periodCap[period]);
  const bodies = candleShapes(candles, CHART_WIDTH, CANDLE_HEIGHT, bucketMs[period]);
  const bars = volumeShapes(candles, CHART_WIDTH, VOLUME_HEIGHT, bucketMs[period]);
  return <section aria-label="candles" className="candles chart white rounded-corners lifted padded">
    <header className="chart-header">
      {actions}
      <Menu id={`${id}-period`} label="candle period" toggle={period} toggleClassName="period-toggle paper caption">
        {Object.values(Period).map(option =>
          <button type="button" key={option} className="item sub-title"
                  popoverTarget={`${id}-period`} popoverTargetAction="hide"
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
          {candles.map((candle, at) => <g key={candle.openedAt} className={bodies[at].direction}>
            <rect className="wall" x={bodies[at].x + DEPTH_X} y={bodies[at].bodyTop + DEPTH_Y}
                  width={bodies[at].width} height={bodies[at].bodyHeight}/>
            <line className="wick" x1={bodies[at].center} y1={bodies[at].wickTop}
                  x2={bodies[at].center} y2={bodies[at].wickBottom}/>
            <rect className="body" x={bodies[at].x} y={bodies[at].bodyTop}
                  width={bodies[at].width} height={bodies[at].bodyHeight}/>
          </g>)}
        </svg>
        <svg className="volumes" aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${VOLUME_HEIGHT}`}>
          {candles.map((candle, at) => <g key={candle.openedAt}>
            <rect className="volume-wall" x={bars[at].x + DEPTH_X} y={bars[at].top + DEPTH_Y}
                  width={bars[at].width} height={bars[at].height}/>
            <rect className="volume" x={bars[at].x} y={bars[at].top}
                  width={bars[at].width} height={bars[at].height}/>
          </g>)}
        </svg>
      </Axes>
      <small className="chart-caption caption">
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
