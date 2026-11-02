import {has, maybe, Maybe} from '@ryandur/sand';
import {columnUnder, displacedBetween, interior, PixelSizes, rowUnder, spanCrossed} from '@components/DragSortableTable/survey';
import {lazyTravel, Moving} from '@components/DragSortableTable/travel';
import {columnLift, Grab} from '@components/DragSortableTable/lift';
import {columnArrows, RowNudge} from '@components/DragSortableTable/arrows';
import {Labelled, TableColumn} from '@components/DragSortableTable/table-state';
import {
  Carry,
  columnLandingFound,
  columnOfHeader,
  drifted,
  landingReport,
  lifted,
  Given,
  MountedTable,
  Reconcile,
  orderAtLift,
  released,
  rowLandingFound,
  Report,
  settlingAt,
  settlingFromSeat,
  TableState,
  tableStore
} from '../table/table-state';
import {announceSort} from '../table/menus';
import {dressWidths} from '../table/resize';
import {settleColumn, settleRow, shoveColumns, shoveRows, unmarked} from '../table/settle';
import {carrying, dressCarried} from '../table/carry';
import {tell} from '../table/events';
import {arrangeColumns, headersOf, markGrips} from '../table/columns';
import {lanesOf, reseatRows, writeCells} from '../table/rows';
import {moveReportOf, report} from '../table/report';
import {TableContext} from '../table/context';
import {wireParts} from '../table/parts';

const columnShoving = (context: MountedTable, name: string, to: number, widths: PixelSizes): void => {
  const current = context.order();
  const from = current.indexOf(name);
  tell(context.table, 'column-moved', {column: name, to});
  shoveColumns(context, displacedBetween(current, from, to), {toward: to > from ? 'start' : 'end', by: widths[name] ?? 0});
};

const columnTo = (context: MountedTable, name: string, to: number, widths: PixelSizes): void => {
  const current = context.order();
  const from = current.indexOf(name);
  const over = spanCrossed(current, widths, from, to);
  columnShoving(context, name, to, widths);
  context.report({about: 'column', name, position: to, of: current.length});
  settleColumn(context, name, settlingFromSeat({x: to > from ? -over : over, y: 0}));
};

const columnBeside = (context: MountedTable, name: string, neighbour: string): void => {
  const current = context.order();
  columnShoving(context, name, interior(current.indexOf(neighbour), current.length), context.store.state.drag?.survey.columnWidths ?? {});
};

const rowShoving = (context: MountedTable, row: string, before: readonly string[], {to, heights}: Pick<RowNudge, 'to' | 'heights'>): void => {
  const from = before.indexOf(row);
  shoveRows(context, displacedBetween(before, from, to), {toward: to > from ? 'up' : 'down', by: heights[row] ?? 0});
};

const rowNudged = (context: MountedTable, row: string, {from, to, heights}: RowNudge): void => {
  const before = context.standing();
  rowShoving(context, row, before, {to, heights});
  settleRow(context, row, settlingFromSeat({x: 0, y: to > from ? -spanCrossed(before, heights, from, to) : spanCrossed(before, heights, from, to)}));
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
  landingReport(drag.axis, orderAtLift(drag), drag.held, {name: drag.held, order: drag.axis === 'column' ? order() : standing()}).map(context.report);
  const from = settlingAt(hand.state, order(), standing());
  hand.dispatch(released());
  if (drag.axis === 'column') {
    settleColumn(context, drag.held, from);
  } else {
    settleRow(context, drag.held, from);
  }
};

const moved = (context: MountedTable, moving: Moving): void => {
  const {store: hand, order, standing} = context;
  hand.dispatch(drifted(moving));
  const {drag} = hand.state;
  if (drag?.axis === 'column') {
    hand.dispatch(columnLandingFound(lazyTravel(columnUnder(order(), drag.survey))(drag.held, moving, drag.landing)));
  } else if (drag?.axis === 'row') {
    hand.dispatch(rowLandingFound(lazyTravel(rowUnder(standing(), drag.survey))(drag.held, moving, drag.landing)));
  }
};

const lift = (context: MountedTable, carry: Carry, grab: Grab): void => {
  unmarked(context);
  context.store.dispatch(lifted(carry, grab));
};

const dress = (context: MountedTable, previous: TableState, next: TableState): void => {
  if (previous.widths !== next.widths || previous.sizing !== next.sizing) {
    dressWidths(context);
  }
  if (previous.drag !== next.drag) {
    dressCarried(context, next);
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
  arrangeColumns(context);
  writeCells(context);
  reseatRows(context);
  dressCarried(context, context.store.state);
  announceSort(context, before);
};

const wired = (context: TableContext): void => {
  const {table, store: hand, order, standing} = context;
  hand.subscribe((previous, current) => dress(context, previous, current()));
  markGrips(table);
  wireParts(context);
  headersOf(table).forEach(th => {
    const held = columnOfHeader(th);
    th.addEventListener('pointerdown', columnLift(held, order, standing, grab => context.lifted({axis: 'column', held}, grab)));
    carrying(th, context);
    th.addEventListener('keydown', columnArrows(held, order, ({to, widths}) => columnTo(context, held, to, widths)));
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
