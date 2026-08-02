import {FC} from 'react';
import {useEnv} from '@components/Env';
import {LiveTradesState, useLiveTrades} from './useLiveTrades';

const statusCopy: Record<LiveTradesState['status'], string> = {
  connecting: 'connecting to the live feed…',
  streaming: 'live',
  failed: 'live feed unavailable'
};

export const LiveTrades: FC = () => {
  const {tradeFeed} = useEnv();
  const {status, trades} = useLiveTrades(tradeFeed);
  return <section aria-label="live trades">
    <output>{statusCopy[status]}</output>
    <ul>{trades.map(trade =>
      <li key={trade.id}>{trade.price}</li>
    )}</ul>
  </section>;
};
