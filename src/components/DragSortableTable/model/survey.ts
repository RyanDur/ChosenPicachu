import {has} from '@ryandur/sand';

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
  const headers = [...(surface.tHead?.rows[0]?.cells ?? [])];
  return {
    left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height,
    columnWidths: order.reduce((widths, column, at) => ({
      ...widths,
      [column]: headers[at]?.getBoundingClientRect().width ?? 0
    }), {})
  };
};

const rowHeights = (surface: HTMLTableElement, seats: readonly string[]): PixelSizes => {
  const body = surface.tBodies[0];
  return seats.reduce((heights, row, position) => ({
    ...heights,
    [row]: body?.rows[position]?.getBoundingClientRect().height ?? 0
  }), {});
};

const of = (
  surface: HTMLTableElement,
  order: readonly string[],
  seats: readonly string[]
): Survey => ({...bounded(surface, order), rowHeights: rowHeights(surface, seats)});

const deadZone = (struckSize: number, aloftSize: number): number =>
  Math.max(struckSize / 4, (struckSize - aloftSize) / 2);

type Slot<Identity> = {holds: Identity; at: number; size: number; start: number; end: number};

const struckPast = <Identity>(
  slots: readonly Slot<Identity>[],
  home: number,
  coord: number
): Identity | undefined => {
  const struck = slots.find(({end}) => coord < end);
  if (has(struck) && struck.at !== home) {
    const held = deadZone(struck.size, slots[home]?.size ?? 0);
    return (struck.at < home ? coord < struck.end - held : coord > struck.start + held)
      ? struck.holds
      : undefined;
  }
  return struck?.holds;
};

const columnUnder = (order: readonly string[], bounds: Bounds) =>
  (x: number, y: number, aloft: string): string | undefined => {
    if (y >= bounds.top && y <= bounds.top + bounds.height) {
      let edge = bounds.left;
      const total = order.reduce((sum, name) => sum + (bounds.columnWidths[name] ?? 0), 0) || 1;
      const slots = order.map((column, at) => {
        const size = (bounds.columnWidths[column] ?? 0) / total * bounds.width;
        edge += size;
        return {holds: column, at, size, start: edge - size, end: edge};
      });
      return struckPast(slots, order.indexOf(aloft), x);
    }
    return undefined;
  };

const columnLeft = (order: readonly string[], bounds: Bounds) => (column: string): number => {
  const total = order.reduce((sum, name) => sum + (bounds.columnWidths[name] ?? 0), 0) || 1;
  const before = order.slice(0, order.indexOf(column)).reduce((sum, name) => sum + (bounds.columnWidths[name] ?? 0), 0);
  return bounds.left + before / total * bounds.width;
};

const rowTop = (seats: readonly string[], bounds: Survey) => (seat: string): number => {
  const all = seats.reduce((sum, row) => sum + (bounds.rowHeights[row] ?? 0), 0);
  const before = seats.slice(0, seats.indexOf(seat)).reduce((sum, row) => sum + (bounds.rowHeights[row] ?? 0), 0);
  return bounds.top + bounds.height - all + before;
};

const rowUnder = (seats: readonly string[], bounds: Survey) =>
  (x: number, y: number, aloft: string): string | undefined => {
    if (x >= bounds.left && x <= bounds.left + bounds.width) {
      const {top, height, rowHeights} = bounds;
      let edge = top + height -
                seats.reduce((total, row) => total + rowHeights[row], 0);
      const slots = seats.map((row, at) => {
        const size = rowHeights[row];
        edge += size;
        return {holds: row, at, size, start: edge - size, end: edge};
      });
      return struckPast(slots, seats.indexOf(aloft), y);
    }
    return undefined;
  };

const displacedBetween = <Seat>(seats: readonly Seat[], from: number, to: number): Seat[] =>
  seats.slice(Math.min(from, to), Math.max(from, to) + 1).filter((_seat, at) => at !== from - Math.min(from, to));

const spanCrossed = <Seat extends string | number>(
  seats: readonly Seat[],
  sizes: Readonly<Partial<Record<Seat, number>>>,
  from: number,
  to: number
): number => displacedBetween(seats, from, to).reduce((sum, seat) => sum + (sizes[seat] ?? 0), 0);

const anchored = (position: number, count: number): boolean =>
  position === 0 || position === count - 1;

const columnSteps: Record<string, 1 | -1> = {ArrowRight: 1, ArrowLeft: -1};

const rowSteps: Record<string, 1 | -1> = {ArrowDown: 1, ArrowUp: -1};

const nudgedColumn = (order: readonly string[], held: string, toward: number): {from: number; to: number} => {
  const from = order.indexOf(held);
  return {from, to: interior(from + toward, order.length)};
};

const nudgedRow = (seats: readonly string[], held: string, toward: number): {from: number; to: number} => {
  const from = seats.indexOf(held);
  return {from, to: Math.min(Math.max(from + toward, 0), seats.length - 1)};
};

const struckAway = <Seat>(held: Seat, struck: Seat | undefined): struck is Seat =>
  has(struck) && struck !== held;

const gripLabel = (position: number): string => `move row ${position + 1}`;

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
  spanCrossed,
  anchored,
  columnSteps,
  rowSteps,
  nudgedColumn,
  nudgedRow,
  struckAway,
  gripLabel,
  interior
};
