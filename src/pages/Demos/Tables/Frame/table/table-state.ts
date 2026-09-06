import {TableStore} from '@components/DragSortableTable/table-state';

export type {Aloft, Landed, TableState, TableStore, Transition} from '@components/DragSortableTable/table-state';
export {
  baked, columnAloft, columnLanding, columnOf, drifting, dropped, landedColumn, landedRow,
  dealtTableState, lifted, moveReport, nudgedTo, orderedTo, reseated, rowAloft, rowLanding, ruledBy, seatedTo, sharedAs, standingOf, tableStore, tradedBy
} from '@components/DragSortableTable/table-state';

export type MountedTable = TableStore & {
  standing: () => readonly number[];
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: readonly HTMLTableRowElement[];
};
