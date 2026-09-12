import {ColumnWidths} from '@components/Table/shares';
import {Carry, ColumnShove, RowShove, Settling} from './table-state';
import {Moving} from './travel';
import {Grab} from './lift';

export type TableAction =
  | {readonly type: 'measured'; readonly widths: ColumnWidths}
  | {readonly type: 'awoken'; readonly widths: ColumnWidths}
  | {readonly type: 'tradedBy'; readonly column: string; readonly neighbour: string; readonly delta: number}
  | {readonly type: 'carrying'; readonly carry: Carry; readonly grab: Grab}
  | {readonly type: 'drifted'; readonly moving: Moving}
  | {readonly type: 'columnLandingAt'; readonly neighbour?: string}
  | {readonly type: 'rowLandingAt'; readonly neighbour?: string}
  | {readonly type: 'released'}
  | {readonly type: 'dropped'; readonly carry: Carry; readonly from: Settling}
  | {readonly type: 'unsettled'; readonly target: Carry; readonly from: Settling}
  | {readonly type: 'settled'; readonly target: Carry}
  | {readonly type: 'shovedColumns'; readonly names: readonly string[]; readonly shove: ColumnShove}
  | {readonly type: 'shovedRows'; readonly keys: readonly string[]; readonly shove: RowShove}
  | {readonly type: 'columnMovedBeside'; readonly name: string; readonly neighbour: string; readonly widths: Readonly<Record<string, number>>; readonly order: readonly string[]}
  | {readonly type: 'columnWalkedTo'; readonly name: string; readonly to: number; readonly widths: Readonly<Record<string, number>>; readonly order: readonly string[]}
  | {readonly type: 'rowMovedBeside'; readonly row: string; readonly neighbour: string; readonly heights: Readonly<Record<string, number>>; readonly standing: readonly string[]}
  | {readonly type: 'rowWalkedTo'; readonly row: string; readonly to: number; readonly heights: Readonly<Record<string, number>>; readonly standing: readonly string[]};

type Action = TableAction;

export type Foreign = {readonly type: string};

const tableActions: Record<Action['type'], true> = {
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
  columnMovedBeside: true,
  columnWalkedTo: true,
  rowMovedBeside: true,
  rowWalkedTo: true
};

export const isTableAction = (action: Foreign): action is TableAction => action.type in tableActions;

export const measured = (widths: ColumnWidths): Action => ({type: 'measured', widths});
export const awoken = (widths: ColumnWidths): Action => ({type: 'awoken', widths});
export const tradedBy = (column: string, neighbour: string, delta: number): Action => ({type: 'tradedBy', column, neighbour, delta});
export const carrying = (carry: Carry, grab: Grab): Action => ({type: 'carrying', carry, grab});
export const drifted = (moving: Moving): Action => ({type: 'drifted', moving: {clientX: moving.clientX, clientY: moving.clientY}});
export const columnLandingAt = (neighbour?: string): Action => ({type: 'columnLandingAt', neighbour});
export const rowLandingAt = (neighbour?: string): Action => ({type: 'rowLandingAt', neighbour});
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
export const rowMovedBeside = (row: string, neighbour: string, heights: Readonly<Record<string, number>>, standing: readonly string[]): Action =>
  ({type: 'rowMovedBeside', row, neighbour, heights, standing});
export const rowWalkedTo = (row: string, to: number, heights: Readonly<Record<string, number>>, standing: readonly string[]): Action =>
  ({type: 'rowWalkedTo', row, to, heights, standing});
