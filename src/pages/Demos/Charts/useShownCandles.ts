import {Candle, candles, marketReads, Period, PeriodHistory, periodHistory, periods} from '../Market';
import {useMarketRead} from '../Market/Trading';
import {usePeriodCandles} from './usePeriodCandles';
import {useDesk} from './useDesk';
import {PeriodChartKind} from './chart-kinds';

type ShownCandles = {
  period: Period;
  fetchedPast: PeriodHistory;
  bucketMilliseconds: number;
  candles: readonly Candle[];
};

export const useShownCandles = (kind: PeriodChartKind): ShownCandles => {
  const period = useDesk().periodOf(kind);
  const fetchedPast = usePeriodCandles(period);
  const trades = useMarketRead(marketReads.liveTrades);
  const bucketMilliseconds = periods.bucketMilliseconds[period];
  return {
    period,
    fetchedPast,
    bucketMilliseconds,
    candles: candles.mergeLive(
      periodHistory.candlesOf(fetchedPast),
      candles.bucketTrades(trades, bucketMilliseconds),
      periods.candleCap[period]
    )
  };
};
