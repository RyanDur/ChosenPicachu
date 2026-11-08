import {empty} from '@ryandur/sand';
import {Pressure} from './bucket-pressure';
import {heaviestSide} from './heaviest-side';
import {periodSlots} from '../slots';

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
  if (empty(pressures)) {
    return [];
  }
  const peak = heaviestSide(pressures);
  const middle = height / 2;
  const scale = (size: number): number => peak === 0 ? 0 : (size / peak) * middle;
  const slots = periodSlots(pressures.map(pressure => pressure.openedAt), width, bucketMilliseconds);
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
