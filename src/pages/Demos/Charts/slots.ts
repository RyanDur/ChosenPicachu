import {empty} from '@ryandur/sand';

export type Slot = {
  x: number;
  width: number;
  center: number;
};

const of = (
  openings: readonly number[],
  width: number,
  bucketMilliseconds: number
): readonly Slot[] => {
  if (empty(openings)) {
    return [];
  }
  const from = openings[0];
  const shownMilliseconds = openings[openings.length - 1] + 2 * bucketMilliseconds - from;
  const slot = (bucketMilliseconds / shownMilliseconds) * width;
  const barWidth = slot * 0.6;
  return openings.map(openedAt => {
    const x = ((openedAt - from) / shownMilliseconds) * width;
    return {x: x + (slot - barWidth) / 2, width: barWidth, center: x + slot / 2};
  });
};

export const periodSlots = {of};
