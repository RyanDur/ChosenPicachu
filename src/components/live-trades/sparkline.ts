export const sparklinePath = (
  prices: readonly number[],
  width: number,
  height: number
): string => {
  if (prices.length < 2) {
    return '';
  }
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const spanX = width / (prices.length - 1);
  const scaleY = (price: number): number =>
    highest === lowest ? height / 2 : height - ((price - lowest) / (highest - lowest)) * height;
  return prices.map((price, index) => `${index * spanX},${scaleY(price)}`).join(' ');
};
