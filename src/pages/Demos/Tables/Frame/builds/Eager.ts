import {has, maybe, Maybe} from '@ryandur/sand';
import {Direction} from '@components/DragSortableTable/sorting';
import {
  columnUnder,
  displacedBetween,
  interior,
  rowUnder,
  spanCrossed
} from '@components/DragSortableTable/survey';
import {eagerTravel, Moving, pointerTravel} from '@components/DragSortableTable/travel';
import {columnLift, Grab, rowLift} from '@components/DragSortableTable/lift';
import {columnArrows, rowArrows} from '@components/DragSortableTable/arrows';
import {Labelled, TableColumn} from '@components/DragSortableTable/table-state';
import {
  Carry,
  columnOfHeader,
  drifted,
  landingReport,
  Report,
  lifted,
  MountedTable,
  orderAtLift,
  released,
  settlingAt,
  settlingFromSeat,
  TableState,
  tableStore
} from '../table/table-state';
import {announceSort, wireMenu} from '../table/menus';
import {dressWidths, wireResize} from '../table/resize';
import {settleColumn, settleRow, shoveColumns, shoveRows, unmarked} from '../table/settle';
import {dressCarried} from '../table/carry';
import {tell} from '../table/events';
import {Measures} from '@pages/Demos/Tables/Aggregations/cells';
import {arrangeColumns, headersOf, markGrips, sortableOf} from '../table/columns';
import {lanesOf, reseatRows, writeCells} from '../table/rows';
import {report} from '../table/report';

const arranged = (context: MountedTable, before: readonly TableColumn<Labelled>[]): void => {
  arrangeColumns(context);
  reseatRows(context);
  dressCarried(context, context.store.state);
  announceSort(context, before);
};

const seated = (context: MountedTable): void => {
  writeCells(context);
  reseatRows(context);
};

