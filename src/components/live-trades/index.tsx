import {FC} from 'react';
import {notEmpty} from '@ryandur/sand';
import {LiveTradesState} from './useLiveTrades';
import {sparklinePoints} from './sparkline';
import './LiveTrades.css';

const statusCopy: Record<LiveTradesState['status'], string> = {
  connecting: 'connecting to the live feed…',
  streaming: 'live',
  failed: 'live feed unavailable'
};

const CHART_WIDTH = 240;
const CHART_HEIGHT = 60;
const SHOWN_TRADES = 3;

const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const spanLabel = (from: number, to: number): string => {
  const seconds = Math.round((to - from) / 1000);
  return seconds < 60 ? `${seconds}s` : `${Math.round(seconds / 60)}m`;
};

export const LiveTrades: FC<LiveTradesState> = ({status, trades}) => {
  const prices = trades.map(trade => trade.price);
  const points = sparklinePoints(prices, CHART_WIDTH, CHART_HEIGHT);
  const line = points.map(point => `${point.x},${point.y}`).join(' ');
  const first = trades[0];
  const last = trades[trades.length - 1];
  const trend = notEmpty(trades) && last.price >= first.price ? 'rising' : 'falling';
  return <section aria-label="live trades" className="card live-trades" data-trend={trend}>
    <output data-status={status}>{statusCopy[status]}</output>
    <figure>
      <svg aria-hidden="true"
           viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
           preserveAspectRatio="none">
        {notEmpty(points) && <line className="baseline"
                                   x1={0} y1={points[0].y}
                                   x2={CHART_WIDTH} y2={points[0].y}/>}
        {notEmpty(line) && <polygon points={`0,${CHART_HEIGHT} ${line} ${CHART_WIDTH},${CHART_HEIGHT}`}/>}
        <polyline points={line} fill="none" vectorEffect="non-scaling-stroke"/>
        {notEmpty(points) && <circle cx={points[points.length - 1].x}
                                     cy={points[points.length - 1].y}
                                     r={3}/>}
      </svg>
      {notEmpty(trades) && <figcaption>
        <small className="high">{`high ${dollars.format(Math.max(...prices))}`}</small>
        <small className="low">{`low ${dollars.format(Math.min(...prices))}`}</small>
        <small className="span">{`${trades.length} trades · ${spanLabel(first.tradedAt, last.tradedAt)}`}</small>
      </figcaption>}
    </figure>
    <ul>{trades.slice(-SHOWN_TRADES).map(trade =>
      <li key={trade.id}>{trade.price}</li>
    )}</ul>
  </section>;
};
