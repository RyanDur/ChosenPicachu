import {has, maybe, Maybe} from '@ryandur/sand';
import {arrows, Grab, Labelled, Moving, PixelSizes, RowNudge, TableColumn, Carry, Report, TableState, tableStore, tableActions, tableState, survey, travel, lifting, tableReports} from '@components/DragSortableTable/model';
import {
  announceSort,
  dressWidths,
  Given,
  lanesOf,
  MountedTable,
  moveReportOf,
  Reconcile,
  report,
  reseatRows,
  settleColumn,
  settleRow,
  shoveColumns,
  shoveRows,
  TableContext,
  tell,
  unmarked,
  wireParts,
  writeCells,
  mountedTable,
  carry,
  frameColumns
} from '../table';

const columnShoving = (context: MountedTable, name: string, to: number, widths: PixelSizes): void => {
  const current = context.order();
  const from = current.indexOf(name);
  tell(context.table, 'column-moved', {column: name, to});
  shoveColumns(context, survey.displacedBetween(current, from, to), {toward: to > from ? 'start' : 'end', by: widths[name] ?? 0});
};

const columnTo = (context: MountedTable, name: string, to: number, widths: PixelSizes): void => {
  const current = context.order();
  const from = current.indexOf(name);
  const over = survey.spanCrossed(current, widths, from, to);
  columnShoving(context, name, to, widths);
  context.report({about: 'column', name, position: to, of: current.length});
  settleColumn(context, name, tableState.settlingFromSeat({x: to > from ? -over : over, y: 0}));
};

const columnBeside = (context: MountedTable, name: string, neighbour: string): void => {
  const current = context.order();
  columnShoving(context, name, survey.interior(current.indexOf(neighbour), current.length),
    context.store.state.drag?.survey.columnWidths ?? {});
};

const rowShoving = (context: MountedTable, row: string, before: readonly string[], {to, heights}: Pick<RowNudge, 'to' | 'heights'>): void => {
  const from = before.indexOf(row);
  shoveRows(context, survey.displacedBetween(before, from, to), {toward: to > from ? 'up' : 'down', by: heights[row] ?? 0});
};

const rowNudged = (context: MountedTable, row: string, {from, to, heights}: RowNudge): void => {
  const before = context.standing();
  rowShoving(context, row, before, {to, heights});
  settleRow(context, row, tableState.settlingFromSeat({
    x: 0,
    y: to > from ? -survey.spanCrossed(before, heights, from, to) : survey.spanCrossed(before, heights, from, to)
  }));
};

const rowTo = (context: MountedTable, row: string, to: number): void => {
  const before = context.standing();
  tell(context.table, 'row-moved', {row, to, standing: before});
  context.report({about: 'row', name: row, position: to, of: before.length});
};

const rowBeside = (context: MountedTable, row: string, neighbour: string): void => {
  const before = context.standing();
  const to = before.indexOf(neighbour);
  tell(context.table, 'row-moved', {row, to, standing: before});
  rowShoving(context, row, before, {to, heights: context.store.state.drag?.survey.rowHeights ?? {}});
};

const landed = (context: MountedTable): void => {
  const {drag} = context.store.state;
  if (drag?.axis === 'column' && has(drag.landing)) {
    columnBeside(context, drag.held, drag.landing);
  } else if (drag?.axis === 'row' && has(drag.landing)) {
    rowBeside(context, drag.held, drag.landing);
  }
};

const drop = (context: MountedTable): void => {
  const {store: hand, order, standing} = context;
  const {drag} = hand.state;
  if (!has(drag)) {
    return;
  }
  landed(context);
  tableReports.landing(drag.axis, tableState.orderAtLift(drag), drag.held, {name: drag.held, order: drag.axis === 'column' ? order() : standing()}).map(context.report);
  const from = tableState.settlingAt(hand.state, order(), standing());
  hand.dispatch(tableActions.released());
  if (drag.axis === 'column') {
    settleColumn(context, drag.held, from);
  } else {
    settleRow(context, drag.held, from);
  }
};

const moved = (context: MountedTable, moving: Moving): void => {
  const {store: hand, order, standing} = context;
  hand.dispatch(tableActions.drifted(moving));
  const {drag} = hand.state;
  if (drag?.axis === 'column') {
    const landing = travel.lazy(survey.columnUnder(order(), drag.survey))(drag.held, moving, drag.landing);
    hand.dispatch(tableActions.columnLandingFound(landing));
  } else if (drag?.axis === 'row') {
    const landing = travel.lazy(survey.rowUnder(standing(), drag.survey))(drag.held, moving, drag.landing);
    hand.dispatch(tableActions.rowLandingFound(landing));
  }
};

const lift = (context: MountedTable, carry: Carry, grab: Grab): void => {
  unmarked(context);
  context.store.dispatch(tableActions.lifted(carry, grab));
};

const dress = (context: MountedTable, previous: TableState, next: TableState): void => {
  if (previous.widths !== next.widths || previous.sizing !== next.sizing) {
    dressWidths(context);
  }
  if (previous.drag !== next.drag) {
    carry.dress(context, next);
  }
};

const withVerbs = (parts: MountedTable): TableContext => {
  const context: TableContext = {
    ...parts,
    lifted: (carry, grab) => lift(context, carry, grab),
    moved: moving => moved(context, moving),
    dropped: () => drop(context),
    rowNudged: (row, nudge) => rowNudged(context, row, nudge),
    rowMoved: (row, to) => rowTo(context, row, to)
  };
  return context;
};

const reconciled = (context: MountedTable, before: readonly TableColumn<Labelled>[]): void => {
  frameColumns.arrange(context);
  writeCells(context);
  reseatRows(context);
  carry.dress(context, context.store.state);
  announceSort(context, before);
};

const wired = (context: TableContext): void => {
  const {table, store: hand, order, standing} = context;
  hand.subscribe((previous, current) => dress(context, previous, current()));
  frameColumns.markGrips(table);
  wireParts(context);
  frameColumns.headers(table).forEach(th => {
    const held = mountedTable.columnOfHeader(th);
    th.addEventListener('pointerdown', lifting.column(held, order, standing, grab => context.lifted({axis: 'column', held}, grab)));
    carry.follow(th, context);
    th.addEventListener('keydown', arrows.column(held, order, ({to, widths}) => columnTo(context, held, to, widths)));
  });
};

export const dragSortable = (table: HTMLTableElement, {columns, rows}: Given): Reconcile => {
  const hand = tableStore();
  const output = moveReportOf(table);
  const context = (): Maybe<TableContext> => maybe(table.tBodies.item(0)).map(body => withVerbs({
    store: hand,
    columns,
    rows,
    order: () => columns().map(({name}) => name),
    standing: () => rows().map(row => row.window.display),
    report: (said: Report) => output.map(found => report(found, said)),
    table,
    body,
    lanes: lanesOf(body)
  }));
  context().map(wired);
  return before => context().map(mounted => reconciled(mounted, before));
};
