import {has} from '@ryandur/sand';
import {still} from '@components/DragSortableTable/travel';
import {MountedTable, TableState, seatOffset} from './table-state';
import {columnCells, changeMotion} from './settle';

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
