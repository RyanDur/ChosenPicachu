import {has, is, maybe} from '@ryandur/sand';
import {unconfigured} from '@env';
import {Rule} from '@components/DragSortableTable/sorting';
import {anchored, gripLabel} from '@components/DragSortableTable/survey';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {Measures, cells, valuesOf} from '@pages/Demos/Tables/Aggregations/cells';
import {hydrated, recentTrades} from '@pages/Demos/Tables/Aggregations/recent-trades';
import {LiveTradesState, liveTrades, opening} from '@pages/Demos/Charts/live-trades';
import {Trade} from '@pages/Demos/Charts/coinbase';
import {ArrowKey, Grab, columnLift, rowLift, surfaceTravel} from '@components/DragSortableTable/travel';
import {FlightAnswers} from '@components/DragSortableTable/flights';
import {Aloft, MountedTable, TableState, baked, columnOf, dealtTableState, drifting, dropped, lifted, moveReport, reseated, ruledBy, standingOf, tableStore} from './table-state';
import {GhostFlight, columnGhost, rowGhost} from './ghosts';
import {announce, wireMenu} from './menus';
import {dressShares, wireResize} from './resize';

export type Build = {
  flights: {column: FlightAnswers<MountedTable>; row: FlightAnswers<MountedTable>};
  arrows: {
    column: (mounted: MountedTable, held: string) => (event: ArrowKey) => void;
    row: (mounted: MountedTable, held: number) => (event: ArrowKey) => void;
  };
  veils?: {
    column: {veil: (mounted: MountedTable, held: string) => void; unveil: (mounted: MountedTable, held: string) => void};
    row: {veil: (mounted: MountedTable, held: number) => void; unveil: (mounted: MountedTable, held: number) => void};
  };
  show: (draw: () => void) => void;
};

export const mount = (document: Document, build: Build): void => {
  maybe(document.querySelector('table')).map(table =>
    maybe(table.querySelector('tbody')).map(body => mountTable(document, table, body, build)));
};

const changed = (before: readonly number[], after: readonly number[]): boolean =>
  after.some((at, position) => before[position] !== at);

const dressGrips = (table: HTMLTableElement, state: TableState): void => {
  [...table.querySelectorAll('thead th')].forEach((th, at) => {
    if (!(th instanceof HTMLTableCellElement)) {
      return;
    }
    if (anchored(at, state.order.length)) {
      th.classList.remove('grabbable');
      th.removeAttribute('tabindex');
    } else {
      th.classList.add('grabbable');
      th.tabIndex = 0;
    }
  });
};

