import {ColumnNudge, RowNudge, interior} from '@components/DragSortableTable/survey';
import {MountedTable, baked, nudgedTo, orderedTo, seatedTo} from '../table';

export type Settle = (update: () => void) => void;

export const glided: Settle = update => {
  if ('startViewTransition' in document) {
    document.startViewTransition(update);
  } else {
    update();
  }
};

export const cut: Settle = update => update();

export const settleColumn = (settle: Settle) => (mounted: MountedTable, held: string, struck: string): void => {
  const {order} = mounted.state();
  settle(() => mounted.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length))));
};

export const settleRow = (settle: Settle) => (mounted: MountedTable, held: number, struck: number): void =>
  settle(() => mounted.commit(seatedTo(held, struck)));

export const ordered = (settle: Settle) => (mounted: MountedTable) => ({from, to}: ColumnNudge): void =>
  settle(() => mounted.commit(orderedTo(from, to)));

export const arranged = (settle: Settle) => (mounted: MountedTable, held: number) => ({to}: RowNudge): void =>
  settle(() => mounted.commit(state => nudgedTo(held, to)(baked(state))));
