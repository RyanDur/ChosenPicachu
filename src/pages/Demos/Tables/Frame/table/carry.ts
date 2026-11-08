import {has} from '@ryandur/sand';
import {TableState, tableState, travel} from '@components/DragSortableTable/model';
import {MountedTable} from './table-state';
import {columnCells, changeMotion} from './settle';
import {TableContext} from './context';

const carriedCells = (mounted: MountedTable, state: TableState): readonly HTMLTableCellElement[] => {
  const {drag} = state;
  if (!has(drag)) {
    return [];
  }
  return drag.axis === 'column' ? columnCells(mounted, drag.held) : [...(mounted.lanes.get(drag.held)?.cells ?? [])];
};

const dress = (mounted: MountedTable, state: TableState): void => {
  [...mounted.table.querySelectorAll('.carried')].forEach(cell => {
    changeMotion(cell, {off: ['carried']});
    if (cell instanceof HTMLElement) {
      ['--seat-x', '--seat-y', '--drift-x', '--drift-y'].forEach(property => cell.style.removeProperty(property));
    }
  });
  const seat = tableState.seatOffset(state, mounted.order(), mounted.standing()) ?? travel.still;
  const drift = state.drag?.drift ?? travel.still;
  carriedCells(mounted, state).forEach(cell => {
    changeMotion(cell, {on: ['carried']});
    cell.style.setProperty('--seat-x', `${seat.x}px`);
    cell.style.setProperty('--seat-y', `${seat.y}px`);
    cell.style.setProperty('--drift-x', `${drift.x}px`);
    cell.style.setProperty('--drift-y', `${drift.y}px`);
  });
};

type Carrier = Pick<TableContext, 'store' | 'moved' | 'dropped'>;

const follow = (holder: HTMLElement, {store, moved, dropped}: Carrier): void => {
  (['pointermove', 'lostpointercapture'] as const).forEach(travelling => holder.addEventListener(travelling, event =>
    has(store.state.drag) ? travel.pointer(moved, dropped)(event) : undefined));
  (['pointerup', 'pointercancel'] as const).forEach(ending => holder.addEventListener(ending, () => dropped()));
};

export const carry = {
  dress,
  follow
};
