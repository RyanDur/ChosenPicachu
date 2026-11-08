import {has} from '@ryandur/sand';
import {Trade} from '../../Market';
import {windowSlots} from '../slots';

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
  bucketMilliseconds: number
): readonly PressureShape[] => {
  if (pressures.length === 0) {
    return [];
  }
  const peak = heaviestSide(pressures);
  const middle = height / 2;
  const scale = (size: number): number => peak === 0 ? 0 : (size / peak) * middle;
  const slots = windowSlots(pressures.map(pressure => pressure.openedAt), width, bucketMilliseconds);
  return pressures.map((pressure, at) => {
    const boughtHeight = scale(pressure.bought);
    return {
      x: slots[at].x,
      width: slots[at].width,
      boughtTop: middle - boughtHeight,
      boughtHeight,
      soldTop: middle,
      soldHeight: scale(pressure.sold)
    };
  });
};
