import {useEffect, useState} from 'react';
import {useEnv} from '@components/Env';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {Candle} from './Candles/shapes';
import {bucketLabel, granularitySeconds, Period, periodSpanMs} from './period';
import {periodCandles} from './coinbase/history';

export type PeriodHistory =
  | {state: 'loading'}
  | {state: 'unavailable'}
  | {state: 'arrived'; candles: readonly Candle[]};

const loading: PeriodHistory = {state: 'loading'};

export const candlesOf = (history: PeriodHistory): readonly Candle[] =>
  history.state === 'arrived' ? history.candles : [];

export const captionFor = (history: PeriodHistory, candles: number, period: Period): string => {
  if (candles > 0) return `${candles} candles · ${bucketLabel[period]}`;
  switch (history.state) {
    case 'loading':
      return 'loading history';
    case 'unavailable':
      return 'history unavailable';
    case 'arrived':
      return 'waiting for the first trade';
  }
};

const queryFor = (period: Period): string => {
  const now = new Date();
  const start = new Date(now.getTime() - periodSpanMs[period]);
  return `granularity=${granularitySeconds[period]}` +
    `&start=${encodeURIComponent(start.toISOString())}` +
    `&end=${encodeURIComponent(now.toISOString())}`;
};

export const usePeriodCandles = (period: Period): PeriodHistory => {
  const {tradeHistory, tradeProduct} = useEnv();
  const {raise} = useBanners();
  const [history, setHistory] = useState<PeriodHistory>(loading);

  useEffect(() => {
    setHistory(loading);
    const fetching = periodCandles(tradeHistory, tradeProduct, queryFor(period))
      .onSuccess(candles => setHistory({state: 'arrived', candles}))
      .onFailure(error => {
        setHistory({state: 'unavailable'});
        raise(troubleWith('the candle history')(error));
      });
    return () => fetching.cancel();
  }, [tradeHistory, tradeProduct, period, raise]);

  return history;
};
