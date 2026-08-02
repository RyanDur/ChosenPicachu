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
  height: number
): readonly Point[] => {
  if (series.length < 2) {
    return [];
  }
  const prices = series.map(timed => timed.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const from = series[0].at;
  const span = series[series.length - 1].at - from;
  const scaleY = (price: number): number =>
    highest === lowest ? height / 2 : height - ((price - lowest) / (highest - lowest)) * height;
  const scaleX = (at: number): number =>
    span === 0 ? width / 2 : ((at - from) / span) * width;
  return series.map(timed => ({x: scaleX(timed.at), y: scaleY(timed.price)}));
};
