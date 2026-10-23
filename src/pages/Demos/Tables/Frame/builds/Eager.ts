import {has, is, maybe, Maybe} from '@ryandur/sand';
import {Direction} from '@components/DragSortableTable/sorting';
import {
  anchored,
  columnUnder,
  displacedBetween,
  gripLabel,
  interior,
  rowUnder,
  spanCrossed
} from '@components/DragSortableTable/survey';
import {eagerTravel, Moving, pointerTravel} from '@components/DragSortableTable/travel';
import {columnLift, Grab, rowLift} from '@components/DragSortableTable/lift';
import {columnArrows, rowArrows} from '@components/DragSortableTable/arrows';
import {Labelled, TableColumn} from '@components/DragSortableTable/table-state';
import {isMeasure, Measures} from '@pages/Demos/Tables/Aggregations/cells';
import {
  Carry,
  changed,
  columnOfHeader,
  drifted,
  landingReport,
  Report,
  lifted,
  MountedTable,
  moveReport,
  orderAtLift,
  released,
  settlingAt,
  settlingFromSeat,
  TableState,
  tableStore
} from '../table/table-state';
import {keepingFocus} from '../table/focus';
import {announce, wireMenu} from '../table/menus';
import {dressWidths, wireResize} from '../table/resize';
import {settleColumn, settleRow, shoveColumns, shoveRows, unmarked} from '../table/settle';
import {dressCarried} from '../table/carry';
import {tell} from '../table/events';

const rowOf = (lane: HTMLTableRowElement): string => lane.querySelector('th')?.textContent?.trim() ?? '';
const headersOf = (table: HTMLTableElement): HTMLTableCellElement[] =>
  [...table.querySelectorAll('thead th')].filter(th => th instanceof HTMLTableCellElement);
const sortableOf = (table: HTMLTableElement): string[] =>
  headersOf(table).map(columnOfHeader).filter(column => is(table.querySelector(`#sort-${column}`)));
const sortOf = (columns: readonly TableColumn<Labelled>[]): string =>
  columns.map(({name, sorted}) => has(sorted) ? `${name} ${sorted}` : '').join('');

export class DragSortableTable extends HTMLElement {
  readonly #hand = tableStore();
  #columns: readonly TableColumn<Labelled>[] = [];
  #rows: readonly Measures[] = [];

  set columns(columns: readonly TableColumn<Labelled>[]) {
    const before = this.#columns;
    this.#columns = columns;
    this.#parts().map(parts => this.#arrange(parts, before));
  }

