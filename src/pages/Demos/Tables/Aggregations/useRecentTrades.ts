import {useEffect, useState} from 'react';
import {useEnv} from '@components/Env';
import {Trade} from '../../Charts/coinbase';
import {recentTrades} from './recent-trades';

export {hydrated} from './recent-trades';

export const useRecentTrades = (): readonly Trade[] => {
  const {tradeHistory, tradeProduct} = useEnv();
  const [history, setHistory] = useState<readonly Trade[]>([]);

  useEffect(() => {
    const fetching = recentTrades(tradeHistory, tradeProduct, setHistory);
    return () => fetching.cancel();
  }, [tradeHistory, tradeProduct]);

  return history;
};
