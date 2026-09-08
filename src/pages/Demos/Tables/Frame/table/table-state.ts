import {TableStore} from '@components/DragSortableTable/store';
import {TableState} from '@components/DragSortableTable/table-state';
import {Landed} from '@components/DragSortableTable/report';
import {Measured} from '@pages/Demos/Tables/Aggregations/cells';

export type {TableState, Column, Seat} from '@components/DragSortableTable/table-state';
export type {TableReducer} from '@components/DragSortableTable/reducer';
export type {TableAction} from '@components/DragSortableTable/actions';
export type {DemosStore, DemosMiddleware as Middleware} from '@pages/Demos/store';
export type {Landed} from '@components/DragSortableTable/report';
export type {Drag} from '@components/DragSortableTable/table-state';
export type {Carry} from '@components/DragSortableTable/table-state';
export {carriedOffset, columnOf, orderOf, standingOf, tableOf, widthsOf} from '@components/DragSortableTable/table-state';
export {baked, carrying, columnLandingAt, drifted, measured, orderedTo, released, reset, rowLandingAt, rowLifted, rowNudgedTo, ruledBy, seated, seatedTo, tradedBy} from '@components/DragSortableTable/actions';
export {selectStanding} from '@components/DragSortableTable/selectors';
export {tableStore} from '@components/DragSortableTable/store';
export {demosStore, feedRequested, selectMeasures} from '@pages/Demos/store';
export {moveReport} from '@components/DragSortableTable/report';

export type MeasuresState = TableState<Measured>;

export type MountedTable = {
  store: TableStore<Measured>;
  report: (landed: Landed) => void;
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: ReadonlyMap<string, HTMLTableRowElement>;
};

export const changed = <T>(before: readonly T[], after: readonly T[]): boolean =>
  before.length !== after.length || after.some((at, position) => before[position] !== at);

export const sortsOf = ({columns}: MeasuresState): readonly (string | undefined)[] => columns.map(({sorted}) => sorted);

export const widthsShown = ({columns}: MeasuresState): readonly (number | undefined)[] => columns.map(({width}) => width);
