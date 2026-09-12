import {has, not} from '@ryandur/sand';
import {ColumnWidths, neighborOf} from '@components/Table/shares';
import {TableColumn, ColumnDrag, ColumnShove, Drag, Labelled, Marks, RowDrag, RowShove, Settling, seatOffset, settlingAt} from './table-state';
import {TableView} from './context';
import {anchored} from './survey';
import {Drift} from './travel';

export const selectOrder = ({columns}: TableView): readonly string[] => columns.map(({name}) => name);
export const selectStanding = ({rows}: TableView): readonly string[] => rows.map(({key}) => key);
export const selectWidths = ({state}: TableView): ColumnWidths | undefined => state.widths;
export const selectColumns = ({columns}: TableView): readonly TableColumn<Labelled>[] => columns;

export const columnNamed = (name: string) => ({columns}: TableView): TableColumn<Labelled> => {
  const found = columns.find(column => column.name === name);
  if (found === undefined) {
    throw new Error(`no column named ${name}`);
  }
  return found;
};

export const widthOfColumn = (name: string) => ({state}: TableView): number | undefined => state.widths?.[name];

export const columnMarks = (name: string) => ({state}: TableView): Marks<ColumnShove> => state.columnMarks[name] ?? {};

export const rowMarks = (key: string) => ({state}: TableView): Marks<RowShove> => state.rowMarks[key] ?? {};

export const positionOfColumn = (name: string) => (view: TableView): number => selectOrder(view).indexOf(name);

export const positionOfRow = (key: string) => (view: TableView): number => selectStanding(view).indexOf(key);

export const selectColumnCount = ({columns}: TableView): number => columns.length;
export const selectRowCount = ({rows}: TableView): number => rows.length;

export const columnTravels = (name: string) => (view: TableView): boolean =>
  not(anchored(positionOfColumn(name)(view), selectColumnCount(view)));

export const neighbourOfColumn = (name: string) => (view: TableView): string => neighborOf(selectOrder(view), name);

export const selectDrag = ({state}: TableView): Drag | undefined => state.drag;

export const columnDrag = (name: string) => ({state}: TableView): ColumnDrag | undefined =>
  state.drag?.axis === 'column' && state.drag.held === name ? state.drag : undefined;

export const rowDrag = (key: string) => ({state}: TableView): RowDrag | undefined =>
  state.drag?.axis === 'row' && state.drag.held === key ? state.drag : undefined;

export const columnHeld = (name: string) => (view: TableView): boolean => has(columnDrag(name)(view));

export const rowHeld = (key: string) => (view: TableView): boolean => has(rowDrag(key)(view));

export const selectSeatOffset = (view: TableView): Drift | undefined =>
  seatOffset(view.state, selectOrder(view), selectStanding(view));

export const seatOfColumn = (name: string) => (view: TableView): Drift | undefined =>
  columnHeld(name)(view) ? selectSeatOffset(view) : undefined;

export const seatOfRow = (key: string) => (view: TableView): Drift | undefined =>
  rowHeld(key)(view) ? selectSeatOffset(view) : undefined;

export const driftOfColumn = (name: string) => (view: TableView): Drift | undefined => columnDrag(name)(view)?.drift;

export const driftOfRow = (key: string) => (view: TableView): Drift | undefined => rowDrag(key)(view)?.drift;

export const settlingOfColumnIn = (name: string, order: readonly string[]) => (view: TableView): Settling | undefined =>
  columnHeld(name)(view) ? settlingAt(view.state, order, selectStanding(view)) : undefined;

export const settlingOfRowIn = (key: string, standing: readonly string[]) => (view: TableView): Settling | undefined =>
  rowHeld(key)(view) ? settlingAt(view.state, selectOrder(view), standing) : undefined;
