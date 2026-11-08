export type TimedPrice = {
  at: number;
  price: number;
};

export type Point = {
  x: number;
  y: number;
};

export const sparklinePoints = (
  series: readonly TimedPrice[],
  width: number,
  height: number,
  headroomMilliseconds = 0
): readonly Point[] => {
  if (series.length < 2) {
    return [];
  }
  const prices = series.map(timed => timed.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const from = series[0].at;
  const shownMilliseconds = series[series.length - 1].at - from + headroomMilliseconds;
  const scaleY = (price: number): number =>
    highest === lowest ? height / 2 : height - ((price - lowest) / (highest - lowest)) * height;
  const scaleX = (at: number): number =>
    shownMilliseconds === 0 ? width / 2 : ((at - from) / shownMilliseconds) * width;
  return series.map(timed => ({x: scaleX(timed.at), y: scaleY(timed.price)}));
};
