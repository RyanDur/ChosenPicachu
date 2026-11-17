import {Report} from './report';
import {maybe, Maybe, not, nothing, some} from '@ryandur/sand';
import {shares} from './shares';
import {TableColumn, ColumnDrag, ColumnShove, Labeled, Marks, RowDrag, RowShove, Settling, TableView, tableState} from './table-state';
import {survey} from './survey';
import {Drift} from './travel';

const order = ({columns}: TableView): readonly string[] => columns.map(({name}) => name);
const standing = ({rows}: TableView): readonly string[] => rows.map(({key}) => key);
const columns = ({columns}: TableView): readonly TableColumn<Labeled>[] => columns;

const columnNamed = (name: string) => ({columns}: TableView): Maybe<TableColumn<Labeled>> =>
  maybe(columns.find(column => column.name === name));

const unknownColumn = (name: string): TableColumn<Labeled> => ({name, data: {label: name}});

const widthOfColumn = (name: string) => ({state}: TableView): Maybe<number> =>
  maybe(state.widths).mBind(widths => maybe(widths[name]));

const namedShareOfColumn = (name: string) => ({state}: TableView): Maybe<number> =>
  tableState.namedShare(state, name);

const columnMarks = (name: string) => ({state}: TableView): Marks<ColumnShove> =>
  maybe(state.columnMarks[name]).orElse({});

const rowMarks = (key: string) => ({state}: TableView): Marks<RowShove> => maybe(state.rowMarks[key]).orElse({});

const positionOfColumn = (name: string) => (view: TableView): number => order(view).indexOf(name);

const positionOfRow = (key: string) => (view: TableView): number => standing(view).indexOf(key);

const columnCount = ({columns}: TableView): number => columns.length;
const rowCount = ({rows}: TableView): number => rows.length;

const columnTravels = (name: string) => (view: TableView): boolean =>
  not(survey.anchored(positionOfColumn(name)(view), columnCount(view)));

const neighborOfColumn = (name: string) => (view: TableView): string => shares.neighborOf(order(view), name);

const columnDrag = (name: string) => ({state}: TableView): Maybe<ColumnDrag> =>
  maybe(state.drag).mBind(drag => drag.axis === 'column' && drag.held === name ? some(drag) : nothing());

const rowDrag = (key: string) => ({state}: TableView): Maybe<RowDrag> =>
  maybe(state.drag).mBind(drag => drag.axis === 'row' && drag.held === key ? some(drag) : nothing());

const columnHeld = (name: string) => (view: TableView): boolean => not(columnDrag(name)(view).isNothing);

const columnGripped = (name: string) => ({state}: TableView): boolean => tableState.pointerHolds(state, name);

const report = ({state}: TableView): Maybe<Report> => maybe(state.report);

const rowHeld = (key: string) => (view: TableView): boolean => not(rowDrag(key)(view).isNothing);

const seatOffset = (view: TableView): Maybe<Drift> =>
  tableState.seatOffset(view.state, order(view), standing(view));

const seatOfColumn = (name: string) => (view: TableView): Maybe<Drift> =>
  columnHeld(name)(view) ? seatOffset(view) : nothing();

const seatOfRow = (key: string) => (view: TableView): Maybe<Drift> =>
  rowHeld(key)(view) ? seatOffset(view) : nothing();

const driftOfColumn = (name: string) => (view: TableView): Maybe<Drift> =>
  columnDrag(name)(view).map(drag => drag.drift);

const driftOfRow = (key: string) => (view: TableView): Maybe<Drift> =>
  rowDrag(key)(view).map(drag => drag.drift);

const settlingOfColumnIn = (name: string, order: readonly string[]) => (view: TableView): Maybe<Settling> =>
  columnDrag(name)(view).map(() => tableState.settlingAt(view.state, order, standing(view)));

const settlingOfRowIn = (key: string, standing: readonly string[]) => (view: TableView): Maybe<Settling> =>
  rowDrag(key)(view).map(() => tableState.settlingAt(view.state, order(view), standing));

export const tableReads = {
  order,
  standing,
  columns,
  columnNamed,
  unknownColumn,
  widthOfColumn,
  namedShareOfColumn,
  columnMarks,
  rowMarks,
  positionOfRow,
  columnCount,
  rowCount,
  columnTravels,
  neighborOfColumn,
  columnDrag,
  rowDrag,
  columnHeld,
  columnGripped,
  report,
  rowHeld,
  seatOfColumn,
  seatOfRow,
  driftOfColumn,
  driftOfRow,
  settlingOfColumnIn,
  settlingOfRowIn
};
