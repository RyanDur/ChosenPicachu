import {has} from '@ryandur/sand';
import {ColumnNudge, RowNudge, displaced, interior, shifts} from '@components/DragSortableTable/survey';
import {MountedTable, baked, markColumns, markRows, nudgedTo, orderedTo, seatedTo} from '../table';

export const animatedSettleColumn = (mounted: MountedTable, held: string, struck: string): void => {
  const {order, bounds} = mounted.state();
  if (!has(bounds)) {
    return;
  }
  const marks = displaced(order, held, struck, bounds);
  mounted.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
  markColumns(mounted, marks);
};

export const staticSettleColumn = (mounted: MountedTable, held: string, struck: string): void => {
  const {order} = mounted.state();
  mounted.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
};

export const animatedSettleRow = (mounted: MountedTable, held: number, struck: number): void => {
  const {bounds, seated} = mounted.state();
  if (!has(bounds)) {
    return;
  }
  mounted.commit(seatedTo(held, struck));
  markRows(mounted, shifts(bounds.rowHeights, seated, mounted.state().seated, held));
};

export const staticSettleRow = (mounted: MountedTable, held: number, struck: number): void => {
  mounted.commit(seatedTo(held, struck));
};

export const animatedOrdered = (mounted: MountedTable) => (nudge: ColumnNudge): void => {
  mounted.commit(orderedTo(nudge.from, nudge.to));
  markColumns(mounted, nudge.marks);
};

export const staticOrdered = (mounted: MountedTable) => ({from, to}: {from: number; to: number}): void =>
  mounted.commit(orderedTo(from, to));

export const animatedArranged = (mounted: MountedTable, held: number) => (nudge: RowNudge): void => {
  mounted.commit(state => nudgedTo(held, nudge.to)(baked(state)));
  markRows(mounted, nudge.drops);
};

export const staticArranged = (mounted: MountedTable, held: number) => ({to}: {to: number; after: number[]}): void =>
  mounted.commit(state => nudgedTo(held, to)(baked(state)));

export const shiftsRuled = (
  mounted: MountedTable,
  heights: Readonly<Record<number, number>>,
  before: readonly number[],
  after: readonly number[]
): void => markRows(mounted, shifts(heights, before, after));