  set rows(rows: readonly Measures[]) {
    this.#rows = rows;
    this.#parts().map(parts => {
      this.#writeCells(parts);
      this.#reseatRows(parts);
    });
  }

  connectedCallback(): void {
    this.#parts().map(parts => this.#wire(parts));
  }

  #order(): readonly string[] {
    return this.#columns.map(({name}) => name);
  }

  #standing(): readonly string[] {
    return this.#rows.map(row => row.window.display);
  }

  #report(said: Report): void {
    const output = this.querySelector('output[aria-label="move report"]');
    const text = moveReport(said);
    if (output !== null && output.textContent !== text) {
      output.textContent = text;
    }
  }

  #parts(): Maybe<MountedTable> {
    return maybe(this.querySelector('table')).mBind(table => maybe(table.tBodies.item(0)).map(body => ({
      store: this.#hand,
      order: () => this.#order(),
      standing: () => this.#standing(),
      report: (said: Report) => this.#report(said),
      document: this.ownerDocument,
      table,
      body,
      lanes: new Map([...body.rows].map(lane => [rowOf(lane), lane]))
    })));
  }

  #arrange(parts: MountedTable, before: readonly TableColumn<Labelled>[]): void {
    const {table, document} = parts;
    const shown = headersOf(table).map(columnOfHeader);
    if (changed(shown, this.#order())) {
      keepingFocus(document, () => this.#reconcileColumns(table, shown));
      this.#dressGrips(table);
      dressWidths(parts);
    }
    this.#reseatRows(parts);
    dressCarried(parts, this.#hand.state);
    if (sortOf(before) !== sortOf(this.#columns)) {
      this.#columns.forEach(({name, sorted}) => announce(table, name, sorted));
    }
  }

  #reconcileColumns(table: HTMLTableElement, shown: readonly string[]): void {
    [...table.rows].forEach(lane => {
      const placed = new Map(shown.map((name, at) => [name, lane.cells[at]]));
      this.#order().forEach((name, position) =>
        maybe(placed.get(name)).map(cell => {
          if (lane.cells[position] !== cell) {
            lane.insertBefore(cell, lane.cells[position] ?? null);
          }
        }));
    });
  }

  #dressGrips(table: HTMLTableElement): void {
    const headers = headersOf(table);
    headers.forEach((th, at) => {
      if (anchored(at, headers.length)) {
        th.classList.remove('grabbable');
        th.removeAttribute('tabindex');
      } else {
        th.classList.add('grabbable');
        th.tabIndex = 0;
      }
    });
  }

  #writeCells({table, lanes}: MountedTable): void {
    const order = headersOf(table).map(columnOfHeader);
    this.#rows.forEach(row =>
      maybe(lanes.get(row.window.display)).map(lane =>
        sortableOf(table).forEach(measure => {
          const text = isMeasure(measure) ? row[measure].display : '';
          const cell = lane.cells[order.indexOf(measure)];
          if (cell.textContent !== text) {
            cell.textContent = text;
          }
        })));
  }

  #reseatRows({document, body, lanes}: MountedTable): void {
    const next = this.#standing();
    if (!changed([...body.rows].map(rowOf), next)) {
      return;
    }
    keepingFocus(document, () =>
      next.forEach((row, position) =>
        maybe(lanes.get(row)).map(desired => {
          if (body.children[position] !== desired) {
            body.insertBefore(desired, body.children[position] ?? null);
          }
        })));
    next.forEach((row, position) =>
      maybe(lanes.get(row)?.querySelector('button.grip')).map(grip => {
        const label = gripLabel(position);
        if (grip.getAttribute('aria-label') !== label) {
          grip.setAttribute('aria-label', label);
        }
      }));
  }

  #wire(parts: MountedTable): void {
    const {table, lanes} = parts;
    const hand = this.#hand;
    const columns = (): readonly string[] => this.#order();
    const standing = (): readonly string[] => this.#standing();

    const columnShoving = (name: string, to: number, widths: Readonly<Record<string, number>>): void => {
      const current = columns();
      const from = current.indexOf(name);
      tell(this, 'column-moved', {column: name, to});
      shoveColumns(parts, displacedBetween(current, from, to), {toward: to > from ? 'start' : 'end', by: widths[name] ?? 0});
    };
    const columnTo = (name: string, to: number, widths: Readonly<Record<string, number>>): void => {
      const current = columns();
      const from = current.indexOf(name);
      const over = spanCrossed(current, widths, from, to);
      columnShoving(name, to, widths);
      this.#report({about: 'column', name, position: to, of: current.length});
      settleColumn(parts, name, settlingFromSeat({x: to > from ? -over : over, y: 0}));
    };
    const columnBeside = (name: string, neighbour: string): void => {
      const current = columns();
      columnShoving(name, interior(current.indexOf(neighbour), current.length), hand.state.drag?.survey.columnWidths ?? {});
    };
    const rowShoving = (row: string, before: readonly string[], to: number, heights: Readonly<Record<string, number>>): void => {
      const from = before.indexOf(row);
      shoveRows(parts, displacedBetween(before, from, to), {toward: to > from ? 'up' : 'down', by: heights[row] ?? 0});
    };
    const rowNudged = (row: string, from: number, to: number, heights: Readonly<Record<string, number>>): void => {
      const before = standing();
      rowShoving(row, before, to, heights);
      settleRow(parts, row, settlingFromSeat({x: 0, y: to > from ? -spanCrossed(before, heights, from, to) : spanCrossed(before, heights, from, to)}));
    };
    const rowTo = (row: string, to: number): void => {
      const before = standing();
      tell(this, 'row-moved', {row, to, standing: before});
      this.#report({about: 'row', name: row, position: to, of: before.length});
    };
    const rowBeside = (row: string, neighbour: string): void => {
      const before = standing();
      const to = before.indexOf(neighbour);
      tell(this, 'row-moved', {row, to, standing: before});
      rowShoving(row, before, to, hand.state.drag?.survey.rowHeights ?? {});
    };

    const dress = (previous: TableState, next: TableState): void => {
      if (previous.widths !== next.widths || previous.sizing !== next.sizing) {
        dressWidths(parts);
      }
      if (previous.drag !== next.drag) {
        dressCarried(parts, next);
      }
    };
    hand.subscribe((previous, current) => dress(previous, current()));

    const drop = (): void => {
      const {drag} = hand.state;
      if (!has(drag)) {
        return;
      }
      landingReport(drag.axis, orderAtLift(drag), drag.held, {name: drag.held, order: drag.axis === 'column' ? columns() : standing()}).map(said => this.#report(said));
      const from = settlingAt(hand.state, columns(), standing());
      hand.dispatch(released());
      if (drag.axis === 'column') {
        settleColumn(parts, drag.held, from);
      } else {
        settleRow(parts, drag.held, from);
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
      unmarked(parts);
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
      tell(this, 'sorted', {column, direction});
      this.#report({about: 'sort', name: column, direction});
    };

    sortableOf(table).forEach(column => wireMenu(table, column, choose(column)));
    wireResize(parts);
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

    this.#dressGrips(table);
    headersOf(table).forEach(wireColumnGrip);
    lanes.forEach((lane, held) =>
      [...lane.querySelectorAll('button.grip')]
        .filter(grip => grip instanceof HTMLButtonElement)
        .forEach(grip => wireRowGrip(held, grip)));
  }
}
