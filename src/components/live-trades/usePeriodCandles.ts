import {useEffect, useState} from 'react';
import {useEnv} from '@components/Env';
import {Candle} from './Candles/shapes';
import {ChartWindow, endOf, granularitySeconds, isRange, Period, rangeGranularity, startOf} from './period';
import {periodCandles} from './history';

export type PeriodHistory = {
  candles: readonly Candle[];
  unavailable: boolean;
};

const clean: PeriodHistory = {candles: [], unavailable: false};

const queryFor = (chartWindow: Exclude<ChartWindow, Period.live>): string =>
  isRange(chartWindow)
    ? `granularity=${rangeGranularity(chartWindow)}` +
      `&start=${encodeURIComponent(startOf(chartWindow.from).toISOString())}` +
      `&end=${encodeURIComponent(endOf(chartWindow.to).toISOString())}`
    : `granularity=${granularitySeconds[chartWindow]}`;

export const usePeriodCandles = (chartWindow: ChartWindow): PeriodHistory => {
  const {tradeHistory, tradeProduct} = useEnv();
  const [history, setHistory] = useState<PeriodHistory>(clean);

  useEffect(() => {
    setHistory(clean);
    if (chartWindow === Period.live) {
      return;
    }
    const fetching = periodCandles(tradeHistory, tradeProduct, queryFor(chartWindow))
      .onSuccess(candles => setHistory({candles, unavailable: false}))
      .onFailure(() => setHistory({candles: [], unavailable: true}));
    return () => fetching.cancel();
  }, [tradeHistory, tradeProduct, chartWindow]);

  return history;
};
