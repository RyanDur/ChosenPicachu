import {TableStore} from '@components/DragSortableTable/table-state';

export type {Aloft, Landed, TableState, TableStore, Transition} from '@components/DragSortableTable/table-state';
export {
  baked, columnAloft, columnLanding, columnOf, drifting, dropped, landedColumn, landedRow,
  dealtTableState, lifted, moveReport, nudgedTo, orderedTo, rowAloft, rowLanding, ruledBy, seatedBy, seatedTo, sharedAs, tableStore, tradedBy
} from '@components/DragSortableTable/table-state';

export type MountedTable = TableStore & {
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: readonly HTMLTableRowElement[];
};
