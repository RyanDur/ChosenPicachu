import {useEffect, useState} from 'react';
import {useEnv} from '@components/Env';
import {Candle} from './Candles/shapes';
import {periodCandles} from './history';

const HOUR_MS = 3600000;

const lastHourQuery = (): string => {
  const now = new Date();
  return `granularity=60&start=${encodeURIComponent(new Date(now.getTime() - HOUR_MS).toISOString())}` +
    `&end=${encodeURIComponent(now.toISOString())}`;
};

export const useLiveSeed = (): readonly Candle[] => {
  const {tradeHistory, tradeProduct} = useEnv();
  const [seed, setSeed] = useState<readonly Candle[]>([]);

  useEffect(() => {
    const fetching = periodCandles(tradeHistory, tradeProduct, lastHourQuery())
      .onSuccess(setSeed)
      .onFailure(() => setSeed([]));
    return () => fetching.cancel();
  }, [tradeHistory, tradeProduct]);

  return seed;
};
