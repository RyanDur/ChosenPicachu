import {ColumnWidths} from '@components/Table/shares';
import {Direction} from './sorting';
import {Carry, ColumnShove, RowShove} from './table-state';
import {Drift, Moving} from './travel';
import {Grab} from './lift';

export type TableAction =
  | {readonly type: 'orderedTo'; readonly from: number; readonly to: number}
  | {readonly type: 'seatedTo'; readonly held: string; readonly struck: string}
  | {readonly type: 'nudgedTo'; readonly held: string; readonly to: number}
  | {readonly type: 'baked'; readonly standing: readonly string[]}
  | {readonly type: 'ruledBy'; readonly name: string; readonly direction: Direction}
  | {readonly type: 'reset'; readonly arrival: readonly string[]}
  | {readonly type: 'seated'; readonly arrival: readonly string[]}
  | {readonly type: 'measured'; readonly widths: ColumnWidths}
  | {readonly type: 'awoken'; readonly widths: ColumnWidths}
  | {readonly type: 'tradedBy'; readonly column: string; readonly delta: number}
  | {readonly type: 'carrying'; readonly carry: Carry; readonly grab: Grab}
  | {readonly type: 'drifted'; readonly moving: Moving}
  | {readonly type: 'columnLandingAt'; readonly neighbour?: string}
  | {readonly type: 'rowLandingAt'; readonly neighbour?: string}
  | {readonly type: 'released'}
  | {readonly type: 'dropped'; readonly carry: Carry}
  | {readonly type: 'unsettled'; readonly target: Carry; readonly from: Drift}
  | {readonly type: 'settled'; readonly target: Carry}
  | {readonly type: 'shovedColumns'; readonly names: readonly string[]; readonly shove: ColumnShove}
  | {readonly type: 'shovedRows'; readonly seats: readonly string[]; readonly shove: RowShove}
  | {readonly type: 'rowLifted'; readonly seat: string; readonly grab: Grab; readonly standing: readonly string[]}
  | {readonly type: 'rowNudgedTo'; readonly seat: string; readonly to: number; readonly standing: readonly string[]}
  | {readonly type: 'columnMovedTo'; readonly name: string; readonly to: number; readonly widths: Readonly<Record<string, number>>}
  | {readonly type: 'columnMovedBeside'; readonly name: string; readonly neighbour: string; readonly widths: Readonly<Record<string, number>>}
  | {readonly type: 'columnWalkedTo'; readonly name: string; readonly to: number; readonly widths: Readonly<Record<string, number>>}
  | {readonly type: 'rowMovedBeside'; readonly seat: string; readonly neighbour: string; readonly heights: Readonly<Record<string, number>>}
  | {readonly type: 'rowWalkedTo'; readonly seat: string; readonly to: number; readonly heights: Readonly<Record<string, number>>; readonly standing: readonly string[]};

type Action = TableAction;

export type Foreign = {readonly type: string};

const tableActions: Record<Action['type'], true> = {
  orderedTo: true,
  seatedTo: true,
  nudgedTo: true,
  baked: true,
  ruledBy: true,
  reset: true,
  seated: true,
  measured: true,
  awoken: true,
  tradedBy: true,
  carrying: true,
  drifted: true,
  columnLandingAt: true,
  rowLandingAt: true,
  released: true,
  dropped: true,
  unsettled: true,
  settled: true,
  shovedColumns: true,
  shovedRows: true,
  rowLifted: true,
  rowNudgedTo: true,
  columnMovedTo: true,
  columnMovedBeside: true,
  columnWalkedTo: true,
  rowMovedBeside: true,
  rowWalkedTo: true
};

export const isTableAction = (action: Foreign): action is TableAction => action.type in tableActions;

export const orderedTo = (from: number, to: number): Action => ({type: 'orderedTo', from, to});
export const seatedTo = (held: string, struck: string): Action => ({type: 'seatedTo', held, struck});
export const nudgedTo = (held: string, to: number): Action => ({type: 'nudgedTo', held, to});
export const baked = (standing: readonly string[]): Action => ({type: 'baked', standing});
export const ruledBy = (name: string, direction: Direction): Action => ({type: 'ruledBy', name, direction});
export const reset = (arrival: readonly string[]): Action => ({type: 'reset', arrival});
export const seated = (arrival: readonly string[]): Action => ({type: 'seated', arrival});
export const measured = (widths: ColumnWidths): Action => ({type: 'measured', widths});
export const awoken = (widths: ColumnWidths): Action => ({type: 'awoken', widths});
export const tradedBy = (column: string, delta: number): Action => ({type: 'tradedBy', column, delta});
export const carrying = (carry: Carry, grab: Grab): Action => ({type: 'carrying', carry, grab});
export const drifted = (moving: Moving): Action => ({type: 'drifted', moving: {clientX: moving.clientX, clientY: moving.clientY}});
export const columnLandingAt = (neighbour?: string): Action => ({type: 'columnLandingAt', neighbour});
export const rowLandingAt = (neighbour?: string): Action => ({type: 'rowLandingAt', neighbour});
export const released = (): Action => ({type: 'released'});
export const dropped = (carry: Carry): Action => ({type: 'dropped', carry});
export const unsettled = (target: Carry, from: Drift): Action => ({type: 'unsettled', target, from});
export const settled = (target: Carry): Action => ({type: 'settled', target});
export const shovedColumns = (names: readonly string[], shove: ColumnShove): Action => ({type: 'shovedColumns', names, shove});
export const shovedRows = (seats: readonly string[], shove: RowShove): Action => ({type: 'shovedRows', seats, shove});
export const rowLifted = (seat: string, grab: Grab, standing: readonly string[]): Action => ({type: 'rowLifted', seat, grab, standing});
export const rowNudgedTo = (seat: string, to: number, standing: readonly string[]): Action => ({type: 'rowNudgedTo', seat, to, standing});
export const columnMovedTo = (name: string, to: number, widths: Readonly<Record<string, number>>): Action =>
  ({type: 'columnMovedTo', name, to, widths});
export const columnMovedBeside = (name: string, neighbour: string, widths: Readonly<Record<string, number>>): Action =>
  ({type: 'columnMovedBeside', name, neighbour, widths});
export const columnWalkedTo = (name: string, to: number, widths: Readonly<Record<string, number>>): Action =>
  ({type: 'columnWalkedTo', name, to, widths});
export const rowMovedBeside = (seat: string, neighbour: string, heights: Readonly<Record<string, number>>): Action =>
  ({type: 'rowMovedBeside', seat, neighbour, heights});
export const rowWalkedTo = (seat: string, to: number, heights: Readonly<Record<string, number>>, standing: readonly string[]): Action =>
  ({type: 'rowWalkedTo', seat, to, heights, standing});
