import {useEffect} from 'react';
import {Period} from './period';
import {PeriodHistory} from './period-history';
import {marketActions, marketSelectors} from '../Market';
import {useMarketDispatch, useMarketSelector} from '../Market/Trading';

export const usePeriodCandles = (period: Period): PeriodHistory => {
  const dispatch = useMarketDispatch();

  useEffect(() => {
    dispatch(marketActions.candlesAsked(period));
  }, [dispatch, period]);

  return useMarketSelector(marketSelectors.periodHistoryOf(period));
};
