import {Trade} from '@transport/coinbase';

export type Candle = {
  openedAt: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const fold = (candle: Candle, trade: Trade): Candle => ({
  ...candle,
  high: Math.max(candle.high, trade.price),
  low: Math.min(candle.low, trade.price),
  close: trade.price,
  volume: candle.volume + trade.size
});

const openedBy = (trade: Trade, bucketMs: number): Candle => ({
  openedAt: Math.floor(trade.tradedAt / bucketMs) * bucketMs,
  open: trade.price,
  high: trade.price,
  low: trade.price,
  close: trade.price,
  volume: trade.size
});

export const mergeLive = (
  seed: readonly Candle[],
  streamed: readonly Candle[],
  cap: number
): readonly Candle[] => {
  const cut = streamed[0]?.openedAt ?? Number.POSITIVE_INFINITY;
  return [...seed.filter(candle => candle.openedAt < cut), ...streamed].slice(-cap);
};

export const bucketTrades = (trades: readonly Trade[], bucketMs: number): readonly Candle[] =>
  trades.reduce<readonly Candle[]>((candles, trade) => {
    const current = candles[candles.length - 1];
    const bucket = Math.floor(trade.tradedAt / bucketMs) * bucketMs;
    return current !== undefined && current.openedAt === bucket
      ? [...candles.slice(0, -1), fold(current, trade)]
      : [...candles, openedBy(trade, bucketMs)];
  }, []);

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

export const candleShapes = (
  candles: readonly Candle[],
  width: number,
  height: number,
  bucketMs: number
): readonly CandleShape[] => {
  if (candles.length === 0) {
    return [];
  }
  const highest = Math.max(...candles.map(candle => candle.high));
  const lowest = Math.min(...candles.map(candle => candle.low));
  const scaleY = (price: number): number =>
    highest === lowest ? height / 2 : height - ((price - lowest) / (highest - lowest)) * height;
  const from = candles[0].openedAt;
  const span = candles[candles.length - 1].openedAt + bucketMs - from;
  const slot = (bucketMs / span) * width;
  const bodyWidth = slot * 0.6;
  return candles.map(candle => {
    const x = ((candle.openedAt - from) / span) * width;
    const bodyTop = scaleY(Math.max(candle.open, candle.close));
    const bodyBottom = scaleY(Math.min(candle.open, candle.close));
    return {
      x: x + (slot - bodyWidth) / 2,
      width: bodyWidth,
      bodyTop,
      bodyHeight: Math.max(bodyBottom - bodyTop, 1),
      wickTop: scaleY(candle.high),
      wickBottom: scaleY(candle.low),
      center: x + slot / 2,
      direction: candle.close >= candle.open ? 'up' : 'down'
    };
  });
};

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
  bucketMs: number
): readonly VolumeShape[] => {
  if (candles.length === 0) {
    return [];
  }
  const heaviest = Math.max(...candles.map(candle => candle.volume));
  const from = candles[0].openedAt;
  const span = candles[candles.length - 1].openedAt + bucketMs - from;
  const slot = (bucketMs / span) * width;
  const barWidth = slot * 0.6;
  return candles.map(candle => {
    const barHeight = heaviest === 0 ? 0 : (candle.volume / heaviest) * height;
    return {
      x: ((candle.openedAt - from) / span) * width + (slot - barWidth) / 2,
      width: barWidth,
      top: height - barHeight,
      height: barHeight
    };
  });
};
