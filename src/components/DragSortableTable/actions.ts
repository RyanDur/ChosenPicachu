import {Direction} from './sorting';
import {ColumnWidths, Grip} from '@components/Table/shares';
import {Carry, ColumnShove, RowShove, Settling} from './table-state';
import {Moving} from './travel';
import {Grab} from './lift';

export type TableAction =
  | {readonly type: 'measured'; readonly widths: ColumnWidths}
  | {readonly type: 'awoken'; readonly widths: ColumnWidths}
  | {readonly type: 'tradedBy'; readonly column: string; readonly neighbour: string; readonly delta: number}
  | {readonly type: 'gripped'; readonly column: string; readonly grip: Grip}
  | {readonly type: 'handleDragged'; readonly neighbour: string; readonly clientX: number}
  | {readonly type: 'lifted'; readonly carry: Carry; readonly grab: Grab}
  | {readonly type: 'drifted'; readonly moving: Moving}
  | {readonly type: 'columnLandingFound'; readonly neighbour?: string}
  | {readonly type: 'rowLandingFound'; readonly neighbour?: string}
  | {readonly type: 'released'}
  | {readonly type: 'dropped'; readonly carry: Carry; readonly from: Settling}
  | {readonly type: 'unsettled'; readonly target: Carry; readonly from: Settling}
  | {readonly type: 'settled'; readonly target: Carry}
  | {readonly type: 'shovedColumns'; readonly names: readonly string[]; readonly shove: ColumnShove}
  | {readonly type: 'shovedRows'; readonly keys: readonly string[]; readonly shove: RowShove}
  | {readonly type: 'columnMovedBeside'; readonly name: string; readonly neighbour: string; readonly widths: Readonly<Record<string, number>>; readonly order: readonly string[]}
  | {readonly type: 'columnWalkedTo'; readonly name: string; readonly to: number; readonly widths: Readonly<Record<string, number>>; readonly order: readonly string[]}
  | {readonly type: 'rowMovedBeside'; readonly row: string; readonly label: string; readonly neighbour: string; readonly heights: Readonly<Record<string, number>>; readonly standing: readonly string[]}
  | {readonly type: 'rowWalkedTo'; readonly row: string; readonly label: string; readonly to: number; readonly heights: Readonly<Record<string, number>>; readonly standing: readonly string[]}
  | {readonly type: 'sortChosen'; readonly column: string; readonly direction?: Direction};

type Action = TableAction;

export type Foreign = {readonly type: string};

const tableActions: Record<Action['type'], true> = {
  measured: true,
  awoken: true,
  tradedBy: true,
  gripped: true,
  handleDragged: true,
  lifted: true,
  drifted: true,
  columnLandingFound: true,
  rowLandingFound: true,
  released: true,
  dropped: true,
  unsettled: true,
  settled: true,
  shovedColumns: true,
  shovedRows: true,
  columnMovedBeside: true,
  columnWalkedTo: true,
  rowMovedBeside: true,
  rowWalkedTo: true,
  sortChosen: true
};

export const isTableAction = (action: Foreign): action is TableAction => action.type in tableActions;

export const measured = (widths: ColumnWidths): Action => ({type: 'measured', widths});
export const awoken = (widths: ColumnWidths): Action => ({type: 'awoken', widths});
export const tradedBy = (column: string, neighbour: string, delta: number): Action => ({type: 'tradedBy', column, neighbour, delta});
export const gripped = (column: string, grip: Grip): Action => ({type: 'gripped', column, grip});
export const handleDragged = (neighbour: string, clientX: number): Action => ({type: 'handleDragged', neighbour, clientX});
export const lifted = (carry: Carry, grab: Grab): Action => ({type: 'lifted', carry, grab});
export const drifted = (moving: Moving): Action => ({type: 'drifted', moving: {clientX: moving.clientX, clientY: moving.clientY}});
export const columnLandingFound = (neighbour?: string): Action => ({type: 'columnLandingFound', neighbour});
export const rowLandingFound = (neighbour?: string): Action => ({type: 'rowLandingFound', neighbour});
export const released = (): Action => ({type: 'released'});
export const dropped = (carry: Carry, from: Settling): Action => ({type: 'dropped', carry, from});
export const unsettled = (target: Carry, from: Settling): Action => ({type: 'unsettled', target, from});
export const settled = (target: Carry): Action => ({type: 'settled', target});
export const shovedColumns = (names: readonly string[], shove: ColumnShove): Action => ({type: 'shovedColumns', names, shove});
export const shovedRows = (keys: readonly string[], shove: RowShove): Action => ({type: 'shovedRows', keys, shove});
export const columnMovedBeside = (name: string, neighbour: string, widths: Readonly<Record<string, number>>, order: readonly string[]): Action =>
  ({type: 'columnMovedBeside', name, neighbour, widths, order});
export const columnWalkedTo = (name: string, to: number, widths: Readonly<Record<string, number>>, order: readonly string[]): Action =>
  ({type: 'columnWalkedTo', name, to, widths, order});
type LabelledRow = {readonly row: string; readonly label: string};

export const rowMovedBeside = ({row, label}: LabelledRow, neighbour: string, heights: Readonly<Record<string, number>>, standing: readonly string[]): Action =>
  ({type: 'rowMovedBeside', row, label, neighbour, heights, standing});
export const rowWalkedTo = ({row, label}: LabelledRow, to: number, heights: Readonly<Record<string, number>>, standing: readonly string[]): Action =>
  ({type: 'rowWalkedTo', row, label, to, heights, standing});
export const sortChosen = (column: string, direction?: Direction): Action => ({type: 'sortChosen', column, direction});
