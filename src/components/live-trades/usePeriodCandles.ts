import {useEffect, useState} from 'react';
import {useEnv} from '@components/Env';
import {Candle} from './Candles/shapes';
import {granularitySeconds, Period} from './period';
import {periodCandles} from './history';

export type PeriodHistory = {
  candles: readonly Candle[];
  unavailable: boolean;
};

const clean: PeriodHistory = {candles: [], unavailable: false};

export const usePeriodCandles = (period: Period): PeriodHistory => {
  const {tradeHistory, tradeProduct} = useEnv();
  const [history, setHistory] = useState<PeriodHistory>(clean);

  useEffect(() => {
    setHistory(clean);
    if (period === Period.live) {
      return;
    }
    const fetching = periodCandles(tradeHistory, tradeProduct, granularitySeconds[period])
      .onSuccess(candles => setHistory({candles, unavailable: false}))
      .onFailure(() => setHistory({candles: [], unavailable: true}));
    return () => fetching.cancel();
  }, [tradeHistory, tradeProduct, period]);

  return history;
};
