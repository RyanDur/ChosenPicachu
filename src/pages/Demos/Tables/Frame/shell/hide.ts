import {maybe} from '@ryandur/sand';
import {Shell} from './desk';

export const hideColumn = (shell: Shell, column: string): void => {
  maybe(shell.table.querySelector(`th.${column}`)).map(th => th.classList.add('hide'));
  shell.lanes.forEach(lane => lane.cells[shell.desk().order.indexOf(column)].classList.add('hide-across'));
};

export const unhideColumn = (shell: Shell, column: string): void => {
  maybe(shell.table.querySelector(`th.${column}`)).map(th => th.classList.remove('hide'));
  shell.lanes.forEach(lane => lane.cells[shell.desk().order.indexOf(column)].classList.remove('hide-across'));
};

export const hideRow = ({lanes}: Shell, row: number): void =>
  [...lanes[row].cells].forEach(cell => cell.classList.add('hide-across'));

export const unhideRow = ({lanes}: Shell, row: number): void =>
  [...lanes[row].cells].forEach(cell => cell.classList.remove('hide-across'));

export const veiled = {
  column: {veil: hideColumn, unveil: unhideColumn},
  row: {veil: hideRow, unveil: unhideRow}
};
