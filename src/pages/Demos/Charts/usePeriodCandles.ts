import {useEffect} from 'react';
import {Period} from './period';
import {PeriodHistory} from './period-history';
import {useDemosDispatch, useDemosSelector} from '../Provider';
import {candlesAsked, periodHistoryOf} from '../store';

export const usePeriodCandles = (period: Period): PeriodHistory => {
  const dispatch = useDemosDispatch();

  useEffect(() => {
    dispatch(candlesAsked(period));
  }, [dispatch, period]);

  return useDemosSelector(periodHistoryOf(period));
};
