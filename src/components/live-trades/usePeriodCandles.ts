import {useEffect, useState} from 'react';
import {useEnv} from '@components/Env';
import {Candle} from './Candles/shapes';
import {granularitySeconds, Period, periodSpanMs} from './period';
import {periodCandles} from './history';

export type PeriodHistory = {
  candles: readonly Candle[];
  unavailable: boolean;
  pending: boolean;
};

const clean: PeriodHistory = {candles: [], unavailable: false, pending: true};

const queryFor = (period: Period): string => {
  const now = new Date();
  const start = new Date(now.getTime() - periodSpanMs[period]);
  return `granularity=${granularitySeconds[period]}` +
    `&start=${encodeURIComponent(start.toISOString())}` +
    `&end=${encodeURIComponent(now.toISOString())}`;
};

export const usePeriodCandles = (period: Period): PeriodHistory => {
  const {tradeHistory, tradeProduct} = useEnv();
  const [history, setHistory] = useState<PeriodHistory>(clean);

  useEffect(() => {
    setHistory(clean);
    const fetching = periodCandles(tradeHistory, tradeProduct, queryFor(period))
      .onSuccess(candles => setHistory({candles, unavailable: false, pending: false}))
      .onFailure(() => setHistory({candles: [], unavailable: true, pending: false}));
    return () => fetching.cancel();
  }, [tradeHistory, tradeProduct, period]);

  return history;
};