const wired = (context: MountedTable): void => {
  const {host, table, lanes, store: hand, order: columns, standing} = context;

  const columnShoving = (name: string, to: number, widths: Readonly<Record<string, number>>): void => {
    const current = columns();
    const from = current.indexOf(name);
    tell(host, 'column-moved', {column: name, to});
    shoveColumns(context, displacedBetween(current, from, to), {toward: to > from ? 'start' : 'end', by: widths[name] ?? 0});
  };
  const columnTo = (name: string, to: number, widths: Readonly<Record<string, number>>): void => {
    const current = columns();
    const from = current.indexOf(name);
    const over = spanCrossed(current, widths, from, to);
    columnShoving(name, to, widths);
    context.report({about: 'column', name, position: to, of: current.length});
    settleColumn(context, name, settlingFromSeat({x: to > from ? -over : over, y: 0}));
  };
  const columnBeside = (name: string, neighbour: string): void => {
    const current = columns();
    columnShoving(name, interior(current.indexOf(neighbour), current.length), hand.state.drag?.survey.columnWidths ?? {});
  };
  const rowShoving = (row: string, before: readonly string[], to: number, heights: Readonly<Record<string, number>>): void => {
    const from = before.indexOf(row);
    shoveRows(context, displacedBetween(before, from, to), {toward: to > from ? 'up' : 'down', by: heights[row] ?? 0});
  };
  const rowNudged = (row: string, from: number, to: number, heights: Readonly<Record<string, number>>): void => {
    const before = standing();
    rowShoving(row, before, to, heights);
    settleRow(context, row, settlingFromSeat({x: 0, y: to > from ? -spanCrossed(before, heights, from, to) : spanCrossed(before, heights, from, to)}));
  };
  const rowTo = (row: string, to: number): void => {
    const before = standing();
    tell(host, 'row-moved', {row, to, standing: before});
    context.report({about: 'row', name: row, position: to, of: before.length});
  };
  const rowBeside = (row: string, neighbour: string): void => {
    const before = standing();
    const to = before.indexOf(neighbour);
    tell(host, 'row-moved', {row, to, standing: before});
    rowShoving(row, before, to, hand.state.drag?.survey.rowHeights ?? {});
  };

  const dress = (previous: TableState, next: TableState): void => {
    if (previous.widths !== next.widths || previous.sizing !== next.sizing) {
      dressWidths(context);
    }
    if (previous.drag !== next.drag) {
      dressCarried(context, next);
    }
  };
  hand.subscribe((previous, current) => dress(previous, current()));

  const drop = (): void => {
    const {drag} = hand.state;
    if (!has(drag)) {
      return;
    }
    landingReport(drag.axis, orderAtLift(drag), drag.held, {name: drag.held, order: drag.axis === 'column' ? columns() : standing()}).map(context.report);
    const from = settlingAt(hand.state, columns(), standing());
    hand.dispatch(released());
    if (drag.axis === 'column') {
      settleColumn(context, drag.held, from);
    } else {
      settleRow(context, drag.held, from);
    }
  };

  const moved = (moving: Moving): void => {
    hand.dispatch(drifted(moving));
    const {drag} = hand.state;
    if (drag?.axis === 'column') {
      eagerTravel(columnUnder(columns(), drag.survey), drag.held, neighbour => columnBeside(drag.held, neighbour))(moving);
    } else if (drag?.axis === 'row') {
      eagerTravel(rowUnder(standing(), drag.survey), drag.held, neighbour => rowBeside(drag.held, neighbour))(moving);
    }
  };

  const lift = (carry: Carry, grab: Grab): void => {
    unmarked(context);
    hand.dispatch(lifted(carry, grab));
  };

  const wireCarry = (holder: HTMLElement): void => {
    ['pointermove', 'lostpointercapture'].forEach(travelling => holder.addEventListener(travelling, event => {
      if (event instanceof PointerEvent && has(hand.state.drag)) {
        pointerTravel(moved, drop)(event);
      }
    }));
    ['pointerup', 'pointercancel'].forEach(ending => holder.addEventListener(ending, drop));
  };

  const choose = (column: string) => (direction?: Direction): void => {
    tell(host, 'sorted', {column, direction});
    context.report({about: 'sort', name: column, direction});
  };

  sortableOf(table).forEach(column => wireMenu(table, column, choose(column)));
  wireResize(context);
  [...table.querySelectorAll('.menu-toggle, .menu')].forEach(chrome =>
    chrome.addEventListener('pointerdown', event => event.stopPropagation()));

  const wireColumnGrip = (th: HTMLTableCellElement): void => {
    const held = columnOfHeader(th);

    th.addEventListener('pointerdown', columnLift(held, columns, standing, grab => lift({axis: 'column', held}, grab)));
    wireCarry(th);
    th.addEventListener('keydown', columnArrows(held, columns, ({to, widths}) => columnTo(held, to, widths)));
  };

  const wireRowGrip = (held: string, grip: HTMLButtonElement): void => {
    grip.addEventListener('pointerdown', rowLift(columns, standing, grab => lift({axis: 'row', held}, grab)));
    wireCarry(grip);
    grip.addEventListener('keydown', rowArrows(held, standing, {nudged: ({from, to, heights}) => rowNudged(held, from, to, heights), moved: ({to}) => rowTo(held, to)}));
  };

  markGrips(table);
  headersOf(table).forEach(wireColumnGrip);
  lanes.forEach((lane, held) =>
    [...lane.querySelectorAll('button.grip')]
      .filter(grip => grip instanceof HTMLButtonElement)
      .forEach(grip => wireRowGrip(held, grip)));
};

export class DragSortableTable extends HTMLElement {
  readonly #hand = tableStore();
  #columns: readonly TableColumn<Labelled>[] = [];
  #rows: readonly Measures[] = [];

  set columns(columns: readonly TableColumn<Labelled>[]) {
    const before = this.#columns;
    this.#columns = columns;
    this.#context().map(context => arranged(context, before));
  }

  set rows(rows: readonly Measures[]) {
    this.#rows = rows;
    this.#context().map(seated);
  }

  connectedCallback(): void {
    this.#context().map(wired);
  }

  #context(): Maybe<MountedTable> {
    return maybe(this.querySelector('table')).mBind(table => maybe(table.tBodies.item(0)).map(body => ({
      host: this,
      store: this.#hand,
      columns: () => this.#columns,
      rows: () => this.#rows,
      order: () => this.#columns.map(({name}) => name),
      standing: () => this.#rows.map(row => row.window.display),
      report: (said: Report) => report(this, said),
      document: this.ownerDocument,
      table,
      body,
      lanes: lanesOf(body)
    })));
  }
}
