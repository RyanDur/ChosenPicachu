import {has} from '@ryandur/sand';
import {pointerTravel, still} from '@components/DragSortableTable/travel';
import {MountedTable, TableState, seatOffset} from './table-state';
import {columnCells, changeMotion} from './settle';
import {TableContext} from './context';

const carriedCells = (mounted: MountedTable, state: TableState): readonly HTMLTableCellElement[] => {
  const {drag} = state;
  if (!has(drag)) {
    return [];
  }
  return drag.axis === 'column' ? columnCells(mounted, drag.held) : [...(mounted.lanes.get(drag.held)?.cells ?? [])];
};

export const dressCarried = (mounted: MountedTable, state: TableState): void => {
  [...mounted.table.querySelectorAll('.carried')].forEach(cell => {
    changeMotion(cell, {off: ['carried']});
    if (cell instanceof HTMLElement) {
      ['--seat-x', '--seat-y', '--drift-x', '--drift-y'].forEach(property => cell.style.removeProperty(property));
    }
  });
  const seat = seatOffset(state, mounted.order(), mounted.standing()) ?? still;
  const drift = state.drag?.drift ?? still;
  carriedCells(mounted, state).forEach(cell => {
    changeMotion(cell, {on: ['carried']});
    cell.style.setProperty('--seat-x', `${seat.x}px`);
    cell.style.setProperty('--seat-y', `${seat.y}px`);
    cell.style.setProperty('--drift-x', `${drift.x}px`);
    cell.style.setProperty('--drift-y', `${drift.y}px`);
  });
};

type Carrier = Pick<TableContext, 'store' | 'moved' | 'dropped'>;

export const carrying = (holder: HTMLElement, {store, moved, dropped}: Carrier): void => {
  (['pointermove', 'lostpointercapture'] as const).forEach(travelling => holder.addEventListener(travelling, event =>
    has(store.state.drag) ? pointerTravel(moved, dropped)(event) : undefined));
  (['pointerup', 'pointercancel'] as const).forEach(ending => holder.addEventListener(ending, () => dropped()));
};
