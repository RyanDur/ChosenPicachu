import {maybe, Maybe, nothing, some} from '@ryandur/sand';

export type PixelSizes = Readonly<Record<string, number>>;

type Bounds = {
  left: number;
  top: number;
  width: number;
  height: number;
  columnWidths: PixelSizes;
};

export type Survey = Bounds & {
  rowHeights: PixelSizes;
};

const bounded = (surface: HTMLTableElement, order: readonly string[]): Bounds => {
  const bounds = surface.getBoundingClientRect();
  const headers = maybe(surface.tHead).mBind(head => maybe(head.rows[0])).map(row => [...row.cells]).orElse([]);
  return {
    left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height,
    columnWidths: order.reduce((widths, column, at) => ({
      ...widths,
      [column]: maybe(headers[at]).map(header => header.getBoundingClientRect().width).orElse(0)
    }), {})
  };
};

const rowHeights = (surface: HTMLTableElement, seats: readonly string[]): PixelSizes => {
  const body = maybe(surface.tBodies[0]);
  return seats.reduce((heights, row, position) => ({
    ...heights,
    [row]: body.mBind(section => maybe(section.rows[position]))
      .map(lane => lane.getBoundingClientRect().height).orElse(0)
  }), {});
};

const of = (
  surface: HTMLTableElement,
  order: readonly string[],
  seats: readonly string[]
): Survey => ({...bounded(surface, order), rowHeights: rowHeights(surface, seats)});

const deadZone = (struckSize: number, aloftSize: number): number =>
  Math.max(struckSize / 4, (struckSize - aloftSize) / 2);

const sizeOf = <Seat extends string | number>(sizes: Readonly<Partial<Record<Seat, number>>>, seat: Seat): number =>
  maybe<number>(sizes[seat]).orElse(0);

type MeasuredSeat<Identity> = {holds: Identity; at: number; size: number; start: number; end: number};

const struckPast = <Identity>(
  measuredSeats: readonly MeasuredSeat<Identity>[],
  home: number,
  pointerAt: number
): Maybe<Identity> =>
  maybe(measuredSeats.find(({end}) => pointerAt < end)).mBind(struck => {
    if (struck.at === home) {
      return some(struck.holds);
    }
    const held = deadZone(struck.size, maybe(measuredSeats[home]).map(seat => seat.size).orElse(0));
    return (struck.at < home ? pointerAt < struck.end - held : pointerAt > struck.start + held)
      ? some(struck.holds)
      : nothing();
  });

const columnUnder = (order: readonly string[], bounds: Bounds) =>
  (x: number, y: number, aloft: string): Maybe<string> => {
    if (y >= bounds.top && y <= bounds.top + bounds.height) {
      let edge = bounds.left;
      const total = order.reduce((sum, name) => sum + sizeOf(bounds.columnWidths, name), 0) || 1;
      const measuredSeats = order.map((column, at) => {
        const size = sizeOf(bounds.columnWidths, column) / total * bounds.width;
        edge += size;
        return {holds: column, at, size, start: edge - size, end: edge};
      });
      return struckPast(measuredSeats, order.indexOf(aloft), x);
    }
    return nothing();
  };

const columnLeft = (order: readonly string[], bounds: Bounds) => (column: string): number => {
  const total = order.reduce((sum, name) => sum + sizeOf(bounds.columnWidths, name), 0) || 1;
  const before = order.slice(0, order.indexOf(column))
    .reduce((sum, name) => sum + sizeOf(bounds.columnWidths, name), 0);
  return bounds.left + before / total * bounds.width;
};

const rowTop = (seats: readonly string[], bounds: Survey) => (seat: string): number => {
  const all = seats.reduce((sum, row) => sum + sizeOf(bounds.rowHeights, row), 0);
  const before = seats.slice(0, seats.indexOf(seat)).reduce((sum, row) => sum + sizeOf(bounds.rowHeights, row), 0);
  return bounds.top + bounds.height - all + before;
};

const rowUnder = (seats: readonly string[], bounds: Survey) =>
  (x: number, y: number, aloft: string): Maybe<string> => {
    if (x >= bounds.left && x <= bounds.left + bounds.width) {
      const {top, height, rowHeights} = bounds;
      let edge = top + height -
                seats.reduce((total, row) => total + sizeOf(rowHeights, row), 0);
      const measuredSeats = seats.map((row, at) => {
        const size = sizeOf(rowHeights, row);
        edge += size;
        return {holds: row, at, size, start: edge - size, end: edge};
      });
      return struckPast(measuredSeats, seats.indexOf(aloft), y);
    }
    return nothing();
  };

const displacedBetween = <Seat>(seats: readonly Seat[], from: number, to: number): Seat[] =>
  seats.slice(Math.min(from, to), Math.max(from, to) + 1).filter((_seat, at) => at !== from - Math.min(from, to));

const distanceCrossed = <Seat extends string | number>(
  seats: readonly Seat[],
  sizes: Readonly<Partial<Record<Seat, number>>>,
  from: number,
  to: number
): number => displacedBetween(seats, from, to).reduce((sum, seat) => sum + sizeOf(sizes, seat), 0);

const anchored = (position: number, count: number): boolean =>
  position === 0 || position === count - 1;

const nudgedColumn = (order: readonly string[], held: string, toward: number): {from: number; to: number} => {
  const from = order.indexOf(held);
  return {from, to: interior(from + toward, order.length)};
};

const nudgedRow = (seats: readonly string[], held: string, toward: number): {from: number; to: number} => {
  const from = seats.indexOf(held);
  return {from, to: Math.min(Math.max(from + toward, 0), seats.length - 1)};
};

const struckAway = <Seat>(held: Seat, struck: Seat): Maybe<Seat> =>
  struck === held ? nothing() : some(struck);

const interior = (at: number, count: number): number =>
  Math.min(Math.max(at, 1), count - 2);

export const survey = {
  bounded,
  rowHeights,
  of,
  columnUnder,
  columnLeft,
  rowTop,
  rowUnder,
  displacedBetween,
  distanceCrossed,
  anchored,
  nudgedColumn,
  nudgedRow,
  struckAway,
  interior
};
