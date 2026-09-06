import {ColumnNudge, RowNudge, interior} from '@components/DragSortableTable/survey';
import {MountedTable, baked, nudgedTo, orderedTo, seatedTo} from '../table';

export type Show = (draw: () => void) => void;

export const glided: Show = draw => {
  if ('startViewTransition' in document) {
    document.startViewTransition(draw);
  } else {
    draw();
  }
};

export const cut: Show = draw => draw();

export const settleColumn = (mounted: MountedTable, held: string, struck: string): void => {
  const {order} = mounted.state();
  mounted.dispatch(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
};

export const settleRow = (mounted: MountedTable, held: number, struck: number): void =>
  mounted.dispatch(seatedTo(held, struck));

export const ordered = (mounted: MountedTable) => ({from, to}: ColumnNudge): void =>
  mounted.dispatch(orderedTo(from, to));

export const arranged = (mounted: MountedTable, held: number) => ({to}: RowNudge): void =>
  mounted.dispatch(state => nudgedTo(held, to)(baked(mounted.standing())(state)));
