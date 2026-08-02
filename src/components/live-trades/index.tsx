import {FC} from 'react';
import {useEnv} from '@components/Env';
import {LiveTradesState, useLiveTrades} from './useLiveTrades';
import {sparklinePath} from './sparkline';

const statusCopy: Record<LiveTradesState['status'], string> = {
  connecting: 'connecting to the live feed…',
  streaming: 'live',
  failed: 'live feed unavailable'
};

const CHART_WIDTH = 240;
const CHART_HEIGHT = 60;
const SHOWN_TRADES = 3;

export const LiveTrades: FC = () => {
  const {tradeFeed} = useEnv();
  const {status, trades} = useLiveTrades(tradeFeed);
  return <section aria-label="live trades">
    <output>{statusCopy[status]}</output>
    <svg role="img"
         aria-label="price trend"
         viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
         preserveAspectRatio="none">
      <polyline points={sparklinePath(trades.map(trade => trade.price), CHART_WIDTH, CHART_HEIGHT)}
                fill="none"
                stroke="currentColor"/>
    </svg>
    <ul>{trades.slice(-SHOWN_TRADES).map(trade =>
      <li key={trade.id}>{trade.price}</li>
    )}</ul>
  </section>;
};