const mountTable = (
  document: Document,
  table: HTMLTableElement,
  body: HTMLTableSectionElement,
  {flights, arrows, veils, show}: Build
): void => {
  const lanes = [...body.querySelectorAll('tr')];
  const order = [...table.querySelectorAll('thead th')].map(th => th.classList.item(1) ?? '');
  const measures = order.filter(column => is(document.getElementById(`sort-${column}`)));
  const env = {...unconfigured, ...window.__env};

  let history: readonly Trade[] = [];
  let live: LiveTradesState = opening;
  let ghost: GhostFlight | undefined;
  let surface: HTMLElement | undefined;

  const folded = (): Measures[] =>
    windowedAggregates(hydrated(history, live.trades)).map(cells);
  let rows: Measures[] = folded();

  const writeCells = (next: TableState): void => {
    lanes.forEach((lane, at) =>
      measures.forEach(measure => {
        const text = rows[at]?.[measure]?.display ?? '';
        const cell = lane.cells[next.order.indexOf(measure)];
        if (cell.textContent !== text) {
          cell.textContent = text;
        }
      }));
  };

  const reconcileColumns = (previous: readonly string[], next: readonly string[]): void => {
    [...table.rows].forEach(lane => {
      const standing = new Map(previous.map((name, at) => [name, lane.cells[at]]));
      next.forEach((name, position) =>
        maybe(standing.get(name)).map(cell => {
          if (lane.cells[position] !== cell) {
            lane.insertBefore(cell, lane.cells[position] ?? null);
          }
        }));
    });
  };

  const reseatRows = (standing: readonly number[]): void => {
    standing.forEach((at, position) => {
      const desired = lanes[at];
      if (body.children[position] !== desired) {
        body.insertBefore(desired, body.children[position] ?? null);
      }
    });
    standing.forEach((at, position) =>
      maybe(lanes[at].querySelector('button.grip')).map(grip => {
        const label = gripLabel(position);
        if (grip.getAttribute('aria-label') !== label) {
          grip.setAttribute('aria-label', label);
        }
      }));
  };

  const summoned = (aloft: Aloft): GhostFlight =>
    aloft.axis === 'column' ? columnGhost(mounted, aloft.held) : rowGhost(mounted, aloft.held);

  const mountSurface = (aloft: Aloft): HTMLElement => {
    const drop = (): void => {
      const standing = mounted.state().aloft;
      if (!has(standing)) {
        return;
      }
      maybe(veils).map(veil => standing.axis === 'column'
        ? veil.column.unveil(mounted, standing.held)
        : veil.row.unveil(mounted, standing.held));
      maybe(flights[aloft.axis].land).map(land => land(mounted));
      store.dispatch(dropped);
    };
    const element = document.createElement('article');
    element.className = 'drag-surface';
    element.addEventListener('pointermove', surfaceTravel(
      moving => store.dispatch(drifting(moving)),
      moving => flights[aloft.axis].travel(mounted, moving),
      drop));
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ending =>
      element.addEventListener(ending, drop));
    document.body.append(element);
    return element;
  };

  const reconcileFlight = (previous: TableState, next: TableState): void => {
    if (next.aloft !== previous.aloft && (previous.aloft === undefined || next.aloft === undefined
        || next.aloft.held !== previous.aloft.held || next.aloft.axis !== previous.aloft.axis)) {
      maybe(ghost).map(flown => flown.land());
      maybe(surface).map(standing => standing.remove());
      ghost = has(next.aloft) ? summoned(next.aloft) : undefined;
      surface = has(next.aloft) ? mountSurface(next.aloft) : undefined;
    }
    if (next.drift !== previous.drift) {
      maybe(ghost).map(flown => flown.drift(next.drift));
    }
  };

  const reconcile = (previous: TableState, next: TableState, before: readonly number[], after: readonly number[]): void => {
    reconcileFlight(previous, next);
    if (next.order !== previous.order) {
      reconcileColumns(previous.order, next.order);
      dressGrips(table, next);
    }
    writeCells(next);
    if (changed(before, after)) {
      reseatRows(after);
    }
    if (next.rule !== previous.rule) {
      measures.forEach(column => announce(document, column, next.rule));
    }
    if (next.landed !== previous.landed) {
      maybe(next.landed).map(landed =>
        maybe(document.querySelector('output.move-report')).map(report => {
          const text = moveReport(landed);
          if (report.textContent !== text) {
            report.textContent = text;
          }
        }));
    }
    if (next.shares !== previous.shares || next.order !== previous.order) {
      dressShares(table, next);
    }
  };

  const store = tableStore(dealtTableState(order, lanes.length));
  let shown = store.state();
  let standing = standingOf(rows.map(valuesOf), shown);
  store.subscribe(() => {
    const previous = shown;
    const before = standing;
    const next = store.state();
    const after = standingOf(rows.map(valuesOf), next);
    shown = next;
    standing = after;
    const draw = (): void => reconcile(previous, next, before, after);
    if (reseated(previous, next)) {
      show(draw);
    } else {
      draw();
    }
  });

  const mounted: MountedTable = {...store, standing: () => standing, document, table, body, lanes};

  const choose = (next?: Rule): void => store.dispatch(ruledBy(next));

  measures.forEach(column => wireMenu(document, column, choose));
  wireResize(mounted);
  [...table.querySelectorAll('.menu-toggle, .menu')].forEach(chrome =>
    chrome.addEventListener('pointerdown', event => event.stopPropagation()));

  const wireColumnGrip = (th: HTMLTableCellElement): void => {
    const held = columnOf(store.state(), th);

    const grabbed = (grab: Grab): void => {
      maybe(veils).map(veil => veil.column.veil(mounted, held));
      mounted.dispatch(lifted({axis: 'column', held}, grab));
    };

    th.addEventListener('pointerdown', columnLift(held, () => mounted.state().order, mounted.standing, grabbed));
    th.addEventListener('keydown', arrows.column(mounted, held));
  };

  const wireRowGrip = (held: number, grip: HTMLButtonElement): void => {
    const grabbed = (grab: Grab): void => {
      maybe(veils).map(veil => veil.row.veil(mounted, held));
      mounted.dispatch(current => lifted({axis: 'row', held}, grab)(baked(standing)(current)));
    };

    grip.addEventListener('pointerdown', rowLift(() => mounted.state().order, mounted.standing, grabbed));
    grip.addEventListener('keydown', arrows.row(mounted, held));
  };

  [...table.querySelectorAll('thead th')].forEach(th => {
    if (th instanceof HTMLElement) {
      th.style.viewTransitionName = `header-${columnOf(store.state(), th)}`;
    }
  });
  lanes.forEach((lane, row) => [...lane.cells].forEach((cell, at) => {
    cell.style.viewTransitionName = `cell-${row}-${order[at]}`;
  }));
  dressGrips(table, store.state());
  [...table.querySelectorAll('thead th')]
    .filter(th => th instanceof HTMLTableCellElement)
    .forEach(wireColumnGrip);
  lanes.forEach((lane, held) =>
    [...lane.querySelectorAll('button.grip')]
      .filter(grip => grip instanceof HTMLButtonElement)
      .forEach(grip => wireRowGrip(held, grip)));

  if (env.tradeHistory) {
    recentTrades(env.tradeHistory, env.tradeProduct, trades => {
      history = trades;
      rows = folded();
      store.dispatch(current => current);
    });
  }
  if (env.tradeFeed) {
    liveTrades(env.tradeFeed, env.tradeProduct, next => {
      live = next(live);
      rows = folded();
      store.dispatch(current => current);
    }, () => undefined);
  }
};
