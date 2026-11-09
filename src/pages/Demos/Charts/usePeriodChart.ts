import {useId} from 'react';
import {Candle, candles, Period, PeriodHistory, periodHistory, periods, Trade} from '../Market';
import {usePeriodCandles} from './usePeriodCandles';
import {PeriodChartKind} from './chart-kinds';

type Chart = {
  id?: string;
  kind: PeriodChartKind;
  period: Period;
  trades: readonly Trade[];
};

type PeriodChart = {
  id: string;
  history: PeriodHistory;
  bucketMilliseconds: number;
  shownCandles: readonly Candle[];
};

export const usePeriodChart = ({id, kind, period, trades}: Chart): PeriodChart => {
  const generated = useId();
  const history = usePeriodCandles(period);
  const bucketMilliseconds = periods.bucketMilliseconds[period];
  return {
    id: id ?? `${kind}${generated}`,
    history,
    bucketMilliseconds,
    shownCandles: candles.mergeLive(
      periodHistory.candlesOf(history),
      candles.bucketTrades(trades, bucketMilliseconds),
      periods.candleCap[period]
    )
  };
};
