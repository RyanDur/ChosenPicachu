import {empty} from '@ryandur/sand';
import {Candle} from '../../Market';
import {periodSlots} from '../slots';

export type VolumeShape = {
  x: number;
  width: number;
  top: number;
  height: number;
};

export const volumeShapes = (
  candles: readonly Candle[],
  width: number,
  height: number,
  bucketMilliseconds: number
): readonly VolumeShape[] => {
  if (empty(candles)) {
    return [];
  }
  const heaviest = Math.max(...candles.map(candle => candle.volume));
  const slots = periodSlots(candles.map(candle => candle.openedAt), width, bucketMilliseconds);
  return candles.map((candle, at) => {
    const barHeight = heaviest === 0 ? 0 : (candle.volume / heaviest) * height;
    return {
      x: slots[at].x,
      width: slots[at].width,
      top: height - barHeight,
      height: barHeight
    };
  });
};
