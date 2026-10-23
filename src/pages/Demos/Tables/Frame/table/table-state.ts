import {TableStore} from '@components/DragSortableTable/store';
import {Report} from '@components/DragSortableTable/report';
import {Labelled, TableColumn} from '@components/DragSortableTable/table-state';
import {Measures} from '@pages/Demos/Tables/Aggregations/cells';

export type {TableState, Carry} from '@components/DragSortableTable/table-state';
export type {Report} from '@components/DragSortableTable/report';
export {namedShare, orderAtLift, pointerHolds, seatOffset, settlingAt, settlingFromSeat, widthsOf} from '@components/DragSortableTable/table-state';
export {lifted, columnLandingFound, drifted, gripped, handleDragged, handleReleased, measured, released, rowLandingFound, arrowLifted, handleLeft, tradedBy} from '@components/DragSortableTable/actions';
export {columnMoved, rowMoved, sorted} from '@components/DragSortableTable/arrangement';
export {tableStore} from '@components/DragSortableTable/store';
export {demosStore, feedRequested, selectColumns, selectRows} from '@pages/Demos/store';
export {landingReport, moveReport} from '@components/DragSortableTable/report';

export type MountedTable = {
  host: HTMLElement;
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

export const columnOfHeader = (th: Element): string => th.classList.item(1) ?? '';

export const changed = <T>(before: readonly T[], after: readonly T[]): boolean =>
  before.length !== after.length || after.some((at, position) => before[position] !== at);
