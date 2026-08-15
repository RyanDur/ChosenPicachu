import {has, is, maybe} from '@ryandur/sand';
import {Row} from '@components/Table';
import {Grip, STEP_SHARE, Shares, measuredShares, neighborOf, sought, traded} from '@components/Table/shares';
import {Direction, Rule, glyphs, ranked, unsorted} from '@components/DragSortableTable/sorting';
import {Shifted, Slid, anchored, surveyed} from '@components/DragSortableTable/survey';
import {array} from '@components/arrays';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {hydrated, recentTrades} from '@pages/Demos/Tables/Aggregations/recent-trades';
import {LiveTradesState, liveTrades, opening} from '@pages/Demos/Charts/live-trades';
import {Trade} from '@pages/Demos/Charts/coinbase';

const directions: Record<string, Direction> = {ascending: 'ascending', descending: 'descending'};

export const columnSteps: Record<string, number> = {ArrowRight: 1, ArrowLeft: -1};

export const rowSteps: Record<string, number> = {ArrowDown: 1, ArrowUp: -1};

const quiet = {tradeFeed: '', tradeHistory: '', tradeProduct: ''};

export type Desk = {
  order: readonly string[];
  seats: readonly number[];
  seated: readonly number[];
  shares: Shares | undefined;
};

export type Shell = {
  document: Document;
  table: HTMLTableElement;
  body: HTMLTableSectionElement;
  lanes: readonly HTMLTableRowElement[];
  desk: Desk;
  paint: () => void;
  bake: () => void;
};

export const columnOf = (desk: Desk, cell: Element): string =>
  desk.order.find(name => cell.classList.contains(name)) ?? '';

const announce = (document: Document, column: string, rule?: Rule): void => {
  maybe(document.querySelector(`th.${column}`)).map(header => {
    const sorted = rule?.column === column ? rule.direction : undefined;
    if (has(sorted)) {
      header.setAttribute('aria-sort', sorted);
    } else {
      header.removeAttribute('aria-sort');
    }
    maybe(header.querySelector('.menu-toggle')).map(toggle => {
      toggle.textContent = has(sorted) ? glyphs[sorted] : unsorted;
    });
  });
};

const wireMenu = (document: Document, column: string, choose: (rule?: Rule) => void): void => {
  maybe(document.getElementById(`sort-${column}`)).map(menu =>
    [...menu.querySelectorAll('button.item')].forEach(item =>
      item.addEventListener('click', () => {
        const direction = directions[(item.textContent ?? '').trim()];
        choose(has(direction) ? {column, direction} : undefined);
        menu.hidePopover();
      })));
};

export const dressGrips = ({table, desk}: Shell): void => {
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

export const moveColumn = (shell: Shell, from: number, to: number): void => {
  const {table, desk} = shell;
  [...table.rows].forEach(lane => {
    const cell = lane.cells[from];
    const target = lane.cells[to];
    if (from < to) {
      target.after(cell);
    } else {
      target.before(cell);
    }
  });
  desk.order = array.moveToIndex(to, desk.order[from], desk.order);
  dressGrips(shell);
};

export const moveRow = ({desk}: Shell, held: number, struck: number): void => {
  desk.seats = array.moveToIndex(desk.seats.indexOf(struck), held, desk.seats);
};

const shedMarks = (element: HTMLElement, name: string): void => {
  element.addEventListener('animationend', event => {
    if (event.animationName === name) {
      element.classList.remove(name);
      element.style.removeProperty('--carried');
      element.style.removeProperty('--toward');
      element.style.removeProperty('--drop');
    }
  }, {once: true});
};

const markCell = (cell: Element, mark: {toward: 'left' | 'right'; by: number}): void => {
  if (cell instanceof HTMLElement) {
    cell.style.setProperty('--carried', `${mark.by}px`);
    cell.style.setProperty('--toward', mark.toward === 'left' ? '1' : '-1');
    cell.classList.add('displaced');
    shedMarks(cell, 'displaced');
  }
};

export const markColumns = ({table, desk, lanes}: Shell, marks: Slid): void => {
  Object.entries(marks).forEach(([column, mark]) => {
    const at = desk.order.indexOf(column);
    maybe(table.querySelector(`th.${column}`)).map(header => markCell(header, mark));
    lanes.forEach(lane => markCell(lane.cells[at], mark));
  });
};

export const markRows = ({lanes}: Shell, drops: Shifted): void => {
  Object.entries(drops).forEach(([row, drop]) =>
    maybe(lanes[Number(row)]).map(lane => {
      lane.style.setProperty('--drop', `${drop}px`);
      lane.classList.add('shifted');
      shedMarks(lane, 'shifted');
    }));
};

export const hideColumn = ({table, desk, lanes}: Shell, column: string): void => {
  maybe(table.querySelector(`th.${column}`)).map(th => th.classList.add('hide'));
  lanes.forEach(lane => lane.cells[desk.order.indexOf(column)].classList.add('hide-across'));
};

export const unhideColumn = ({table, desk, lanes}: Shell, column: string): void => {
  maybe(table.querySelector(`th.${column}`)).map(th => th.classList.remove('hide'));
  lanes.forEach(lane => lane.cells[desk.order.indexOf(column)].classList.remove('hide-across'));
};

export const hideRow = ({lanes}: Shell, row: number): void =>
  [...lanes[row].cells].forEach(cell => cell.classList.add('hide-across'));

export const unhideRow = ({lanes}: Shell, row: number): void =>
  [...lanes[row].cells].forEach(cell => cell.classList.remove('hide-across'));

export type Flight = {
  travel: (event: PointerEvent) => void;
  land: () => void;
};

export const takeFlight = ({document}: Shell, event: PointerEvent, flight: Flight): void => {
  const surface = document.createElement('article');
  surface.className = 'drag-surface';
  document.body.append(surface);
  let flown = false;
  const done = (): void => {
    if (flown) {
      return;
    }
    flown = true;
    flight.land();
    surface.remove();
  };
  surface.addEventListener('pointermove', moving => {
    if (moving.buttons === 0) {
      done();
      return;
    }
    flight.travel(moving);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ending =>
    surface.addEventListener(ending, done));
  surface.setPointerCapture(event.pointerId);
};

export type GhostFlight = {
  element: HTMLTableElement;
  drift: (x: number, y: number) => void;
  land: () => void;
};

const summoned = (document: Document, id: string): HTMLTemplateElement => {
  const template = document.getElementById(id);
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`no template "${id}" in the page`);
  }
  return template;
};

