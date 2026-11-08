import {Direction} from './sorting';
import {ColumnWidths, Grip} from './shares';
import {Carry, ColumnShove, RowShove, Settling} from './table-state';
import {Moving} from './travel';
import {PixelSizes} from './survey';
import {Grab} from './lift';

import {Landing} from './report';

export type TableAction =
  | {readonly type: 'measured'; readonly widths: ColumnWidths; readonly floors: ColumnWidths}
  | {readonly type: 'awoken'; readonly widths: ColumnWidths; readonly floors: ColumnWidths}
  | {readonly type: 'tradedBy'; readonly column: string; readonly neighbour: string; readonly delta: number}
  | {readonly type: 'gripped'; readonly column: string; readonly grip: Grip}
  | {readonly type: 'handleDragged'; readonly column: string; readonly neighbour: string; readonly clientX: number}
  | {readonly type: 'lifted'; readonly carry: Carry; readonly grab: Grab}
  | {readonly type: 'drifted'; readonly moving: Moving}
  | {readonly type: 'columnLandingFound'; readonly neighbour?: string}
  | {readonly type: 'rowLandingFound'; readonly neighbour?: string}
  | {readonly type: 'released'}
  | {readonly type: 'arrowLifted'; readonly column: string}
  | {readonly type: 'handleLeft'; readonly column: string}
  | {readonly type: 'handleReleased'; readonly column: string}
  | {readonly type: 'dropped'; readonly carry: Carry; readonly from: Settling; readonly landing: Landing}
  | {readonly type: 'unsettled'; readonly target: Carry; readonly from: Settling}
  | {readonly type: 'settled'; readonly target: Carry}
  | {readonly type: 'shovedColumns'; readonly names: readonly string[]; readonly shove: ColumnShove}
  | {readonly type: 'shovedRows'; readonly keys: readonly string[]; readonly shove: RowShove}
  | {readonly type: 'columnMovedBeside'; readonly name: string; readonly neighbour: string; readonly widths: PixelSizes; readonly order: readonly string[]}
  | {readonly type: 'columnWalkedTo'; readonly name: string; readonly to: number; readonly widths: PixelSizes; readonly order: readonly string[]}
  | {readonly type: 'rowMovedBeside'; readonly row: string; readonly label: string; readonly neighbour: string; readonly heights: PixelSizes; readonly standing: readonly string[]}
  | {readonly type: 'rowWalkedTo'; readonly row: string; readonly label: string; readonly to: number; readonly heights: PixelSizes; readonly standing: readonly string[]}
  | {readonly type: 'sortChosen'; readonly column: string; readonly direction?: Direction};

type Action = TableAction;

export type Foreign = {readonly type: string};

const actionTypes: Record<Action['type'], true> = {
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
  arrowLifted: true,
  handleLeft: true,
  handleReleased: true,
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

const recognizes = (action: Foreign): action is TableAction => action.type in actionTypes;

const measured = (widths: ColumnWidths, floors: ColumnWidths): Action => ({type: 'measured', widths, floors});
const awoken = (widths: ColumnWidths, floors: ColumnWidths): Action => ({type: 'awoken', widths, floors});
const tradedBy = (column: string, neighbour: string, delta: number): Action => ({type: 'tradedBy', column, neighbour, delta});
const gripped = (column: string, grip: Grip): Action => ({type: 'gripped', column, grip});
const handleDragged = (column: string, neighbour: string, clientX: number): Action => ({type: 'handleDragged', column, neighbour, clientX});
const lifted = (carry: Carry, grab: Grab): Action => ({type: 'lifted', carry, grab});
const drifted = (moving: Moving): Action => ({type: 'drifted', moving: {clientX: moving.clientX, clientY: moving.clientY}});
const columnLandingFound = (neighbour?: string): Action => ({type: 'columnLandingFound', neighbour});
const rowLandingFound = (neighbour?: string): Action => ({type: 'rowLandingFound', neighbour});
const released = (): Action => ({type: 'released'});
const arrowLifted = (column: string): Action => ({type: 'arrowLifted', column});
const handleLeft = (column: string): Action => ({type: 'handleLeft', column});
const handleReleased = (column: string): Action => ({type: 'handleReleased', column});
const dropped = (carry: Carry, from: Settling, landing: Landing): Action => ({type: 'dropped', carry, from, landing});
const unsettled = (target: Carry, from: Settling): Action => ({type: 'unsettled', target, from});
const settled = (target: Carry): Action => ({type: 'settled', target});
const shovedColumns = (names: readonly string[], shove: ColumnShove): Action => ({type: 'shovedColumns', names, shove});
const shovedRows = (keys: readonly string[], shove: RowShove): Action => ({type: 'shovedRows', keys, shove});
const columnMovedBeside = (
  name: string,
  neighbour: string,
  widths: PixelSizes,
  order: readonly string[]
): Action =>
  ({type: 'columnMovedBeside', name, neighbour, widths, order});
const columnWalkedTo = (name: string, to: number, widths: PixelSizes, order: readonly string[]): Action =>
  ({type: 'columnWalkedTo', name, to, widths, order});
type LabelledRow = {readonly row: string; readonly label: string};

const rowMovedBeside = (
  {row, label}: LabelledRow,
  neighbour: string,
  heights: PixelSizes,
  standing: readonly string[]
): Action =>
  ({type: 'rowMovedBeside', row, label, neighbour, heights, standing});
const rowWalkedTo = (
  {row, label}: LabelledRow,
  to: number,
  heights: PixelSizes,
  standing: readonly string[]
): Action =>
  ({type: 'rowWalkedTo', row, label, to, heights, standing});
const sortChosen = (column: string, direction?: Direction): Action => ({type: 'sortChosen', column, direction});

export const tableActions = {
  recognizes,
  measured,
  awoken,
  tradedBy,
  gripped,
  handleDragged,
  lifted,
  drifted,
  columnLandingFound,
  rowLandingFound,
  released,
  arrowLifted,
  handleLeft,
  handleReleased,
  dropped,
  unsettled,
  settled,
  shovedColumns,
  shovedRows,
  columnMovedBeside,
  columnWalkedTo,
  rowMovedBeside,
  rowWalkedTo,
  sortChosen
};
