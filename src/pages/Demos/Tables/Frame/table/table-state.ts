import {maybe} from '@ryandur/sand';
import {Labelled, Report, TableColumn, TableStore} from '@components/DragSortableTable/model';
import {Measures} from '@pages/Demos/Market';

export type {TableState, Carry} from '@components/DragSortableTable/model';
export type {Report} from '@components/DragSortableTable/model';
export {namedShare, orderAtLift, pointerHolds, seatOffset, settlingAt, settlingFromSeat, widthsOf} from '@components/DragSortableTable/model';
export {lifted, columnLandingFound, drifted, gripped, handleDragged, handleReleased, measured, released, rowLandingFound, arrowLifted, handleLeft, tradedBy} from '@components/DragSortableTable/model';
export {columnMoved, rowMoved, sorted} from '@components/DragSortableTable/model';
export {tableStore} from '@components/DragSortableTable/model';
export {marketActions, marketSelectors, marketStore} from '@pages/Demos/Market';
export {landingReport, moveReport} from '@components/DragSortableTable/model';

export type MountedTable = {
  store: TableStore;
  columns: () => readonly TableColumn<Labelled>[];
  rows: () => readonly Measures[];
  order: () => readonly string[];
  standing: () => readonly string[];
  report: (said: Report) => void;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: ReadonlyMap<string, HTMLTableRowElement>;
};

export type Given = {
  readonly columns: () => readonly TableColumn<Labelled>[];
  readonly rows: () => readonly Measures[];
};

export type Reconcile = (before: readonly TableColumn<Labelled>[]) => void;

export const columnOfHeader = (th: Element): string => maybe(th.getAttribute('data-column')).either(
  column => column,
  () => {
    throw new Error(`a sortable table’s header names no column: ${th.outerHTML.slice(0, th.outerHTML.indexOf('>') + 1)}`);
  });

export const changed = <T>(before: readonly T[], after: readonly T[]): boolean =>
  before.length !== after.length || after.some((at, position) => before[position] !== at);
