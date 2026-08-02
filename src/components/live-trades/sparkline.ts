export type Point = {
  x: number;
  y: number;
};

export const sparklinePoints = (
  prices: readonly number[],
  width: number,
  height: number
): readonly Point[] => {
  if (prices.length < 2) {
    return [];
  }
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const spanX = width / (prices.length - 1);
  const scaleY = (price: number): number =>
    highest === lowest ? height / 2 : height - ((price - lowest) / (highest - lowest)) * height;
  return prices.map((price, index) => ({x: index * spanX, y: scaleY(price)}));
};

export const sparklinePath = (
  prices: readonly number[],
  width: number,
  height: number
): string =>
  sparklinePoints(prices, width, height)
    .map(point => `${point.x},${point.y}`)
    .join(' ');
