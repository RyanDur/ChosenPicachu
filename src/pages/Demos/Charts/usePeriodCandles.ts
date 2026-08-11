import {useEffect, useState} from 'react';
import {useEnv} from '@components/Env';
import {useBanners} from '@components/Banners';
import {troubleWith} from '@transport/trouble';
import {Candle} from './Candles/shapes';
import {granularitySeconds, Period, periodSpanMs} from './period';
import {periodCandles} from './coinbase/history';

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
  const {raise} = useBanners();
  const [history, setHistory] = useState<PeriodHistory>(clean);

  useEffect(() => {
    setHistory(clean);
    const fetching = periodCandles(tradeHistory, tradeProduct, queryFor(period))
      .onSuccess(candles => setHistory({candles, unavailable: false, pending: false}))
      .onFailure(error => {
        setHistory({candles: [], unavailable: true, pending: false});
        raise(troubleWith('the candle history')(error));
      });
    return () => fetching.cancel();
  }, [tradeHistory, tradeProduct, period, raise]);

  return history;
};
