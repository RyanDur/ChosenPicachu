import {empty, maybe} from '@ryandur/sand';
import {candles, Trade} from '../../Market';
import {bucketPlaces} from '../bucket-places';

export type Pressure = {
  openedAt: number;
  bought: number;
  sold: number;
};

export type PressureShape = {
  x: number;
  width: number;
  boughtTop: number;
  boughtHeight: number;
  soldTop: number;
  soldHeight: number;
};

const fold = (pressure: Pressure, trade: Trade): Pressure => ({
  ...pressure,
  bought: pressure.bought + (trade.takerSide === 'buy' ? trade.size : 0),
  sold: pressure.sold + (trade.takerSide === 'buy' ? 0 : trade.size)
});

const openedBy = (trade: Trade, bucketMilliseconds: number): Pressure =>
  fold({openedAt: candles.bucketOpening(trade.tradedAt, bucketMilliseconds), bought: 0, sold: 0}, trade);

const buckets = (trades: readonly Trade[], bucketMilliseconds: number): readonly Pressure[] =>
  trades.reduce<readonly Pressure[]>((pressures, trade) =>
    maybe(pressures.slice(-1)
      .find(({openedAt}) => openedAt === candles.bucketOpening(trade.tradedAt, bucketMilliseconds)))
      .map(current => [...pressures.slice(0, -1), fold(current, trade)])
      .orElse([...pressures, openedBy(trade, bucketMilliseconds)]), []);

const heaviestSide = (pressures: readonly Pressure[]): number =>
  Math.max(0, ...pressures.flatMap(pressure => [pressure.bought, pressure.sold]));

const drawn = (
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
  const places = bucketPlaces.of(pressures.map(pressure => pressure.openedAt), width, bucketMilliseconds);
  return pressures.map((pressure, at) => {
    const boughtHeight = scale(pressure.bought);
    return {
      x: places[at].x,
      width: places[at].width,
      boughtTop: middle - boughtHeight,
      boughtHeight,
      soldTop: middle,
      soldHeight: scale(pressure.sold)
    };
  });
};

export const pressureShapes = {buckets, heaviestSide, drawn};
