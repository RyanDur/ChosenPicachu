import {has, is, maybe} from '@ryandur/sand';
import {unconfigured} from '@env';
import {Direction} from '@components/DragSortableTable/sorting';
import {anchored, columnUnder, gripLabel, interior, rowUnder} from '@components/DragSortableTable/survey';
import {Moving, lazyTravel, pointerTravel} from '@components/DragSortableTable/travel';
import {Grab, columnLift, rowLift} from '@components/DragSortableTable/lift';
import {columnArrows, rowArrows} from '@components/DragSortableTable/arrows';
import {Seated} from '@components/DragSortableTable/table-state';
import {store} from '@components/store';
import {seated} from '@pages/Demos/Tables/Aggregations/cells';
import {
  Arrangement, Carry, Landed, MountedTable, TableState, arrangementOf, arrangementReducer, carrying, changed, columnMoved, columnOf, columnLandingAt, demosStore, feedRequested, moveReport, released, rowLandingAt, rowMoved, selectMeasures, sorted, standingOf, tableStore
} from '../table/table-state';
import {exchange} from '@pages/Demos/exchange';
import {keepingFocus} from '../table/focus';
import {announce, wireMenu} from '../table/menus';
import {dressWidths, wireResize} from '../table/resize';

export const wire = (document: Document): void => {
  maybe(document.querySelector('table')).map(table =>
    maybe(table.querySelector('tbody')).map(body => mount(document, table, body)));
};

const rowOf = (lane: HTMLTableRowElement): string => lane.querySelector('th')?.textContent?.trim() ?? '';

