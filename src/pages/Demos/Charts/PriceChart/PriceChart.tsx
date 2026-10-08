import {Explainer} from '@components/Explainer';
import {FC, ReactNode, useContext, useId} from 'react';
import {Maybe, maybe, notEmpty} from '@ryandur/sand';
import {Loading} from '@components/Loading';
import {classNames} from '@components/class-names';
import {Trade} from '../coinbase';
import {LiveTradesState} from '../live-trades';
import {cents, deltaLabel} from '../money';
import {candlesOf, captionFor} from '../period-history';
import {usePeriodCandles} from '../usePeriodCandles';
import {bucketMs, Period, periodCap, tickEveryMs, timePattern} from '../period';
import {sparklinePoints, TimedPrice} from '../sparkline';
import {Axes, rangeOf} from '../Axes';
import {bucketTrades, Candle, mergeLive} from '../Candles/shapes';
import '../chart-card.css';
import './PriceChart.css';
import {ChartHeading} from '../heading';
import {sideOf} from '../sides';

const CHART_WIDTH = 240;
const CHART_HEIGHT = 60;

type PriceView = {
  series: readonly TimedPrice[];
  high: number;
  low: number;
  first: number;
  last: number;
};

const viewOf = (candles: readonly Candle[], lastTrade?: Pick<Trade, 'price'>): Maybe<PriceView> => {
  const [opening] = candles;
  return maybe(opening).map(({open}) => ({
    series: candles.map(candle => ({at: candle.openedAt, price: candle.close})),
    high: Math.max(...candles.map(candle => candle.high)),
    low: Math.min(...candles.map(candle => candle.low)),
    first: open,
    last: maybe(lastTrade).map(({price}) => price).orElse(candles[candles.length - 1].close)
  }));
};

const trendOf = ({first, last}: PriceView): 'rising' | 'falling' => last >= first ? 'rising' : 'falling';

type Props = Pick<LiveTradesState, 'trades'> & {
  id?: string;
  actions?: ReactNode;
  period: Period;
  onPeriodChosen: (period: Period) => void;
};

export const PriceChart: FC<Props> = ({trades, id: given, actions, period, onPeriodChosen}) => {
  const Heading = useContext(ChartHeading);
  const generated = useId();
  const id = given ?? `price${generated}`;
  const history = usePeriodCandles(period);
  const candles = mergeLive(candlesOf(history), bucketTrades(trades, bucketMs[period]), periodCap[period]);
  const view = viewOf(candles, trades[trades.length - 1]);
  const points = sparklinePoints(view.map(({series}) => series).orElse([]), CHART_WIDTH, CHART_HEIGHT, 2 * bucketMs[period]);
  const line = points.map(point => `${point.x},${point.y}`).join(' ');
  const trending = view.map(trendOf);
  const trend = trending.orElse(undefined);
  const side = trending.map(direction => sideOf[direction]).orElse(undefined);
  return <section aria-labelledby={`${id}-heading`}
    className={classNames('price-chart chart card rounded-corners lifted padded', side, trend)}>
    <Heading id={`${id}-heading`} className="off-screen">live trades</Heading>
    <header className="chart-header">
      {actions}
      <button type="button" className="menu-toggle rounded-corners period-toggle field borderless attentive focus-ringed caption reachable"
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
              onClick={() => onPeriodChosen(option)}>{option}</button>
          </li>
        )}
      </menu>
    </header>
    <figure className="chart-stage paper-veiled-before">
      <Axes range={view.mBind(({series, high, low}) => rangeOf(series.map(timed => timed.at), high, low))}
        pattern={timePattern[period]} tickEvery={tickEveryMs[period]}
        headroomMs={2 * bucketMs[period]}>
        <svg className="sparkline" aria-hidden="true"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="none">
          {notEmpty(points) && <line className="baseline drawn"
            x1={0} y1={points[0].y}
            x2={CHART_WIDTH} y2={points[0].y}/>}
          <polyline className="trend side-line line-shadowed" points={line} fill="none" vectorEffect="non-scaling-stroke"/>
          {notEmpty(points) && <circle className="marker side-dot"
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={3}/>}
        </svg>
      </Axes>
      <p className="headline monospaced">{view.map(({first, last}) => <>
        <data className="title bold ink" value={last}>{cents.format(last)}</data>
        <data className="side-ink" value={last - first}>{deltaLabel(first, last)}</data>
      </>).orNull()}</p>
      {history.state === 'loading' && <Loading className="chart-loading"/>}
      <figcaption className="chart-caption caption">{captionFor(history, candles.length, period)}</figcaption>
    </figure>
    <Explainer>
      This measures the price of one bitcoin in US dollars, live. The line is
      the closing price of each bucket in the window, seeded from Coinbase&apos;s
      history, with new trades folding into the newest bucket as they happen.
      The dotted line marks the first price in the window and the color shows
      the trend against it. High and low mark the window&apos;s range; the
      headline is the latest price paid and how far it has moved. The period
      menu resizes the window — every size stays live.
    </Explainer>
  </section>;
};
