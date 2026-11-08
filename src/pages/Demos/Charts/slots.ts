export type Slot = {
  x: number;
  width: number;
  center: number;
};

export const periodSlots = (
  openings: readonly number[],
  width: number,
  bucketMilliseconds: number
): readonly Slot[] => {
  if (openings.length === 0) {
    return [];
  }
  const from = openings[0];
  const shown = openings[openings.length - 1] + 2 * bucketMilliseconds - from;
  const slot = (bucketMilliseconds / shown) * width;
  const barWidth = slot * 0.6;
  return openings.map(openedAt => {
    const x = ((openedAt - from) / shown) * width;
    return {x: x + (slot - barWidth) / 2, width: barWidth, center: x + slot / 2};
  });
};
