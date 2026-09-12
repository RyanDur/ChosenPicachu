import {ColumnShove, RowShove, Settling} from '@components/DragSortableTable/table-state';
import {MountedTable} from './table-state';

export const columnCells = (mounted: MountedTable, column: string): HTMLTableCellElement[] => {
  const at = mounted.order().indexOf(column);
  return [...mounted.table.rows].map(row => row.cells[at]);
};

const undressed = (cells: readonly HTMLTableCellElement[]): void =>
  cells.forEach(cell => {
    cell.classList.remove('settling', 'shoved-start', 'shoved-end', 'shoved-up', 'shoved-down');
    ['--settle-x', '--settle-y', '--settle-drift-x', '--settle-drift-y'].forEach(property => cell.style.removeProperty(property));
    cell.style.removeProperty('--shoved-by');
  });

export const unmarked = ({table}: MountedTable): void =>
  undressed([...table.querySelectorAll('.settling, .shoved-start, .shoved-end, .shoved-up, .shoved-down')]
    .filter(cell => cell instanceof HTMLTableCellElement));

const untilSettled = (cells: readonly HTMLTableCellElement[]): void =>
  cells[0]?.addEventListener('animationend', () => undressed(cells), {once: true});

const settling = (cells: readonly HTMLTableCellElement[], from: Settling): void => {
  cells.forEach(cell => {
    cell.style.setProperty('--settle-x', `${from.seat.x}px`);
    cell.style.setProperty('--settle-y', `${from.seat.y}px`);
    cell.style.setProperty('--settle-drift-x', `${from.drift.x}px`);
    cell.style.setProperty('--settle-drift-y', `${from.drift.y}px`);
    cell.classList.add('settling');
  });
  untilSettled(cells);
};

const shoving = (cells: readonly HTMLTableCellElement[], {toward, by}: ColumnShove | RowShove): void => {
  cells.forEach(cell => {
    cell.classList.remove('shoved-start', 'shoved-end', 'shoved-up', 'shoved-down');
    cell.style.setProperty('--shoved-by', `${by}px`);
    cell.classList.add(`shoved-${toward}`);
  });
  untilSettled(cells);
};

export const settleColumn = (mounted: MountedTable, column: string, from: Settling): void =>
  settling(columnCells(mounted, column), from);

export const settleRow = ({lanes}: MountedTable, row: string, from: Settling): void =>
  settling([...(lanes.get(row)?.cells ?? [])], from);

export const shoveColumns = (mounted: MountedTable, columns: readonly string[], shove: ColumnShove): void =>
  columns.forEach(column => shoving(columnCells(mounted, column), shove));

export const shoveRows = ({lanes}: MountedTable, rows: readonly string[], shove: RowShove): void =>
  rows.forEach(row => shoving([...(lanes.get(row)?.cells ?? [])], shove));
