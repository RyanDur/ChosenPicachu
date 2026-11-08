import {maybe} from '@ryandur/sand';
import {Labelled, Report, TableColumn, TableStore} from '@components/DragSortableTable/model';
import {Measures} from '@pages/Demos/Market';

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

const columnOfHeader = (th: Element): string => maybe(th.getAttribute('data-column')).either(
  column => column,
  () => {
    throw new Error(`a sortable table’s header names no column: ${th.outerHTML.slice(0, th.outerHTML.indexOf('>') + 1)}`);
  });

export const mountedTable = {
  columnOfHeader
};