const summonedTable = (document: Document, id: string): HTMLTableElement => {
  const clone = summoned(document, id).content.cloneNode(true);
  const element = clone instanceof DocumentFragment ? clone.firstElementChild : clone;
  if (!(element instanceof HTMLTableElement)) {
    throw new Error(`template "${id}" holds no table`);
  }
  return element;
};

const flown = (document: Document, element: HTMLTableElement, at: {x: number; y: number; width: number}): GhostFlight => {
  element.style.setProperty('--flight-x', `${at.x}px`);
  element.style.setProperty('--flight-y', `${at.y}px`);
  element.style.setProperty('--flight-width', `${at.width}px`);
  element.style.setProperty('--drift-x', '0px');
  element.style.setProperty('--drift-y', '0px');
  document.body.append(element);
  return {
    element,
    drift: (x, y) => {
      element.style.setProperty('--drift-x', `${x}px`);
      element.style.setProperty('--drift-y', `${y}px`);
    },
    land: () => element.remove()
  };
};

export const columnGhost = ({document, table, desk, lanes}: Shell, column: string): GhostFlight => {
  const at = desk.order.indexOf(column);
  const th = maybe(table.querySelector(`th.${column}`)).orElse(table);
  const ghost = summonedTable(document, 'column-ghost');
  maybe(ghost.querySelector('th')).map(header => header.classList.add(column));
  maybe(ghost.querySelector('.header-cell-content')).map(content => {
    content.textContent = column;
  });
  [...ghost.querySelectorAll('tbody td')].forEach((td, seat) =>
    maybe(lanes[seat]).map(lane => {
      const cell = lane.cells[at];
      td.textContent = (cell.textContent ?? '').trim();
      if (td instanceof HTMLElement) {
        td.style.height = `${cell.getBoundingClientRect().height}px`;
      }
    }));
  const box = th.getBoundingClientRect();
  return flown(document, ghost, {x: box.x, y: box.y, width: box.width});
};

export const rowGhost = ({document, lanes}: Shell, row: number): GhostFlight => {
  const lane = lanes[row];
  const ghost = summonedTable(document, 'row-ghost');
  maybe(ghost.querySelector('tr')).map(seat =>
    [...seat.children].forEach((cell, at) => {
      if (!(cell instanceof HTMLTableCellElement)) {
        return;
      }
      cell.style.width = `${lane.cells[at].getBoundingClientRect().width}px`;
      const text = (lane.cells[at].textContent ?? '').trim();
      if (at === 0) {
        maybe(cell.querySelector('.row-header-content')).map(content => content.append(text));
      } else {
        cell.textContent = text;
      }
    }));
  const box = lane.getBoundingClientRect();
  return flown(document, ghost, {x: box.x, y: box.y, width: box.width});
};

const dressColumn = (table: HTMLTableElement, column: string, share: number): void => {
  maybe(table.querySelector(`th.${column}`)).map(header => {
    if (!(header instanceof HTMLTableCellElement)) {
      return;
    }
    header.classList.add('shared');
    header.style.setProperty('--share', `${share}%`);
    maybe(header.querySelector('.resize-handle')).map(handle =>
      handle.setAttribute('aria-label', `resize ${column}, ${Math.round(share)}%`));
  });
};

