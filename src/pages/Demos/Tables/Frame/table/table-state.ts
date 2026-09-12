import {Store} from '@components/store';
import {TableStore} from '@components/DragSortableTable/store';
import {Arrangement, ArrangementAction} from '@components/DragSortableTable/arrangement';
import {Landed} from '@components/DragSortableTable/report';

export type {TableState, Carry, Drag} from '@components/DragSortableTable/table-state';
export type {TableReducer} from '@components/DragSortableTable/reducer';
export type {TableAction} from '@components/DragSortableTable/actions';
export type {DemosStore, DemosMiddleware as Middleware} from '@pages/Demos/store';
export type {Landed} from '@components/DragSortableTable/report';
export type {Arrangement, ArrangementAction} from '@components/DragSortableTable/arrangement';
export {columnOf, seatOffset, settlingAt, settlingFromSeat, widthsOf} from '@components/DragSortableTable/table-state';
export {carrying, columnLandingAt, drifted, measured, released, rowLandingAt, tradedBy} from '@components/DragSortableTable/actions';
export {arrangementOf, arrangementReducer, columnMoved, rowMoved, sorted, standingOf} from '@components/DragSortableTable/arrangement';
export {tableStore} from '@components/DragSortableTable/store';
export {demosStore, feedRequested, selectMeasures} from '@pages/Demos/store';
export {moveReport} from '@components/DragSortableTable/report';

export type ArrangementStore = Store<Arrangement, ArrangementAction>;

export type MountedTable = {
  store: TableStore;
  order: () => readonly string[];
  standing: () => readonly string[];
  report: (landed: Landed) => void;
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: ReadonlyMap<string, HTMLTableRowElement>;
};

export const changed = <T>(before: readonly T[], after: readonly T[]): boolean =>
  before.length !== after.length || after.some((at, position) => before[position] !== at);
