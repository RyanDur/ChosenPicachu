import {ColumnShove, RowShove, Settling} from '@components/DragSortableTable/table-state';
import {MountedTable} from './table-state';

export const columnCells = (mounted: MountedTable, column: string): HTMLTableCellElement[] => {
  const at = mounted.order().indexOf(column);
  return [...mounted.table.rows].map(row => row.cells[at]);
};

type Toward = ColumnShove['toward'] | RowShove['toward'];

type Motion = 'carried' | 'settling' | `shoved-${Toward}`;

const shoveOf: Record<Toward, Motion> = {start: 'shoved-start', end: 'shoved-end', up: 'shoved-up', down: 'shoved-down'};
const shoves = Object.values(shoveOf);
const marks: readonly Motion[] = ['settling', ...shoves];
const motions: readonly Motion[] = ['carried', ...marks];

export const changeMotion = (cell: Element, {on = [], off = []}: {on?: readonly Motion[]; off?: readonly Motion[]}): void => {
  cell.classList.remove(...off);
  cell.classList.add(...on);
  cell.classList.toggle('paper-in-motion', motions.some(motion => cell.classList.contains(motion)));
};

const undressed = (cells: readonly HTMLTableCellElement[]): void =>
  cells.forEach(cell => {
    changeMotion(cell, {off: marks});
    ['--settle-x', '--settle-y', '--settle-drift-x', '--settle-drift-y'].forEach(property => cell.style.removeProperty(property));
    cell.style.removeProperty('--shoved-by');
  });

export const unmarked = ({table}: MountedTable): void =>
  undressed([...table.querySelectorAll(marks.map(mark => `.${mark}`).join(', '))]
    .filter(cell => cell instanceof HTMLTableCellElement));

const untilSettled = (cells: readonly HTMLTableCellElement[]): void =>
  cells[0]?.addEventListener('animationend', () => undressed(cells), {once: true});

const settling = (cells: readonly HTMLTableCellElement[], from: Settling): void => {
  cells.forEach(cell => {
    cell.style.setProperty('--settle-x', `${from.seat.x}px`);
    cell.style.setProperty('--settle-y', `${from.seat.y}px`);
    cell.style.setProperty('--settle-drift-x', `${from.drift.x}px`);
    cell.style.setProperty('--settle-drift-y', `${from.drift.y}px`);
    changeMotion(cell, {on: ['settling']});
  });
  untilSettled(cells);
};

const shoving = (cells: readonly HTMLTableCellElement[], {toward, by}: ColumnShove | RowShove): void => {
  cells.forEach(cell => {
    cell.style.setProperty('--shoved-by', `${by}px`);
    changeMotion(cell, {off: shoves, on: [shoveOf[toward]]});
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
