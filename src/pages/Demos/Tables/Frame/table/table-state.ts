import {TableState} from '@components/DragSortableTable/table-state';

export type {Aloft, TableState} from '@components/DragSortableTable/table-state';
export {
  baked, columnAloft, columnLanding, columnOf, drifting, dropped, landedColumn, landedRow,
  lifted, nudgedTo, orderedTo, rowAloft, rowLanding, ruledBy, seatedTo, sharedAs, standingOf, tradedBy
} from '@components/DragSortableTable/table-state';

export type MountedTable = {
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: readonly HTMLTableRowElement[];
  state: () => TableState;
  commit: (transition: (state: TableState) => TableState) => void;
};
