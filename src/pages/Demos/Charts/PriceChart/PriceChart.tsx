import {FC, ReactNode} from 'react';
import {has, notEmpty} from '@ryandur/sand';
import {Loading} from '@components/Loading';
import {classNames} from '@components/class-names';
import {LiveTradesState} from '../live-trades';
import {cents, deltaLabel} from '../money';
import {candlesOf, captionFor} from '../period-history';
import {usePeriodCandles} from '../usePeriodCandles';
import {bucketMs, Period, periodCap, tickEveryMs, timePattern} from '../period';
import {sparklinePoints, TimedPrice} from '../sparkline';
import {Axes} from '../Axes';
import {bucketTrades, Candle, mergeLive} from '../Candles/shapes';
import '../chart-card.css';
import './PriceChart.css';

const CHART_WIDTH = 240;
const CHART_HEIGHT = 60;

type PriceView = {
  series: readonly TimedPrice[];
  high: number;
  low: number;
  first: number;
  last: number;
};

const emptyView: PriceView = {series: [], high: 0, low: 0, first: 0, last: 0};

const candlesView = (candles: readonly Candle[]): PriceView => ({
  series: candles.map(candle => ({at: candle.openedAt, price: candle.close})),
  high: Math.max(...candles.map(candle => candle.high)),
  low: Math.min(...candles.map(candle => candle.low)),
  first: candles[0]?.open ?? 0,
  last: candles[candles.length - 1]?.close ?? 0
});

const trendOf = ({first, last}: PriceView): 'rising' | 'falling' => last >= first ? 'rising' : 'falling';

type Props = Pick<LiveTradesState, 'trades'> & {
  id?: string;
  actions?: ReactNode;
  period: Period;
  onPeriod: (period: Period) => void;
};

export const PriceChart: FC<Props> = ({trades, id = 'price', actions, period, onPeriod}) => {
  const history = usePeriodCandles(period);
  const candles = mergeLive(candlesOf(history), bucketTrades(trades, bucketMs[period]), periodCap[period]);
  const showing = candles.length > 0;
  const windowed = candlesView(candles);
  const lastTrade = trades[trades.length - 1];
  const view = showing
    ? {...windowed, last: has(lastTrade) ? lastTrade.price : windowed.last}
    : emptyView;
  const points = sparklinePoints(view.series, CHART_WIDTH, CHART_HEIGHT, 2 * bucketMs[period]);
  const line = points.map(point => `${point.x},${point.y}`).join(' ');
  const trend = showing && trendOf(view);
  return <section aria-labelledby={`${id}-heading`}
    className={classNames('price-chart chart card rounded-corners lifted padded', trend)}>
    <h3 id={`${id}-heading`} className="off-screen">live trades</h3>
    <header className="chart-header">
      {actions}
      <button type="button" className="menu-toggle rounded-corners period-toggle field caption"
        popoverTarget={`${id}-period`}>
        <span className="off-screen">price period</span>{' '}{period}
      </button>
      <menu id={`${id}-period`} tabIndex={-1} popover="auto" className="menu card rounded-corners lifted"
        aria-label="price period by">
        {Object.values(Period).map(option =>
          <li className="entry" key={option}>
            <button type="button" className="item sub-title"
              popoverTarget={`${id}-period`} popoverTargetAction="hide"
              aria-current={option === period ? 'true' : undefined}
              onClick={() => onPeriod(option)}>{option}</button>
          </li>
        )}
      </menu>
    </header>
    <figure className="chart-stage">
      <Axes high={view.high} low={view.low} times={view.series.map(timed => timed.at)}
        pattern={timePattern[period]} tickEvery={tickEveryMs[period]}
        headroomMs={2 * bucketMs[period]}>
        <svg className="sparkline" aria-hidden="true"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="none">
          {notEmpty(points) && <line className="baseline"
            x1={0} y1={points[0].y}
            x2={CHART_WIDTH} y2={points[0].y}/>}
          <polyline className="trend" points={line} fill="none" vectorEffect="non-scaling-stroke"/>
          {notEmpty(points) && <circle className="marker"
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={3}/>}
        </svg>
      </Axes>
      {showing && <p className="headline">
        <data className="price" value={view.last}>{cents.format(view.last)}</data>
        <data className="delta" value={view.last - view.first}>{deltaLabel(view.first, view.last)}</data>
      </p>}
      {history.state === 'loading' && <Loading className="chart-loading"/>}
      <figcaption className="chart-caption caption">{captionFor(history, candles.length, period)}</figcaption>
    </figure>
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        This measures the price of one bitcoin in US dollars, live. The line is
        the closing price of each bucket in the window, seeded from Coinbase&apos;s
        history, with new trades folding into the newest bucket as they happen.
        The dotted line marks the first price in the window and the color shows
        the trend against it. High and low mark the window&apos;s range; the
        headline is the latest price paid and how far it has moved. The period
        menu resizes the window — every size stays live.
      </p>
    </details>
  </section>;
};
