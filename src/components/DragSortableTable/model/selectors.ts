import {Report} from './report';
import {has, maybe, Maybe, not} from '@ryandur/sand';
import {neighborOf} from '@components/Table';
import {TableColumn, ColumnDrag, ColumnShove, Labelled, Marks, RowDrag, RowShove, Settling, TableView, tableState} from './table-state';
import {survey} from './survey';
import {Drift} from './travel';

const selectOrder = ({columns}: TableView): readonly string[] => columns.map(({name}) => name);
const selectStanding = ({rows}: TableView): readonly string[] => rows.map(({key}) => key);
const selectColumns = ({columns}: TableView): readonly TableColumn<Labelled>[] => columns;

const columnNamed = (name: string) => ({columns}: TableView): Maybe<TableColumn<Labelled>> =>
  maybe(columns.find(column => column.name === name));

const unknownColumn = (name: string): TableColumn<Labelled> => ({name, data: {label: name}});

const widthOfColumn = (name: string) => ({state}: TableView): number | undefined => state.widths?.[name];

const namedShareOfColumn = (name: string) => ({state}: TableView): number | undefined =>
  tableState.namedShare(state, name);

const columnMarks = (name: string) => ({state}: TableView): Marks<ColumnShove> => state.columnMarks[name] ?? {};

const rowMarks = (key: string) => ({state}: TableView): Marks<RowShove> => state.rowMarks[key] ?? {};

const positionOfColumn = (name: string) => (view: TableView): number => selectOrder(view).indexOf(name);

const positionOfRow = (key: string) => (view: TableView): number => selectStanding(view).indexOf(key);

const selectColumnCount = ({columns}: TableView): number => columns.length;
const selectRowCount = ({rows}: TableView): number => rows.length;

const columnTravels = (name: string) => (view: TableView): boolean =>
  not(survey.anchored(positionOfColumn(name)(view), selectColumnCount(view)));

const neighbourOfColumn = (name: string) => (view: TableView): string => neighborOf(selectOrder(view), name);

const columnDrag = (name: string) => ({state}: TableView): ColumnDrag | undefined =>
  state.drag?.axis === 'column' && state.drag.held === name ? state.drag : undefined;

const rowDrag = (key: string) => ({state}: TableView): RowDrag | undefined =>
  state.drag?.axis === 'row' && state.drag.held === key ? state.drag : undefined;

const columnHeld = (name: string) => (view: TableView): boolean => has(columnDrag(name)(view));

const columnGripped = (name: string) => ({state}: TableView): boolean => tableState.pointerHolds(state, name);

const selectReport = ({state}: TableView): Maybe<Report> => maybe(state.report);

const rowHeld = (key: string) => (view: TableView): boolean => has(rowDrag(key)(view));

const selectSeatOffset = (view: TableView): Drift | undefined =>
  tableState.seatOffset(view.state, selectOrder(view), selectStanding(view));

const seatOfColumn = (name: string) => (view: TableView): Drift | undefined =>
  columnHeld(name)(view) ? selectSeatOffset(view) : undefined;

const seatOfRow = (key: string) => (view: TableView): Drift | undefined =>
  rowHeld(key)(view) ? selectSeatOffset(view) : undefined;

const driftOfColumn = (name: string) => (view: TableView): Drift | undefined => columnDrag(name)(view)?.drift;

const driftOfRow = (key: string) => (view: TableView): Drift | undefined => rowDrag(key)(view)?.drift;

const settlingOfColumnIn = (name: string, order: readonly string[]) => (view: TableView): Settling | undefined =>
  columnHeld(name)(view) ? tableState.settlingAt(view.state, order, selectStanding(view)) : undefined;

const settlingOfRowIn = (key: string, standing: readonly string[]) => (view: TableView): Settling | undefined =>
  rowHeld(key)(view) ? tableState.settlingAt(view.state, selectOrder(view), standing) : undefined;

export const tableSelectors = {
  selectOrder,
  selectStanding,
  selectColumns,
  columnNamed,
  unknownColumn,
  widthOfColumn,
  namedShareOfColumn,
  columnMarks,
  rowMarks,
  positionOfRow,
  selectColumnCount,
  selectRowCount,
  columnTravels,
  neighbourOfColumn,
  columnDrag,
  rowDrag,
  columnHeld,
  columnGripped,
  selectReport,
  rowHeld,
  seatOfColumn,
  seatOfRow,
  driftOfColumn,
  driftOfRow,
  settlingOfColumnIn,
  settlingOfRowIn
};
