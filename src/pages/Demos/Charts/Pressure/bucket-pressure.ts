import {has} from '@ryandur/sand';
import {Trade} from '../../Market';

export type Pressure = {
  openedAt: number;
  bought: number;
  sold: number;
};

const fold = (pressure: Pressure, trade: Trade): Pressure => ({
  ...pressure,
  bought: pressure.bought + (trade.takerSide === 'buy' ? trade.size : 0),
  sold: pressure.sold + (trade.takerSide === 'buy' ? 0 : trade.size)
});

const openedBy = (trade: Trade, bucketMilliseconds: number): Pressure =>
  fold({openedAt: Math.floor(trade.tradedAt / bucketMilliseconds) * bucketMilliseconds, bought: 0, sold: 0}, trade);

export const bucketPressure = (trades: readonly Trade[], bucketMilliseconds: number): readonly Pressure[] =>
  trades.reduce<readonly Pressure[]>((pressures, trade) => {
    const current = pressures[pressures.length - 1];
    const bucket = Math.floor(trade.tradedAt / bucketMilliseconds) * bucketMilliseconds;
    return has(current) && current.openedAt === bucket
      ? [...pressures.slice(0, -1), fold(current, trade)]
      : [...pressures, openedBy(trade, bucketMilliseconds)];
  }, []);
