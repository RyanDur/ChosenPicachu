import {useEffect} from 'react';
import {Period, PeriodHistory, marketActions, marketReads} from '../Market';
import {useMarketDispatch, useMarketRead} from '../Market/Trading';

export const usePeriodCandles = (period: Period): PeriodHistory => {
  const dispatch = useMarketDispatch();

  useEffect(() => {
    dispatch(marketActions.candlesAsked(period));
  }, [dispatch, period]);

  return useMarketRead(marketReads.periodHistoryOf(period));
};
