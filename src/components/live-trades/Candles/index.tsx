import {FC, useState} from 'react';
import {notEmpty} from '@ryandur/sand';
import {Menu} from '@components/Menu';
import {Trade} from '@transport/coinbase';
import {bucketTrades, candleShapes, volumeShapes} from './shapes';
import {usePeriodCandles} from '../usePeriodCandles';
import {ChartWindow, isRange, Period, windowBucketLabel, windowPattern, windowTickEvery} from '../period';
import {RangePicker} from '../RangePicker';
import {Axes} from '../Axes';
import '../chart-card.css';
import './Candles.css';

const CHART_WIDTH = 240;
const CANDLE_HEIGHT = 80;
const VOLUME_HEIGHT = 24;
const BUCKET_MS = 5000;

type Props = {
  trades: readonly Trade[];
};

const captionFor = (chartWindow: ChartWindow, count: number): string =>
  `${count} candles · ${windowBucketLabel(chartWindow)}`;

export const Candles: FC<Props> = ({trades}) => {
  const [chartWindow, setChartWindow] = useState<ChartWindow>(Period.live);
  const history = usePeriodCandles(chartWindow);
  const candles = chartWindow === Period.live ? bucketTrades(trades, BUCKET_MS) : history.candles;
  const bodies = candleShapes(candles, CHART_WIDTH, CANDLE_HEIGHT);
  const bars = volumeShapes(candles, CHART_WIDTH, VOLUME_HEIGHT);
  return <section aria-label="candles" className="card chart candles">
    <header>
      <RangePicker value={isRange(chartWindow) ? chartWindow : null} onPick={setChartWindow}/>
      <Menu id="candle-period" label="candle period"
            toggle={isRange(chartWindow) ? 'range' : chartWindow} toggleClassName="period-toggle">
        {Object.values(Period).map(option =>
          <button type="button" key={option} className="item"
                  onClick={() => setChartWindow(option)}>{option}</button>
        )}
      </Menu>
    </header>
    <Axes high={notEmpty(candles) ? Math.max(...candles.map(candle => candle.high)) : 0}
          low={notEmpty(candles) ? Math.min(...candles.map(candle => candle.low)) : 0}
          times={candles.map(candle => candle.openedAt)}
          pattern={windowPattern(chartWindow)}
          tickEvery={windowTickEvery(chartWindow)}>
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
    </Axes>
    {notEmpty(candles) && <small>{captionFor(chartWindow, candles.length)}</small>}
    {history.unavailable && <small>history unavailable</small>}
    <details>
      <summary>what am I looking at?</summary>
      <p>
        The same measurement, bundled: each candle summarizes 5 seconds of trades —
        the body spans the first to the last price (green when it rose, orange when
        it fell) and the wicks reach the extremes. The bars beneath show how much
        bitcoin changed hands in each bundle. The period menu swaps the live window
        for Coinbase&apos;s history.
      </p>
    </details>
  </section>;
};
