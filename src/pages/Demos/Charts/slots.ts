export type Slot = {
  x: number;
  width: number;
  center: number;
};

export const windowSlots = (
  openings: readonly number[],
  width: number,
  bucketMs: number
): readonly Slot[] => {
  if (openings.length === 0) {
    return [];
  }
  const from = openings[0];
  const span = openings[openings.length - 1] + 2 * bucketMs - from;
  const slot = (bucketMs / span) * width;
  const barWidth = slot * 0.6;
  return openings.map(openedAt => {
    const x = ((openedAt - from) / span) * width;
    return {x: x + (slot - barWidth) / 2, width: barWidth, center: x + slot / 2};
  });
};
