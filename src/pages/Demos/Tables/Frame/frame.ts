import {has, maybe} from '@ryandur/sand';
import {Row} from '@components/Table';
import {Grip, STEP_SHARE, Shares, measuredShares, neighborOf, sought, traded} from '@components/Table/shares';
import {Direction, Rule, glyphs, ranked, unsorted} from '@components/DragSortableTable/sorting';
import {Bounds, Survey, columnUnder, interior, rowUnder, surveyed} from '@components/DragSortableTable/survey';
import {array} from '@components/arrays';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {hydrated, recentTrades} from '@pages/Demos/Tables/Aggregations/recent-trades';
import {LiveTradesState, liveTrades, opening} from '@pages/Demos/Charts/live-trades';
import {Trade} from '@pages/Demos/Charts/coinbase';

const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

const columns = ['window', ...measures];

const directions: Record<string, Direction> = {ascending: 'ascending', descending: 'descending'};

const columnSteps: Record<string, number> = {ArrowRight: 1, ArrowLeft: -1};

const rowSteps: Record<string, number> = {ArrowDown: 1, ArrowUp: -1};

const quiet = {tradeFeed: '', tradeHistory: '', tradeProduct: ''};

type Desk = {
  order: readonly string[];
  seats: readonly number[];
  seated: readonly number[];
  shares: Shares | undefined;
};

const columnOf = (desk: Desk, cell: Element): string =>
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

const moveColumn = (table: HTMLTableElement, desk: Desk, from: number, to: number): void => {
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

const wireGrip = (table: HTMLTableElement, desk: Desk, th: HTMLTableCellElement): void => {
  let survey: Bounds | undefined;

  th.classList.add('grabbable');
  th.tabIndex = 0;

  th.addEventListener('pointerdown', () => {
    survey = surveyed(table, desk.order, desk.seated);
  });
  th.addEventListener('pointermove', event => {
    if (!has(survey)) {
      return;
    }
    if (event.buttons === 0) {
      survey = undefined;
      return;
    }
    th.setPointerCapture(event.pointerId);
    const held = columnOf(desk, th);
    const struck = columnUnder(desk.order, survey)(event.clientX, event.clientY, held);
    if (has(struck) && struck !== held) {
      moveColumn(table, desk, desk.order.indexOf(held), interior(desk.order.indexOf(struck), desk.order.length));
    }
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(landing =>
    th.addEventListener(landing, () => {
      survey = undefined;
    }));
  th.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
      const from = desk.order.indexOf(columnOf(desk, th));
      const to = interior(from + toward, desk.order.length);
      if (to !== from) {
        moveColumn(table, desk, from, to);
      }
    });
  });
};

const wireRowGrip = (
  desk: Desk,
  held: number,
  grip: HTMLButtonElement,
  repaint: () => void
): void => {
  let survey: Survey | undefined;

  grip.addEventListener('pointerdown', () => {
    maybe(grip.closest('table')).map(table => {
      survey = surveyed(table, desk.order, desk.seated);
    });
  });
  grip.addEventListener('pointermove', event => {
    if (!has(survey)) {
      return;
    }
    if (event.buttons === 0) {
      survey = undefined;
      return;
    }
    grip.setPointerCapture(event.pointerId);
    const struck = rowUnder(desk.seated, survey)(event.clientX, event.clientY, held);
    if (has(struck) && struck !== held) {
      desk.seats = array.moveToIndex(desk.seats.indexOf(struck), held, desk.seats);
      repaint();
    }
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(landing =>
    grip.addEventListener(landing, () => {
      survey = undefined;
    }));
  grip.addEventListener('keydown', event => {
    maybe(rowSteps[event.key]).map(toward => {
      event.preventDefault();
      const from = desk.seats.indexOf(held);
      const to = Math.min(Math.max(from + toward, 0), desk.seats.length - 1);
      if (to !== from) {
        desk.seats = array.moveToIndex(to, held, desk.seats);
        repaint();
      }
    });
  });
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

const wireDrag = (table: HTMLTableElement, desk: Desk): void => {
  [...table.querySelectorAll('thead th')]
    .filter(th => th instanceof HTMLTableCellElement)
    .forEach(th => wireGrip(table, desk, th));
  [...table.querySelectorAll('.menu-toggle')].forEach(toggle =>
    toggle.addEventListener('pointerdown', event => event.stopPropagation()));
};

const wireResize = (table: HTMLTableElement, desk: Desk): void => {
  [...table.querySelectorAll('.resize-handle')]
    .filter(handle => handle instanceof HTMLButtonElement)
    .forEach(handle => maybe(handle.closest('th')).map(th =>
      wireHandle(table, desk, columnOf(desk, th), handle)));
};

const wireTable = (document: Document, table: HTMLTableElement, body: HTMLTableSectionElement): void => {
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
  wireDrag(table, desk);
  wireResize(table, desk);
  lanes.forEach((lane, held) =>
    [...lane.querySelectorAll('button.grip')]
      .filter(grip => grip instanceof HTMLButtonElement)
      .forEach(grip => wireRowGrip(desk, held, grip, paint)));

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

export const wire = (document: Document): void => {
  maybe(document.querySelector('table')).map(table =>
    maybe(table.querySelector('tbody')).map(body => wireTable(document, table, body)));
};
