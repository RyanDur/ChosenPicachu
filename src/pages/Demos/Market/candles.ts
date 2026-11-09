import {has, maybe} from '@ryandur/sand';
import {Trade} from './coinbase';

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

const openedBy = (trade: Trade, bucketMilliseconds: number): Candle => ({
  openedAt: Math.floor(trade.tradedAt / bucketMilliseconds) * bucketMilliseconds,
  open: trade.price,
  high: trade.price,
  low: trade.price,
  close: trade.price,
  volume: trade.size
});

const mergeLive = (
  seed: readonly Candle[],
  streamed: readonly Candle[],
  cap: number
): readonly Candle[] => {
  const cut = maybe(streamed[0]).map(({openedAt}) => openedAt).orElse(Number.POSITIVE_INFINITY);
  return [...seed.filter(candle => candle.openedAt < cut), ...streamed].slice(-cap);
};

const bucketTrades = (trades: readonly Trade[], bucketMilliseconds: number): readonly Candle[] =>
  trades.reduce<readonly Candle[]>((candles, trade) => {
    const current = candles[candles.length - 1];
    const bucket = Math.floor(trade.tradedAt / bucketMilliseconds) * bucketMilliseconds;
    return has(current) && current.openedAt === bucket
      ? [...candles.slice(0, -1), fold(current, trade)]
      : [...candles, openedBy(trade, bucketMilliseconds)];
  }, []);

type Candles = {
  mergeLive: (seed: readonly Candle[], streamed: readonly Candle[], cap: number) => readonly Candle[];
  bucketTrades: (trades: readonly Trade[], bucketMilliseconds: number) => readonly Candle[];
};

export const candles: Candles = {mergeLive, bucketTrades};
