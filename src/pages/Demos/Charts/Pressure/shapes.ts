import {has} from '@ryandur/sand';
import {Trade} from '../coinbase';

export type Pressure = {
  openedAt: number;
  bought: number;
  sold: number;
};

const fold = (pressure: Pressure, trade: Trade): Pressure => ({
  ...pressure,
  bought: pressure.bought + (trade.side === 'buy' ? trade.size : 0),
  sold: pressure.sold + (trade.side === 'sell' ? trade.size : 0)
});

const openedBy = (trade: Trade, bucketMs: number): Pressure =>
  fold({openedAt: Math.floor(trade.tradedAt / bucketMs) * bucketMs, bought: 0, sold: 0}, trade);

export const bucketPressure = (trades: readonly Trade[], bucketMs: number): readonly Pressure[] =>
  trades.reduce<readonly Pressure[]>((pressures, trade) => {
    const current = pressures[pressures.length - 1];
    const bucket = Math.floor(trade.tradedAt / bucketMs) * bucketMs;
    return has(current) && current.openedAt === bucket
      ? [...pressures.slice(0, -1), fold(current, trade)]
      : [...pressures, openedBy(trade, bucketMs)];
  }, []);

export const heaviestSide = (pressures: readonly Pressure[]): number =>
  Math.max(0, ...pressures.flatMap(pressure => [pressure.bought, pressure.sold]));

export type PressureShape = {
  x: number;
  width: number;
  boughtTop: number;
  boughtHeight: number;
  soldTop: number;
  soldHeight: number;
};

export const pressureShapes = (
  pressures: readonly Pressure[],
  width: number,
  height: number,
  bucketMs: number
): readonly PressureShape[] => {
  if (pressures.length === 0) {
    return [];
  }
  const peak = heaviestSide(pressures);
  const middle = height / 2;
  const scale = (size: number): number => peak === 0 ? 0 : (size / peak) * middle;
  const from = pressures[0].openedAt;
  const span = pressures[pressures.length - 1].openedAt + 2 * bucketMs - from;
  const slot = (bucketMs / span) * width;
  const barWidth = slot * 0.6;
  return pressures.map(pressure => {
    const boughtHeight = scale(pressure.bought);
    return {
      x: ((pressure.openedAt - from) / span) * width + (slot - barWidth) / 2,
      width: barWidth,
      boughtTop: middle - boughtHeight,
      boughtHeight,
      soldTop: middle,
      soldHeight: scale(pressure.sold)
    };
  });
};
