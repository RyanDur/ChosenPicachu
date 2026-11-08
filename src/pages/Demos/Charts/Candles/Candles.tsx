import {Entry, Item, Menu} from '@components/Menu';
import {Explainer} from '@components/Explainer';
import {FC, ReactNode, useId} from 'react';
import {candles, Period, periodHistory, periods, Trade} from '../../Market';
import {candleShapes} from './candle-shapes';
import {captionFor} from '../period-history';
import {usePeriodCandles} from '../usePeriodCandles';
import {Loading} from '@components/Loading';
import {periodDisplay} from '../period-display';
import {Axes, range} from '../Axes';
import '../chart-card.css';
import './Candles.css';
import {classNames} from '@components';
import {sideOf} from '../sides';

const CHART_WIDTH = 240;
const CANDLE_HEIGHT = 80;
const VOLUME_HEIGHT = 24;
const DEPTH_X = 1;
const DEPTH_Y = 1.5;

type Props = {
  trades: readonly Trade[];
  id?: string;
  actions?: ReactNode;
  period: Period;
  onPeriodChosen: (period: Period) => void;
};

export const Candles: FC<Props> = ({trades, id: given, actions, period, onPeriodChosen}) => {
  const generated = useId();
  const id = given ?? `candles${generated}`;
  const history = usePeriodCandles(period);
  const bucketMilliseconds = periods.bucketMilliseconds[period];
  const shownCandles = candles.mergeLive(
    periodHistory.candlesOf(history),
    candles.bucketTrades(trades, bucketMilliseconds),
    periods.candleCap[period]
  );
  const bodies = candleShapes.drawn(shownCandles, CHART_WIDTH, CANDLE_HEIGHT, bucketMilliseconds);
  const bars = candleShapes.volumes(shownCandles, CHART_WIDTH, VOLUME_HEIGHT, bucketMilliseconds);
  const priceRange = range.of(
    shownCandles.map(candle => candle.openedAt),
    Math.max(...shownCandles.map(candle => candle.high)),
    Math.min(...shownCandles.map(candle => candle.low))
  );
  return <section aria-labelledby={`${id}-heading`} className="candles chart card rounded-corners lifted padded">
    <h3 id={`${id}-heading`} className="off-screen">candles</h3>
    <header className="chart-header">
      {actions}
      <button type="button" className="period-toggle rounded-corners field borderless attentive focus-ringed caption"
        popoverTarget={`${id}-period`}>
        <span className="off-screen">candle period</span>{' '}{period}
      </button>
      <Menu id={`${id}-period`} tabIndex={-1} popover="auto" className="card rounded-corners lifted"
        aria-label="candle period by">
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
      <Axes range={priceRange}
        pattern={periodDisplay.timePattern[period]}
        tickEvery={periodDisplay.tickEveryMilliseconds[period]}
        headroomMilliseconds={2 * bucketMilliseconds}>
        <svg className="candlesticks" aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${CANDLE_HEIGHT}`}>
          {shownCandles.map((candle, at) => <g key={candle.openedAt} className={classNames('candle', sideOf[bodies[at].direction], bodies[at].direction)}>
            <rect className="wall side-wall" y={-1} width={1} height={1} style={{
              '--shape-x': `${bodies[at].x + DEPTH_X}px`,
              '--shape-base': `${bodies[at].bodyTop + bodies[at].bodyHeight + DEPTH_Y}px`,
              '--shape-width': bodies[at].width,
              '--shape-height': bodies[at].bodyHeight
            }}/>
            <line className="wick drawn" y1={-1} y2={0} style={{
              '--shape-x': `${bodies[at].center}px`,
              '--shape-base': `${bodies[at].wickBottom}px`,
              '--shape-width': 1,
              '--shape-height': bodies[at].wickBottom - bodies[at].wickTop
            }}/>
            <rect className="body side-face" y={-1} width={1} height={1} style={{
              '--shape-x': `${bodies[at].x}px`,
              '--shape-base': `${bodies[at].bodyTop + bodies[at].bodyHeight}px`,
              '--shape-width': bodies[at].width,
              '--shape-height': bodies[at].bodyHeight
            }}/>
          </g>)}
        </svg>
        <svg className="volumes volume-side" aria-hidden="true" viewBox={`0 0 ${CHART_WIDTH} ${VOLUME_HEIGHT}`}>
          {shownCandles.map((candle, at) => <g key={candle.openedAt}>
            <rect className="volume-wall side-wall" y={-1} width={1} height={1} style={{
              '--shape-x': `${bars[at].x + DEPTH_X}px`,
              '--shape-base': `${bars[at].top + bars[at].height + DEPTH_Y}px`,
              '--shape-width': bars[at].width,
              '--shape-height': bars[at].height
            }}/>
            <rect className="volume side-face" y={-1} width={1} height={1} style={{
              '--shape-x': `${bars[at].x}px`,
              '--shape-base': `${bars[at].top + bars[at].height}px`,
              '--shape-width': bars[at].width,
              '--shape-height': bars[at].height
            }}/>
          </g>)}
        </svg>
      </Axes>
      {history.state === 'loading' && <Loading className="chart-loading"/>}
      <figcaption className="chart-caption caption">{captionFor(history, shownCandles.length, period)}</figcaption>
    </figure>
    <Explainer>
      The same measurement, grouped: each candle summarizes one bucket of time. The body runs from the first to the
      last price, green when it rose and orange when it fell. The wick runs from the bucket’s high to its low. The bars
      beneath show how much bitcoin changed hands in each bucket. New trades keep filling the newest
      candle; the period menu sets how much time the chart covers.
    </Explainer>
  </section>;
};
