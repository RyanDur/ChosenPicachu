import {Entry, Item, Menu} from '@components/Menu';
import {Explainer} from '@components/Explainer';
import {FC, ReactNode, useId} from 'react';
import {Maybe, maybe, notEmpty} from '@ryandur/sand';
import {Loading} from '@components/Loading';
import {classNames} from '@components';
import {Candle, candles, LiveTradesState, money, Period, periodHistory, periods, Trade} from '../../Market';
import {chartCaption} from '../chart-caption';
import {usePeriodCandles} from '../usePeriodCandles';
import {periodDisplay} from '../period-display';
import {sparkline, TimedPrice} from '../sparkline';
import {Axes, range} from '../Axes';
import '../chart-card.css';
import './PriceChart.css';
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
  const series = candles.map(candle => ({at: candle.openedAt, price: candle.close}));
  const [opening] = series;
  return maybe(opening).map(({price: first}) => ({
    series,
    high: Math.max(...candles.map(candle => candle.high)),
    low: Math.min(...candles.map(candle => candle.low)),
    first,
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
  const generated = useId();
  const id = given ?? `price${generated}`;
  const history = usePeriodCandles(period);
  const bucketMilliseconds = periods.bucketMilliseconds[period];
  const shownCandles = candles.mergeLive(
    periodHistory.candlesOf(history),
    candles.bucketTrades(trades, bucketMilliseconds),
    periods.candleCap[period]
  );
  const view = viewOf(shownCandles, trades[trades.length - 1]);
  const points =
    sparkline.points(view.map(({series}) => series).orElse([]), CHART_WIDTH, CHART_HEIGHT, 2 * bucketMilliseconds);
  const line = points.map(point => `${point.x},${point.y}`).join(' ');
  const trending = view.map(trendOf);
  const trend = trending.orElse(undefined);
  const side = trending.map(direction => sideOf[direction]).orElse(undefined);
  return <section aria-labelledby={`${id}-heading`}
    className={classNames('price-chart chart card rounded-corners lifted padded', side, trend)}>
    <h3 id={`${id}-heading`} className="off-screen">live trades</h3>
    <header className="chart-header">
      {actions}
      <button type="button" className="period-toggle rounded-corners field borderless attentive focus-ringed caption reachable"
        popoverTarget={`${id}-period`}>
        <span className="off-screen">price period</span>{' '}{period}
      </button>
      <Menu id={`${id}-period`} tabIndex={-1} popover="auto" className="card rounded-corners lifted"
        aria-label="price period by">
        {Object.values(Period).map(option =>
          <Entry key={option}>
            <Item className="sub-title"
              popoverTarget={`${id}-period`} popoverTargetAction="hide"
              aria-current={option === period ? 'true' : undefined}
              onClick={() => onPeriodChosen(option)}>{option}</Item>
          </Entry>
        )}
      </Menu>
    </header>
    <figure className="chart-stage paper-veiled-before">
      <Axes range={view.mBind(({series, high, low}) => range.of(series.map(timed => timed.at), high, low))}
        pattern={periodDisplay.timePattern[period]} tickEvery={periodDisplay.tickEveryMilliseconds[period]}
        headroomMilliseconds={2 * bucketMilliseconds}>
        <svg className="sparkline" aria-hidden="true"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="none">
          {notEmpty(points) && <line className="baseline drawn"
            x1={0} y1={points[0].y}
            x2={CHART_WIDTH} y2={points[0].y}/>}
          <polyline className="trend side-line line-shadowed" points={line} fill="none" vectorEffect="non-scaling-stroke"/>
          {notEmpty(points) && <circle className="marker side-dot" r={3}
            style={{translate: `${points[points.length - 1].x}px ${points[points.length - 1].y}px`}}/>}
        </svg>
      </Axes>
      <p className="headline monospaced">{view.map(({first, last}) => <>
        <data className="title bold ink" value={last}>{money.cents.format(last)}</data>
        <data className="side-ink" value={last - first}>{money.deltaLabel(first, last)}</data>
      </>).orNull()}</p>
      {history.state === 'loading' && <Loading className="chart-loading"/>}
      <figcaption className="chart-caption caption">{chartCaption.of(history, shownCandles.length, period)}</figcaption>
    </figure>
    <Explainer>
      This measures the price of one bitcoin in US dollars, live. The line is the closing price of each bucket in the
      period: the fetched past fills the left, and new trades fold into the newest bucket as they happen. The dotted
      line marks the first price in the period, the close of its first candle, and the color shows the trend against it.
      High and low mark the period’s range; the headline is the latest price paid and how far it has moved. The
      period menu sets how much time the chart covers. Every period stays live.
    </Explainer>
  </section>;
};
