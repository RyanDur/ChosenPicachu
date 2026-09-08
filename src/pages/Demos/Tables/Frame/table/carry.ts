import {has} from '@ryandur/sand';
import {still} from '@components/DragSortableTable/travel';
import {MeasuresState, MountedTable, carriedOffset} from './table-state';
import {columnCells} from './settle';

const carriedCells = (mounted: MountedTable, state: MeasuresState): readonly HTMLTableCellElement[] => {
  const {drag} = state;
  if (!has(drag)) {
    return [];
  }
  return drag.axis === 'column' ? columnCells(mounted, drag.held) : [...(mounted.lanes.get(drag.held)?.cells ?? [])];
};

export const dressCarried = (mounted: MountedTable, state: MeasuresState): void => {
  [...mounted.table.querySelectorAll('.carried')].forEach(cell => {
    cell.classList.remove('carried');
    if (cell instanceof HTMLElement) {
      cell.style.removeProperty('--carried-by');
    }
  });
  const offset = carriedOffset(state) ?? still;
  carriedCells(mounted, state).forEach(cell => {
    cell.classList.add('carried');
    cell.style.setProperty('--carried-by', `${offset.x}px ${offset.y}px`);
  });
};
