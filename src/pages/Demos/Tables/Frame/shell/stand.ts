import {has, is, maybe} from '@ryandur/sand';
import {unconfigured} from '@env';
import {Row} from '@components/Table';
import {Rule} from '@components/DragSortableTable/sorting';
import {anchored, gripLabel, surveyed} from '@components/DragSortableTable/survey';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {hydrated, recentTrades} from '@pages/Demos/Tables/Aggregations/recent-trades';
import {LiveTradesState, liveTrades, opening} from '@pages/Demos/Charts/live-trades';
import {Trade} from '@pages/Demos/Charts/coinbase';
import {ArrowKey, Grab, columnLift, rowLift, still, surfaceTravel} from '@components/DragSortableTable/travel';
import {Aloft, Desk, Shell, baked, columnOf, drifting, dropped, lifted, ruledBy, standingOf} from './desk';
import {GhostFlight, columnGhost, rowGhost} from './ghosts';
import {announce, wireMenu} from './menus';
import {dressShares, wireResize} from './resize';

export type FlightAnswers = {
  travel: (shell: Shell, moving: {clientX: number; clientY: number}) => void;
  land?: (shell: Shell) => void;
};

export type Dressage = {
  flights: {column: FlightAnswers; row: FlightAnswers};
  arrows: {
    column: (shell: Shell, held: string) => (event: ArrowKey) => void;
    row: (shell: Shell, held: number) => (event: ArrowKey) => void;
  };
  veils?: {
    column: {veil: (shell: Shell, held: string) => void; unveil: (shell: Shell, held: string) => void};
    row: {veil: (shell: Shell, held: number) => void; unveil: (shell: Shell, held: number) => void};
  };
  ruled?: (shell: Shell, heights: Readonly<Record<number, number>>, before: readonly number[], after: readonly number[]) => void;
};

export const stand = (document: Document, dressage: Dressage): void => {
  maybe(document.querySelector('table')).map(table =>
    maybe(table.querySelector('tbody')).map(body => standTable(document, table, body, dressage)));
};

const changed = (before: readonly number[], after: readonly number[]): boolean =>
  after.some((at, position) => before[position] !== at);

const dressGrips = (table: HTMLTableElement, desk: Desk): void => {
  [...table.querySelectorAll('thead th')].forEach((th, at) => {
    if (!(th instanceof HTMLTableCellElement)) {
      return;
    }
    if (anchored(at, desk.order.length)) {
      th.classList.remove('grabbable');
      th.removeAttribute('tabindex');
    } else {
      th.classList.add('grabbable');
      th.tabIndex = 0;
    }
  });
};

