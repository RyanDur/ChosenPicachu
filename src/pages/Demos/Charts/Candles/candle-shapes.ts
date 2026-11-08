import {empty} from '@ryandur/sand';
import {Candle} from '../../Market';
import {periodSlots} from '../slots';

export type CandleShape = {
  x: number;
  width: number;
  bodyTop: number;
  bodyHeight: number;
  wickTop: number;
  wickBottom: number;
  center: number;
  direction: 'up' | 'down';
};

export type VolumeShape = {
  x: number;
  width: number;
  top: number;
  height: number;
};

const drawn = (
  candles: readonly Candle[],
  width: number,
  height: number,
  bucketMilliseconds: number
): readonly CandleShape[] => {
  if (empty(candles)) {
    return [];
  }
  const highest = Math.max(...candles.map(candle => candle.high));
  const lowest = Math.min(...candles.map(candle => candle.low));
  const scaleY = (price: number): number =>
    highest === lowest ? height / 2 : height - ((price - lowest) / (highest - lowest)) * height;
  const slots = periodSlots.of(candles.map(candle => candle.openedAt), width, bucketMilliseconds);
  return candles.map((candle, at) => {
    const bodyTop = scaleY(Math.max(candle.open, candle.close));
    const bodyBottom = scaleY(Math.min(candle.open, candle.close));
    return {
      x: slots[at].x,
      width: slots[at].width,
      bodyTop,
      bodyHeight: Math.max(bodyBottom - bodyTop, 1),
      wickTop: scaleY(candle.high),
      wickBottom: scaleY(candle.low),
      center: slots[at].center,
      direction: candle.close >= candle.open ? 'up' : 'down'
    };
  });
};

const volumes = (
  candles: readonly Candle[],
  width: number,
  height: number,
  bucketMilliseconds: number
): readonly VolumeShape[] => {
  if (empty(candles)) {
    return [];
  }
  const heaviest = Math.max(...candles.map(candle => candle.volume));
  const slots = periodSlots.of(candles.map(candle => candle.openedAt), width, bucketMilliseconds);
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

export const candleShapes = {drawn, volumes};
