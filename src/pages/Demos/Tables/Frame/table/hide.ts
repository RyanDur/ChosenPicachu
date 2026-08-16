import {maybe} from '@ryandur/sand';
import {MountedTable} from './table-state';

export const hideColumn = (mounted: MountedTable, column: string): void => {
  maybe(mounted.table.querySelector(`th.${column}`)).map(th => th.classList.add('hide'));
  mounted.lanes.forEach(lane => lane.cells[mounted.state().order.indexOf(column)].classList.add('hide-across'));
};

export const unhideColumn = (mounted: MountedTable, column: string): void => {
  maybe(mounted.table.querySelector(`th.${column}`)).map(th => th.classList.remove('hide'));
  mounted.lanes.forEach(lane => lane.cells[mounted.state().order.indexOf(column)].classList.remove('hide-across'));
};

export const hideRow = ({lanes}: MountedTable, row: number): void =>
  [...lanes[row].cells].forEach(cell => cell.classList.add('hide-across'));

export const unhideRow = ({lanes}: MountedTable, row: number): void =>
  [...lanes[row].cells].forEach(cell => cell.classList.remove('hide-across'));

export const veiled = {
  column: {veil: hideColumn, unveil: unhideColumn},
  row: {veil: hideRow, unveil: unhideRow}
};