const dressShares = (table: HTMLTableElement, desk: Desk): void => {
  maybe(desk.shares).map(shares => {
    table.classList.add('apportioned');
    desk.order.forEach(column => dressColumn(table, column, shares[column]));
  });
};

const wireHandle = (table: HTMLTableElement, desk: Desk, column: string, handle: HTMLButtonElement): void => {
  let grip: Grip | undefined;
  let carried = 0;

  const awaken = (): void => {
    desk.shares = desk.shares ?? measuredShares(desk.order, table);
    dressShares(table, desk);
  };

  const trade = (delta: number): void => {
    maybe(desk.shares).map(shares => {
      desk.shares = traded(column, neighborOf(desk.order, column), delta)(shares);
      dressShares(table, desk);
    });
  };

  handle.addEventListener('focus', awaken);
  handle.addEventListener('pointerdown', event => {
    event.stopPropagation();
    awaken();
    const pxPerShare = table.getBoundingClientRect().width / 100;
    if (pxPerShare) {
      grip = {fromX: event.clientX, pxPerShare};
      carried = 0;
    }
  });
  handle.addEventListener('pointermove', event => {
    if (!has(grip)) {
      return;
    }
    handle.setPointerCapture(event.pointerId);
    const share = sought(grip, event.clientX);
    trade(share - carried);
    carried = share;
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(landing =>
    handle.addEventListener(landing, () => {
      grip = undefined;
    }));
  handle.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
      event.stopPropagation();
      awaken();
      trade(toward * STEP_SHARE);
    });
  });
};

const wireResize = (table: HTMLTableElement, desk: Desk): void => {
  [...table.querySelectorAll('.resize-handle')]
    .filter(handle => handle instanceof HTMLButtonElement)
    .forEach(handle => maybe(handle.closest('th')).map(th =>
      wireHandle(table, desk, columnOf(desk, th), handle)));
};

export type Dressage = {
  travels: (shell: Shell) => void;
  ruled?: (shell: Shell, heights: Readonly<Record<number, number>>, before: readonly number[], after: readonly number[]) => void;
};

export const stand = (document: Document, dressage: Dressage): void => {
  maybe(document.querySelector('table')).map(table =>
    maybe(table.querySelector('tbody')).map(body => standTable(document, table, body, dressage)));
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
  const desk: Desk = {order, seats: dealt, seated: dealt, shares: undefined};
  const env = {...quiet, ...window.__env};

  let history: readonly Trade[] = [];
  let live: LiveTradesState = opening;
  let rule: Rule | undefined;

  const paint = (): void => {
    const rows: Row[] = windowedAggregates(hydrated(history, live.trades)).map(cells);
    lanes.forEach((lane, at) =>
      measures.forEach(measure => {
        const {display} = rows[at][measure];
        const cell = lane.cells[desk.order.indexOf(measure)];
        const next = typeof display === 'string' ? display : '';
        if (cell.textContent !== next) {
          cell.textContent = next;
        }
      }));
    const standing = has(rule) ? ranked(rows, desk.seats, rule) : desk.seats;
    if (standing.some((at, position) => desk.seated[position] !== at)) {
      desk.seated = standing;
      desk.seated.forEach((at, position) => {
        const desired = lanes[at];
        if (body.children[position] !== desired) {
          body.insertBefore(desired, body.children[position] ?? null);
        }
      });
      desk.seated.forEach((at, position) =>
        maybe(lanes[at].querySelector('button.grip')).map(grip => {
          const label = `move row ${position + 1}`;
          if (grip.getAttribute('aria-label') !== label) {
            grip.setAttribute('aria-label', label);
          }
        }));
    } else {
      desk.seated = standing;
    }
  };

  const bake = (): void => {
    desk.seats = desk.seated;
    if (has(rule)) {
      rule = undefined;
      measures.forEach(column => announce(document, column, rule));
    }
  };

  const shell: Shell = {document, table, body, lanes, desk, paint, bake};

  const choose = (next?: Rule): void => {
    rule = next;
    const before = desk.seated;
    const heights = surveyed(table, desk.order, desk.seated).rowHeights;
    paint();
    if (has(ruled) && desk.seated.some((at, position) => before[position] !== at)) {
      ruled(shell, heights, before, desk.seated);
    }
    measures.forEach(column => announce(document, column, rule));
  };

  measures.forEach(column => wireMenu(document, column, choose));
  wireResize(table, desk);
  [...table.querySelectorAll('.menu-toggle, .menu')].forEach(chrome =>
    chrome.addEventListener('pointerdown', event => event.stopPropagation()));

  dressGrips(shell);
  travels(shell);

  if (env.tradeHistory) {
    recentTrades(env.tradeHistory, env.tradeProduct, trades => {
      history = trades;
      paint();
    });
  }
  if (env.tradeFeed) {
    liveTrades(env.tradeFeed, env.tradeProduct, next => {
      live = next(live);
      paint();
    }, () => undefined);
  }
};