const mount = (document: Document, table: HTMLTableElement, body: HTMLTableSectionElement): void => {
  const lanes = new Map([...body.querySelectorAll('tr')].map(lane => [rowOf(lane), lane]));
  const order = [...table.querySelectorAll('thead th')].map(th => th.classList.item(1) ?? '');
  const sortable = order.filter(column => is(document.getElementById(`sort-${column}`)));
  const env = {...unconfigured, ...window.__env};

  const trades = demosStore(exchange(env, () => undefined));
  const arrangement = store({slice: {initial: arrangementOf(order, [...lanes.keys()]), reduce: arrangementReducer}});
  const hand = tableStore();
  const windows = (): readonly Seated[] => seated(selectMeasures(trades.state));
  const valueOf = (row: string, column: string) => windows().find(({key}) => key === row)?.values[column];
  const columns = (): readonly string[] => arrangement.state.columns;
  const standing = (): readonly string[] => standingOf(arrangement.state, valueOf);

  const report = (landed: Landed): void => {
    const output = document.querySelector('output.move-report');
    const text = moveReport(landed);
    if (output !== null && output.textContent !== text) {
      output.textContent = text;
    }
  };

  const mounted: MountedTable = {store: hand, order: columns, standing, report, document, table, body, lanes};

  const columnTo = (name: string, to: number): void => {
    const current = columns();
    arrangement.dispatch(columnMoved(name, to));
    report({axis: 'column', name, position: to, of: current.length});
  };
  const columnBeside = (name: string, neighbour: string): void => {
    const current = columns();
    columnTo(name, interior(current.indexOf(neighbour), current.length));
  };
  const rowTo = (row: string, to: number): void => {
    const before = standing();
    arrangement.dispatch(rowMoved(row, to, before));
    report({axis: 'row', position: to, of: before.length});
  };
  const rowBeside = (row: string, neighbour: string): void => {
    const before = standing();
    arrangement.dispatch(rowMoved(row, before.indexOf(neighbour), before));
    report({axis: 'row', position: before.indexOf(neighbour), of: before.length});
  };

  const writeCells = (): void => {
    const order = columns();
    selectMeasures(trades.state).forEach(row =>
      maybe(lanes.get(row.window?.display ?? '')).map(lane =>
        sortable.forEach(measure => {
          const text = row[measure]?.display ?? '';
          const cell = lane.cells[order.indexOf(measure)];
          if (cell.textContent !== text) {
            cell.textContent = text;
          }
        })));
  };

  const reconcileColumns = (previous: readonly string[], next: readonly string[]): void => {
    [...table.rows].forEach(lane => {
      const placed = new Map(previous.map((name, at) => [name, lane.cells[at]]));
      next.forEach((name, position) =>
        maybe(placed.get(name)).map(cell => {
          if (lane.cells[position] !== cell) {
            lane.insertBefore(cell, lane.cells[position] ?? null);
          }
        }));
    });
  };

  const shown = (): readonly string[] => [...body.querySelectorAll('tr')].map(rowOf);

  const reseatRows = (): void => {
    const next = standing();
    if (!changed(shown(), next)) {
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
  };

  const dressGrips = (): void => {
    [...table.querySelectorAll('thead th')].forEach((th, at) => {
      if (!(th instanceof HTMLTableCellElement)) {
        return;
      }
      if (anchored(at, columns().length)) {
        th.classList.remove('grabbable');
        th.removeAttribute('tabindex');
      } else {
        th.classList.add('grabbable');
        th.tabIndex = 0;
      }
    });
  };

  const reconcile = (previous: Arrangement, next: Arrangement): void => {
    if (changed(previous.columns, next.columns)) {
      keepingFocus(document, () => reconcileColumns(previous.columns, next.columns));
      dressGrips();
      dressWidths(mounted);
    }
    reseatRows();
    if (previous.sort !== next.sort) {
      next.columns.forEach(name => announce(document, name, next.sort?.column === name ? next.sort.direction : undefined));
    }
  };

  const dress = (previous: TableState, next: TableState): void => {
    if (previous.widths !== next.widths) {
      dressWidths(mounted);
    }
  };

  arrangement.subscribe((previous, current) => reconcile(previous, current()));
  hand.subscribe((previous, current) => dress(previous, current()));
  trades.subscribe(() => {
    writeCells();
    reseatRows();
  });

  const landed = (): void => {
    const {drag} = hand.state;
    if (drag?.axis === 'column' && drag.landing !== undefined) {
      columnBeside(drag.held, drag.landing);
    } else if (drag?.axis === 'row' && drag.landing !== undefined) {
      rowBeside(drag.held, drag.landing);
    }
  };

  const drop = (): void => {
    const {drag} = hand.state;
    if (!has(drag)) {
      return;
    }
    landed();
    hand.dispatch(released());
  };

  const moved = (moving: Moving): void => {
    const {drag} = hand.state;
    if (drag?.axis === 'column') {
      hand.dispatch(columnLandingAt(lazyTravel(columnUnder(columns(), drag.survey))(drag.held, moving, drag.landing)));
    } else if (drag?.axis === 'row') {
      hand.dispatch(rowLandingAt(lazyTravel(rowUnder(standing(), drag.survey))(drag.held, moving, drag.landing)));
    }
  };

  const lift = (carry: Carry, grab: Grab): void => {
    hand.dispatch(carrying(carry, grab));
  };

  const wireCarry = (holder: HTMLElement): void => {
    ['pointermove', 'lostpointercapture'].forEach(travelling => holder.addEventListener(travelling, event => {
      if (event instanceof PointerEvent && has(hand.state.drag)) {
        pointerTravel(moved, drop)(event);
      }
    }));
    ['pointerup', 'pointercancel'].forEach(ending => holder.addEventListener(ending, drop));
  };

  const choose = (column: string) => (direction?: Direction): void => arrangement.dispatch(sorted(column, direction));

  sortable.forEach(column => wireMenu(document, column, choose(column)));
  wireResize(mounted);
  [...table.querySelectorAll('.menu-toggle, .menu')].forEach(chrome =>
    chrome.addEventListener('pointerdown', event => event.stopPropagation()));

  const wireColumnGrip = (th: HTMLTableCellElement): void => {
    const held = columnOf(columns(), th);

    th.addEventListener('pointerdown', columnLift(held, columns, standing, grab => lift({axis: 'column', held}, grab)));
    wireCarry(th);
    th.addEventListener('keydown', columnArrows(held, columns, ({to}) => columnTo(held, to)));
  };

  const wireRowGrip = (held: string, grip: HTMLButtonElement): void => {
    grip.addEventListener('pointerdown', rowLift(columns, standing, grab => lift({axis: 'row', held}, grab)));
    wireCarry(grip);
    grip.addEventListener('keydown', rowArrows(held, standing, ({to}) => rowTo(held, to)));
  };

  dressGrips();
  [...table.querySelectorAll('thead th')]
    .filter(th => th instanceof HTMLTableCellElement)
    .forEach(wireColumnGrip);
  lanes.forEach((lane, held) =>
    [...lane.querySelectorAll('button.grip')]
      .filter(grip => grip instanceof HTMLButtonElement)
      .forEach(grip => wireRowGrip(held, grip)));

  trades.dispatch(feedRequested());
};
