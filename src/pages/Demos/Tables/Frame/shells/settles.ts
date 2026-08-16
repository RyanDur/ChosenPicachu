import {has} from '@ryandur/sand';
import {ColumnNudge, RowNudge, displaced, interior, shifts} from '@components/DragSortableTable/survey';
import {Shell, baked, markColumns, markRows, nudgedTo, orderedTo, seatedTo} from '../shell';

export const animatedSettleColumn = (shell: Shell, held: string, struck: string): void => {
  const {order, bounds} = shell.desk();
  if (!has(bounds)) {
    return;
  }
  const marks = displaced(order, held, struck, bounds);
  shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
  markColumns(shell, marks);
};

export const staticSettleColumn = (shell: Shell, held: string, struck: string): void => {
  const {order} = shell.desk();
  shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
};

export const animatedSettleRow = (shell: Shell, held: number, struck: number): void => {
  const {bounds, seated} = shell.desk();
  if (!has(bounds)) {
    return;
  }
  shell.commit(seatedTo(held, struck));
  markRows(shell, shifts(bounds.rowHeights, seated, shell.desk().seated, held));
};

export const staticSettleRow = (shell: Shell, held: number, struck: number): void => {
  shell.commit(seatedTo(held, struck));
};

export const animatedOrdered = (shell: Shell) => (nudge: ColumnNudge): void => {
  shell.commit(orderedTo(nudge.from, nudge.to));
  markColumns(shell, nudge.marks);
};

export const staticOrdered = (shell: Shell) => ({from, to}: {from: number; to: number}): void =>
  shell.commit(orderedTo(from, to));

export const animatedArranged = (shell: Shell, held: number) => (nudge: RowNudge): void => {
  shell.commit(desk => nudgedTo(held, nudge.to)(baked(desk)));
  markRows(shell, nudge.drops);
};

export const staticArranged = (shell: Shell, held: number) => ({to}: {to: number; after: number[]}): void =>
  shell.commit(desk => nudgedTo(held, to)(baked(desk)));

export const shiftsRuled = (
  shell: Shell,
  heights: Readonly<Record<number, number>>,
  before: readonly number[],
  after: readonly number[]
): void => markRows(shell, shifts(heights, before, after));