const standTable = (
  document: Document,
  table: HTMLTableElement,
  body: HTMLTableSectionElement,
  {flights, arrows, veils, ruled}: Dressage
): void => {
  const lanes = [...body.querySelectorAll('tr')];
  const dealt = lanes.map((_, at) => at);
  const order = [...table.querySelectorAll('thead th')].map(th => th.classList.item(1) ?? '');
  const measures = order.filter(column => is(document.getElementById(`sort-${column}`)));
  const env = {...unconfigured, ...window.__env};

  let history: readonly Trade[] = [];
  let live: LiveTradesState = opening;
  let desk: Desk = {
    order, seats: dealt, seated: dealt, shares: undefined, rule: undefined,
    aloft: undefined, bounds: undefined, flight: undefined, origin: undefined, drift: still
  };
  let ghost: GhostFlight | undefined;
  let surface: HTMLElement | undefined;

  const folded = (): Row[] =>
    windowedAggregates(hydrated(history, live.trades)).map(cells);

  const writeCells = (rows: Row[], next: Desk): void => {
    lanes.forEach((lane, at) =>
      measures.forEach(measure => {
        const {display} = rows[at][measure];
        const cell = lane.cells[next.order.indexOf(measure)];
        const text = typeof display === 'string' ? display : '';
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

  const reseatRows = (seated: readonly number[]): void => {
    seated.forEach((at, position) => {
      const desired = lanes[at];
      if (body.children[position] !== desired) {
        body.insertBefore(desired, body.children[position] ?? null);
      }
    });
    seated.forEach((at, position) =>
      maybe(lanes[at].querySelector('button.grip')).map(grip => {
        const label = gripLabel(position);
        if (grip.getAttribute('aria-label') !== label) {
          grip.setAttribute('aria-label', label);
        }
      }));
  };

  const summoned = (aloft: Aloft): GhostFlight =>
    aloft.axis === 'column' ? columnGhost(shell, aloft.held) : rowGhost(shell, aloft.held);

  const mounted = (aloft: Aloft): HTMLElement => {
    const drop = (): void => {
      const standing = shell.desk().aloft;
      if (!has(standing)) {
        return;
      }
      maybe(veils).map(veil => standing.axis === 'column'
        ? veil.column.unveil(shell, standing.held)
        : veil.row.unveil(shell, standing.held));
      maybe(flights[aloft.axis].land).map(land => land(shell));
      commit(dropped);
    };
    const element = document.createElement('article');
    element.className = 'drag-surface';
    element.addEventListener('pointermove', surfaceTravel(
      moving => commit(drifting(moving)),
      moving => flights[aloft.axis].travel(shell, moving),
      drop));
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ending =>
      element.addEventListener(ending, drop));
    document.body.append(element);
    return element;
  };

  const reconcileFlight = (previous: Desk, next: Desk): void => {
    if (next.aloft !== previous.aloft && (previous.aloft === undefined || next.aloft === undefined
        || next.aloft.held !== previous.aloft.held || next.aloft.axis !== previous.aloft.axis)) {
      maybe(ghost).map(flown => flown.land());
      maybe(surface).map(standing => standing.remove());
      ghost = has(next.aloft) ? summoned(next.aloft) : undefined;
      surface = has(next.aloft) ? mounted(next.aloft) : undefined;
    }
    if (next.drift !== previous.drift) {
      maybe(ghost).map(flown => flown.drift(next.drift));
    }
  };

  const reconciled = (previous: Desk, next: Desk): Desk => {
    reconcileFlight(previous, next);
    if (next.order !== previous.order) {
      reconcileColumns(previous.order, next.order);
      dressGrips(table, next);
    }
    const rows = folded();
    writeCells(rows, next);
    const standing = standingOf(rows, next);
    if (changed(previous.seated, standing)) {
      reseatRows(standing);
    }
    if (next.rule !== previous.rule) {
      measures.forEach(column => announce(document, column, next.rule));
    }
    if (next.shares !== previous.shares || next.order !== previous.order) {
      dressShares(table, next);
    }
    return {...next, seated: standing};
  };

  const commit = (transition: (current: Desk) => Desk): void => {
    desk = reconciled(desk, transition(desk));
  };

  const shell: Shell = {document, table, body, lanes, desk: () => desk, commit};

  const choose = (next?: Rule): void => {
    const before = desk.seated;
    const heights = surveyed(table, desk.order, before).rowHeights;
    commit(ruledBy(next));
    if (has(ruled) && changed(before, desk.seated)) {
      ruled(shell, heights, before, desk.seated);
    }
  };

  measures.forEach(column => wireMenu(document, column, choose));
  wireResize(shell);
  [...table.querySelectorAll('.menu-toggle, .menu')].forEach(chrome =>
    chrome.addEventListener('pointerdown', event => event.stopPropagation()));

  const wireColumnGrip = (th: HTMLTableCellElement): void => {
    const held = columnOf(desk, th);

    const grabbed = (grab: Grab): void => {
      maybe(veils).map(veil => veil.column.veil(shell, held));
      shell.commit(lifted({axis: 'column', held}, grab));
    };

    th.addEventListener('pointerdown', columnLift(held, () => shell.desk().order, () => shell.desk().seated, grabbed));
    th.addEventListener('keydown', arrows.column(shell, held));
  };

  const wireRowGrip = (held: number, grip: HTMLButtonElement): void => {
    const grabbed = (grab: Grab): void => {
      maybe(veils).map(veil => veil.row.veil(shell, held));
      shell.commit(current => lifted({axis: 'row', held}, grab)(baked(current)));
    };

    grip.addEventListener('pointerdown', rowLift(() => shell.desk().order, () => shell.desk().seated, grabbed));
    grip.addEventListener('keydown', arrows.row(shell, held));
  };

  dressGrips(table, desk);
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
      commit(current => current);
    });
  }
  if (env.tradeFeed) {
    liveTrades(env.tradeFeed, env.tradeProduct, next => {
      live = next(live);
      commit(current => current);
    }, () => undefined);
  }
};
