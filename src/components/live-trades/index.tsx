import {FC, useState} from 'react';
import {notEmpty} from '@ryandur/sand';
import {Menu} from '@components/Menu';
import {LiveTradesState} from './useLiveTrades';
import {usePeriodCandles} from './usePeriodCandles';
import {ChartWindow, isRange, Period, windowBucketLabel, windowPattern, windowTickEvery} from './period';
import {RangePicker} from './RangePicker';
import {sparklinePoints, TimedPrice} from './sparkline';
import {Axes} from './Axes';
import {bucketTrades, Candle, mergeLive} from './Candles/shapes';
import './chart-card.css';
import './LiveTrades.css';

const statusCopy: Record<LiveTradesState['status'], string> = {
  connecting: 'connecting to the live feed…',
  streaming: 'live',
  failed: 'live feed unavailable'
};

const CHART_WIDTH = 240;
const CHART_HEIGHT = 60;

const cents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const deltaLabel = (first: number, last: number): string =>
  `${last < first ? '-' : '+'}${cents.format(Math.abs(last - first))}`;

type PriceView = {
  series: readonly TimedPrice[];
  high: number;
  low: number;
  first: number;
  last: number;
  caption: string;
};

const emptyView: PriceView = {series: [], high: 0, low: 0, first: 0, last: 0, caption: ''};

const candlesView = (candles: readonly Candle[], bucket: string): PriceView => ({
  series: candles.map(candle => ({at: candle.openedAt, price: candle.close})),
  high: Math.max(...candles.map(candle => candle.high)),
  low: Math.min(...candles.map(candle => candle.low)),
  first: candles[0]?.open ?? 0,
  last: candles[candles.length - 1]?.close ?? 0,
  caption: `${candles.length} candles · ${bucket}`
});

type Props = LiveTradesState & {
  seed: readonly Candle[];
};

export const LiveTrades: FC<Props> = ({status, trades, seed}) => {
  const [chartWindow, setChartWindow] = useState<ChartWindow>(Period.live);
  const history = usePeriodCandles(chartWindow);
  const live = chartWindow === Period.live;
  const candles = live
    ? mergeLive(seed, bucketTrades(trades, 60000))
    : history.candles;
  const showing = candles.length > 0;
  const windowed = candlesView(candles, windowBucketLabel(chartWindow));
  const lastTrade = trades[trades.length - 1];
  const view = showing
    ? {...windowed, last: live && lastTrade !== undefined ? lastTrade.price : windowed.last}
    : emptyView;
  const points = sparklinePoints(view.series, CHART_WIDTH, CHART_HEIGHT);
  const line = points.map(point => `${point.x},${point.y}`).join(' ');
  const trend = showing && view.last >= view.first ? 'rising' : 'falling';
  return <section aria-label="live trades" className="card chart live-trades" data-trend={trend}>
    <header>
      {live && <output data-status={status}>{statusCopy[status]}</output>}
      <RangePicker idPrefix="price" value={isRange(chartWindow) ? chartWindow : null} onPick={setChartWindow}/>
      <Menu id="price-period" label="price period"
            toggle={isRange(chartWindow) ? 'range' : chartWindow} toggleClassName="period-toggle">
        {Object.values(Period).map(option =>
          <button type="button" key={option} className="item"
                  onClick={() => setChartWindow(option)}>{option}</button>
        )}
      </Menu>
    </header>
    <figure>
      <Axes high={view.high} low={view.low} times={view.series.map(timed => timed.at)} pattern={windowPattern(chartWindow)}
            tickEvery={windowTickEvery(chartWindow)}>
        <svg aria-hidden="true"
             viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
             preserveAspectRatio="none">
          {notEmpty(points) && <line className="baseline"
                                     x1={0} y1={points[0].y}
                                     x2={CHART_WIDTH} y2={points[0].y}/>}
          <polyline points={line} fill="none" vectorEffect="non-scaling-stroke"/>
          {notEmpty(points) && <circle cx={points[points.length - 1].x}
                                       cy={points[points.length - 1].y}
                                       r={3}/>}
        </svg>
      </Axes>
      {showing && <figcaption>
        <small className="span">{view.caption}</small>
      </figcaption>}
      {history.unavailable && !live && <figcaption>
        <small className="span">history unavailable</small>
      </figcaption>}
    </figure>
    {showing && <p className="headline">
      <data value={view.last}>{cents.format(view.last)}</data>
      <data className="delta" value={view.last - view.first}>{deltaLabel(view.first, view.last)}</data>
    </p>}
    <details>
      <summary>what am I looking at?</summary>
      <p>
        This measures the price of one bitcoin in US dollars. Each point is one
        live trade — someone paid that price — newest at the right. The dotted
        line marks the first price in the window and the color shows the trend
        against it. High and low mark the window&apos;s range; the headline is
        the latest price paid and how far it has moved. The period menu swaps
        the live window for Coinbase&apos;s history.
      </p>
    </details>
  </section>;
};
