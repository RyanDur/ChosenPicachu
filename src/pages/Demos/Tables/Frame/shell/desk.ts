import {Desk} from '@components/DragSortableTable/desk';

export type {Aloft, Desk} from '@components/DragSortableTable/desk';
export {
  baked, columnAloft, columnLanding, columnOf, drifting, dropped, landedColumn, landedRow,
  lifted, nudgedTo, orderedTo, rowAloft, rowLanding, ruledBy, seatedTo, sharedAs, standingOf, tradedBy
} from '@components/DragSortableTable/desk';

export type Shell = {
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: readonly HTMLTableRowElement[];
  desk: () => Desk;
  commit: (transition: (desk: Desk) => Desk) => void;
};
