import {has, is, maybe} from '@ryandur/sand';
import {unconfigured} from '@env';
import {Direction} from '@components/DragSortableTable/sorting';
import {anchored, columnUnder, displacedBetween, gripLabel, interior, rowUnder, spanCrossed} from '@components/DragSortableTable/survey';
import {Moving, eagerTravel, pointerTravel, still} from '@components/DragSortableTable/travel';
import {Grab, columnLift, rowLift} from '@components/DragSortableTable/lift';
import {columnArrows, rowArrows} from '@components/DragSortableTable/arrows';
import {Seated} from '@components/DragSortableTable/table-state';
import {seated} from '@pages/Demos/Tables/Aggregations/cells';
import {
  Carry, Landed, MeasuresState, MountedTable, carriedOffset, carrying, changed, columnOf, demosStore, feedRequested, moveReport, orderOf, orderedTo, released, reset, rowLifted, rowNudgedTo, ruledBy, seatedTo, selectMeasures, selectStanding, sortsOf, tableOf, tableStore, widthsShown
} from '../table/table-state';
import {exchange} from '@pages/Demos/exchange';
import {keepingFocus} from '../table/focus';
import {announce, wireMenu} from '../table/menus';
import {dressWidths, wireResize} from '../table/resize';
import {settleColumn, settleRow, shoveColumns, shoveRows, unmarked} from '../table/settle';

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
  const store = tableStore(tableOf(order.map(name => ({name, data: {label: name}})), [...lanes.keys()]));
  const windows = (): readonly Seated[] => seated(selectMeasures(trades.state));
  const standing = (): readonly string[] => selectStanding(store.state, windows());

  const report = (landed: Landed): void => {
    const output = document.querySelector('output.move-report');
    const text = moveReport(landed);
    if (output !== null && output.textContent !== text) {
      output.textContent = text;
    }
  };

  const mounted: MountedTable = {store, report, document, table, body, lanes};

  const columnShoving = (name: string, to: number, widths: Readonly<Record<string, number>>): void => {
    const current = orderOf(store.state);
    const from = current.indexOf(name);
    store.dispatch(orderedTo(from, to));
    report({axis: 'column', name, position: to, of: current.length});
    shoveColumns(mounted, displacedBetween(current, from, to), {toward: to > from ? 'start' : 'end', by: widths[name] ?? 0});
  };
  const columnTo = (name: string, to: number, widths: Readonly<Record<string, number>>): void => {
    const current = orderOf(store.state);
    const from = current.indexOf(name);
    const over = spanCrossed(current, widths, from, to);
    columnShoving(name, to, widths);
    settleColumn(mounted, name, {x: to > from ? -over : over, y: 0});
  };
  const columnBeside = (name: string, neighbour: string): void => {
    const current = orderOf(store.state);
    columnShoving(name, interior(current.indexOf(neighbour), current.length), store.state.drag?.survey.columnWidths ?? {});
  };
  const rowShoving = (row: string, before: readonly string[], to: number, heights: Readonly<Record<string, number>>): void => {
    const from = before.indexOf(row);
    shoveRows(mounted, displacedBetween(before, from, to), {toward: to > from ? 'up' : 'down', by: heights[row] ?? 0});
  };
  const rowTo = (row: string, to: number, heights: Readonly<Record<string, number>>): void => {
    const before = standing();
    const from = before.indexOf(row);
    store.dispatch(rowNudgedTo(row, to, before));
    report({axis: 'row', position: to, of: before.length});
    rowShoving(row, before, to, heights);
    settleRow(mounted, row, {x: 0, y: to > from ? -spanCrossed(before, heights, from, to) : spanCrossed(before, heights, from, to)});
  };
  const rowBeside = (row: string, neighbour: string): void => {
    const before = standing();
    const to = before.indexOf(neighbour);
    store.dispatch(seatedTo(row, neighbour));
    report({axis: 'row', position: to, of: before.length});
    rowShoving(row, before, to, store.state.drag?.survey.rowHeights ?? {});
  };

  const writeCells = (): void => {
    const order = orderOf(store.state);
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

  const dressGrips = (state: MeasuresState): void => {
    [...table.querySelectorAll('thead th')].forEach((th, at) => {
      if (!(th instanceof HTMLTableCellElement)) {
        return;
      }
      if (anchored(at, state.columns.length)) {
        th.classList.remove('grabbable');
        th.removeAttribute('tabindex');
      } else {
        th.classList.add('grabbable');
        th.tabIndex = 0;
      }
    });
  };

  const reconcile = (previous: MeasuresState, next: MeasuresState): void => {
    const reordered = changed(orderOf(previous), orderOf(next));
    if (reordered) {
      keepingFocus(document, () => reconcileColumns(orderOf(previous), orderOf(next)));
      dressGrips(next);
    }
    reseatRows();
    if (changed(sortsOf(previous), sortsOf(next))) {
      next.columns.forEach(({name, sorted}) => announce(document, name, sorted));
    }
    if (changed(widthsShown(previous), widthsShown(next)) || reordered) {
      dressWidths(table, next);
    }
  };

  store.subscribe((previous, current) => reconcile(previous, current()));
  trades.subscribe(() => {
    writeCells();
    reseatRows();
  });

  const drop = (): void => {
    const {drag} = store.state;
    if (!has(drag)) {
      return;
    }
    const from = carriedOffset(store.state) ?? still;
    store.dispatch(released());
    if (drag.axis === 'column') {
      settleColumn(mounted, drag.held, from);
    } else {
      settleRow(mounted, drag.held, from);
    }
  };

  const moved = (moving: Moving): void => {
    const {drag} = store.state;
    if (drag?.axis === 'column') {
      eagerTravel(columnUnder(orderOf(store.state), drag.survey), drag.held, neighbour => columnBeside(drag.held, neighbour))(moving);
    } else if (drag?.axis === 'row') {
      eagerTravel(rowUnder(standing(), drag.survey), drag.held, neighbour => rowBeside(drag.held, neighbour))(moving);
    }
  };

  const lift = (carry: Carry, grab: Grab): void => {
    unmarked(mounted);
    store.dispatch(carry.axis === 'row' ? rowLifted(carry.held, grab, standing()) : carrying(carry, grab));
  };

  const wireCarry = (holder: HTMLElement): void => {
    ['pointermove', 'lostpointercapture'].forEach(travelling => holder.addEventListener(travelling, event => {
      if (event instanceof PointerEvent && has(store.state.drag)) {
        pointerTravel(moved, drop)(event);
      }
    }));
    ['pointerup', 'pointercancel'].forEach(ending => holder.addEventListener(ending, drop));
  };

  const choose = (column: string) => (direction?: Direction): void =>
    store.dispatch(has(direction) ? ruledBy(column, direction) : reset(windows().map(({key}) => key)));

  sortable.forEach(column => wireMenu(document, column, choose(column)));
  wireResize(mounted);
  [...table.querySelectorAll('.menu-toggle, .menu')].forEach(chrome =>
    chrome.addEventListener('pointerdown', event => event.stopPropagation()));

  const wireColumnGrip = (th: HTMLTableCellElement): void => {
    const held = columnOf(store.state, th);

    th.addEventListener('pointerdown', columnLift(held, () => orderOf(store.state), standing, grab => lift({axis: 'column', held}, grab)));
    wireCarry(th);
    th.addEventListener('keydown', columnArrows(held, () => orderOf(store.state), ({to, widths}) => columnTo(held, to, widths)));
  };

  const wireRowGrip = (held: string, grip: HTMLButtonElement): void => {
    grip.addEventListener('pointerdown', rowLift(() => orderOf(store.state), standing, grab => lift({axis: 'row', held}, grab)));
    wireCarry(grip);
    grip.addEventListener('keydown', rowArrows(held, standing, ({to, heights}) => rowTo(held, to, heights)));
  };

  dressGrips(store.state);
  [...table.querySelectorAll('thead th')]
    .filter(th => th instanceof HTMLTableCellElement)
    .forEach(wireColumnGrip);
  lanes.forEach((lane, held) =>
    [...lane.querySelectorAll('button.grip')]
      .filter(grip => grip instanceof HTMLButtonElement)
      .forEach(grip => wireRowGrip(held, grip)));

  trades.dispatch(feedRequested());
};
