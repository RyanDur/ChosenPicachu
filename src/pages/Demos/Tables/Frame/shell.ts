import {has, maybe} from '@ryandur/sand';
import {Row} from '@components/Table';
import {Grip, STEP_SHARE, Shares, measuredShares, neighborOf, sought, traded} from '@components/Table/shares';
import {Direction, Rule, glyphs, ranked, unsorted} from '@components/DragSortableTable/sorting';
import {Shifted, Slid} from '@components/DragSortableTable/survey';
import {array} from '@components/arrays';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {hydrated, recentTrades} from '@pages/Demos/Tables/Aggregations/recent-trades';
import {LiveTradesState, liveTrades, opening} from '@pages/Demos/Charts/live-trades';
import {Trade} from '@pages/Demos/Charts/coinbase';

export const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

export const columns = ['window', ...measures];

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

export const moveColumn = ({table, desk}: Shell, from: number, to: number): void => {
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

export const markColumns = ({table}: Shell, marks: Slid): void => {
  Object.entries(marks).forEach(([column, mark]) =>
    [...table.querySelectorAll(`.${column}`)].forEach(cell => markCell(cell, mark)));
};

export const markRows = ({lanes}: Shell, drops: Shifted): void => {
  Object.entries(drops).forEach(([row, drop]) =>
    maybe(lanes[Number(row)]).map(lane => {
      lane.style.setProperty('--drop', `${drop}px`);
      lane.classList.add('shifted');
      shedMarks(lane, 'shifted');
    }));
};

export const hideColumn = ({table}: Shell, column: string): void => {
  maybe(table.querySelector(`th.${column}`)).map(th => th.classList.add('hide'));
  [...table.querySelectorAll(`td.${column}`)].forEach(cell => cell.classList.add('hide-across'));
};

export const unhideColumn = ({table}: Shell, column: string): void => {
  maybe(table.querySelector(`th.${column}`)).map(th => th.classList.remove('hide'));
  [...table.querySelectorAll(`td.${column}`)].forEach(cell => cell.classList.remove('hide-across'));
};

export const hideRow = ({lanes}: Shell, row: number): void =>
  [...lanes[row].cells].forEach(cell => cell.classList.add('hide-across'));

export const unhideRow = ({lanes}: Shell, row: number): void =>
  [...lanes[row].cells].forEach(cell => cell.classList.remove('hide-across'));

export type GhostFlight = {
  element: HTMLTableElement;
  drift: (x: number, y: number) => void;
  land: () => void;
};

const flown = (document: Document, at: {x: number; y: number; width: number}): GhostFlight => {
  const element = document.createElement('table');
  element.className = 'fancy-table column-ghost';
  element.setAttribute('aria-hidden', 'true');
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

export const columnGhost = ({document, table, lanes}: Shell, column: string): GhostFlight => {
  const th = maybe(table.querySelector(`th.${column}`)).orElse(table);
  const at = th.getBoundingClientRect();
  const ghost = flown(document, {x: at.x, y: at.y, width: at.width});
  const texts = [
    `<thead class="header"><tr class="row"><th scope="col" class="cell ${column} header-cell clipped">` +
    `<div class="header-cell-content">${column}</div></th></tr></thead>`,
    '<tbody class="body">',
    ...lanes.map(lane => {
      const text = maybe(lane.querySelector(`.${column}`)).map(cell => cell.textContent ?? '').orElse('');
      const height = maybe(lane.querySelector(`.${column}`)).map(cell => cell.getBoundingClientRect().height).orElse(0);
      return `<tr class="row"><td class="cell ${column}" style="height: ${height}px">${text.trim()}</td></tr>`;
    }),
    '</tbody>'
  ];
  ghost.element.innerHTML = texts.join('');
  return ghost;
};

export const rowGhost = ({document, desk, lanes}: Shell, row: number): GhostFlight => {
  const lane = lanes[row];
  const at = lane.getBoundingClientRect();
  const ghost = flown(document, {x: at.x, y: at.y, width: at.width});
  const dressed = desk.order.map(column => {
    const text = maybe(lane.querySelector(`.${column}`)).map(cell => (cell.textContent ?? '').trim()).orElse('');
    return column === 'window'
      ? `<th scope="row" class="cell ${column} row-header"><div class="row-header-content">${text}</div></th>`
      : `<td class="cell ${column}">${text}</td>`;
  });
  ghost.element.innerHTML = `<tbody class="body"><tr class="row">${dressed.join('')}</tr></tbody>`;
  return ghost;
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

export const stand = (document: Document, travels: (shell: Shell) => void): void => {
  maybe(document.querySelector('table')).map(table =>
    maybe(table.querySelector('tbody')).map(body => standTable(document, table, body, travels)));
};

const standTable = (
  document: Document,
  table: HTMLTableElement,
  body: HTMLTableSectionElement,
  travels: (shell: Shell) => void
): void => {
  const lanes = [...body.querySelectorAll('tr')];
  const dealt = lanes.map((_, at) => at);
  const desk: Desk = {order: columns, seats: dealt, seated: dealt, shares: undefined};
  const env = {...quiet, ...window.__env};

  let history: readonly Trade[] = [];
  let live: LiveTradesState = opening;
  let rule: Rule | undefined;

  const paint = (): void => {
    const rows: Row[] = windowedAggregates(hydrated(history, live.trades)).map(cells);
    lanes.forEach((lane, at) =>
      measures.forEach(measure =>
        maybe(lane.querySelector(`.${measure}`)).map(cell => {
          const {display} = rows[at][measure];
          cell.textContent = typeof display === 'string' ? display : '';
        })));
    desk.seated = has(rule) ? ranked(rows, desk.seats, rule) : desk.seats;
    desk.seated.forEach(at => body.append(lanes[at]));
    desk.seated.forEach((at, position) =>
      maybe(lanes[at].querySelector('button.grip')).map(grip =>
        grip.setAttribute('aria-label', `move row ${position + 1}`)));
  };

  const choose = (next?: Rule): void => {
    rule = next;
    paint();
    measures.forEach(column => announce(document, column, rule));
  };

  measures.forEach(column => wireMenu(document, column, choose));
  wireResize(table, desk);
  [...table.querySelectorAll('.menu-toggle')].forEach(toggle =>
    toggle.addEventListener('pointerdown', event => event.stopPropagation()));

  travels({document, table, body, lanes, desk, paint});

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
