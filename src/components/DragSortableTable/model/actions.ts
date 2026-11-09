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
  | {readonly type: 'tradedBy'; readonly column: string; readonly neighbor: string; readonly delta: number}
  | {readonly type: 'gripped'; readonly column: string; readonly grip: Grip}
  | {readonly type: 'handleDragged'; readonly column: string; readonly neighbor: string; readonly clientX: number}
  | {readonly type: 'lifted'; readonly carry: Carry; readonly grab: Grab}
  | {readonly type: 'drifted'; readonly moving: Moving}
  | {readonly type: 'columnLandingFound'; readonly neighbor?: string}
  | {readonly type: 'rowLandingFound'; readonly neighbor?: string}
  | {readonly type: 'released'}
  | {readonly type: 'arrowLifted'; readonly column: string}
  | {readonly type: 'handleLeft'; readonly column: string}
  | {readonly type: 'handleReleased'; readonly column: string}
  | {readonly type: 'dropped'; readonly carry: Carry; readonly from: Settling; readonly landing: Landing}
  | {readonly type: 'unsettled'; readonly carry: Carry; readonly from: Settling}
  | {readonly type: 'settled'; readonly carry: Carry}
  | {readonly type: 'shovedColumns'; readonly names: readonly string[]; readonly shove: ColumnShove}
  | {readonly type: 'shovedRows'; readonly keys: readonly string[]; readonly shove: RowShove}
  | {readonly type: 'columnMovedBeside'; readonly name: string; readonly neighbor: string; readonly widths: PixelSizes; readonly order: readonly string[]}
  | {readonly type: 'columnWalkedTo'; readonly name: string; readonly to: number; readonly widths: PixelSizes; readonly order: readonly string[]}
  | {readonly type: 'rowMovedBeside'; readonly row: string; readonly label: string; readonly neighbor: string; readonly heights: PixelSizes; readonly standing: readonly string[]}
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
const tradedBy = (column: string, neighbor: string, delta: number): Action => ({type: 'tradedBy', column, neighbor, delta});
const gripped = (column: string, grip: Grip): Action => ({type: 'gripped', column, grip});
const handleDragged = (column: string, neighbor: string, clientX: number): Action => ({type: 'handleDragged', column, neighbor, clientX});
const lifted = (carry: Carry, grab: Grab): Action => ({type: 'lifted', carry, grab});
const drifted = (moving: Moving): Action => ({type: 'drifted', moving: {clientX: moving.clientX, clientY: moving.clientY}});
const columnLandingFound = (neighbor?: string): Action => ({type: 'columnLandingFound', neighbor});
const rowLandingFound = (neighbor?: string): Action => ({type: 'rowLandingFound', neighbor});
const released = (): Action => ({type: 'released'});
const arrowLifted = (column: string): Action => ({type: 'arrowLifted', column});
const handleLeft = (column: string): Action => ({type: 'handleLeft', column});
const handleReleased = (column: string): Action => ({type: 'handleReleased', column});
const dropped = (carry: Carry, from: Settling, landing: Landing): Action => ({type: 'dropped', carry, from, landing});
const unsettled = (carry: Carry, from: Settling): Action => ({type: 'unsettled', carry, from});
const settled = (carry: Carry): Action => ({type: 'settled', carry});
const shovedColumns = (names: readonly string[], shove: ColumnShove): Action => ({type: 'shovedColumns', names, shove});
const shovedRows = (keys: readonly string[], shove: RowShove): Action => ({type: 'shovedRows', keys, shove});
const columnMovedBeside = (
  name: string,
  neighbor: string,
  widths: PixelSizes,
  order: readonly string[]
): Action =>
  ({type: 'columnMovedBeside', name, neighbor, widths, order});
const columnWalkedTo = (name: string, to: number, widths: PixelSizes, order: readonly string[]): Action =>
  ({type: 'columnWalkedTo', name, to, widths, order});
type LabeledRow = {readonly row: string; readonly label: string};

const rowMovedBeside = (
  {row, label}: LabeledRow,
  neighbor: string,
  heights: PixelSizes,
  standing: readonly string[]
): Action =>
  ({type: 'rowMovedBeside', row, label, neighbor, heights, standing});
const rowWalkedTo = (
  {row, label}: LabeledRow,
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
