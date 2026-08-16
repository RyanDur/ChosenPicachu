import {has, is, maybe} from '@ryandur/sand';
import {unconfigured} from '@env';
import {Row} from '@components/Table';
import {Rule, ranked} from '@components/DragSortableTable/sorting';
import {anchored, gripLabel, surveyed} from '@components/DragSortableTable/survey';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {hydrated, recentTrades} from '@pages/Demos/Tables/Aggregations/recent-trades';
import {LiveTradesState, liveTrades, opening} from '@pages/Demos/Charts/live-trades';
import {Trade} from '@pages/Demos/Charts/coinbase';
import {Desk, Shell, ruledBy} from './desk';
import {announce, wireMenu} from './menus';
import {dressShares, wireResize} from './resize';

export type Dressage = {
  travels: (shell: Shell) => void;
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
  {travels, ruled}: Dressage
): void => {
  const lanes = [...body.querySelectorAll('tr')];
  const dealt = lanes.map((_, at) => at);
  const order = [...table.querySelectorAll('thead th')].map(th => th.classList.item(1) ?? '');
  const measures = order.filter(column => is(document.getElementById(`sort-${column}`)));
  const env = {...unconfigured, ...window.__env};

  let history: readonly Trade[] = [];
  let live: LiveTradesState = opening;
  let desk: Desk = {order, seats: dealt, seated: dealt, shares: undefined, rule: undefined};

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

  const reconciled = (previous: Desk, next: Desk): Desk => {
    if (next.order !== previous.order) {
      reconcileColumns(previous.order, next.order);
      dressGrips(table, next);
    }
    const rows = folded();
    writeCells(rows, next);
    const standing = has(next.rule) ? ranked(rows, next.seats, next.rule) : next.seats;
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

  dressGrips(table, desk);
  travels(shell);

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
