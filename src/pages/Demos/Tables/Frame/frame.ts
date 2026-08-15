import {has, maybe} from '@ryandur/sand';
import {Row} from '@components/Table';
import {Direction, Rule, glyphs, ranked, unsorted} from '@components/DragSortableTable/sorting';
import {Bounds, columnUnder, interior, surveyed} from '@components/DragSortableTable/survey';
import {array} from '@components/arrays';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {hydrated, recentTrades} from '@pages/Demos/Tables/Aggregations/recent-trades';
import {LiveTradesState, liveTrades, opening} from '@pages/Demos/Charts/live-trades';
import {Trade} from '@pages/Demos/Charts/coinbase';

const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

const columns = ['window', ...measures];

const directions: Record<string, Direction> = {ascending: 'ascending', descending: 'descending'};

const steps: Record<string, number> = {ArrowRight: 1, ArrowLeft: -1};

const quiet = {tradeFeed: '', tradeHistory: '', tradeProduct: ''};

type Desk = {
  order: readonly string[];
  seated: readonly number[];
};

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
  const held = (): string => desk.order.find(name => th.classList.contains(name)) ?? '';
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
    const struck = columnUnder(desk.order, survey)(event.clientX, event.clientY, held());
    if (has(struck) && struck !== held()) {
      moveColumn(table, desk, desk.order.indexOf(held()), interior(desk.order.indexOf(struck), desk.order.length));
    }
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(landing =>
    th.addEventListener(landing, () => {
      survey = undefined;
    }));
  th.addEventListener('keydown', event => {
    maybe(steps[event.key]).map(toward => {
      event.preventDefault();
      const from = desk.order.indexOf(held());
      const to = interior(from + toward, desk.order.length);
      if (to !== from) {
        moveColumn(table, desk, from, to);
      }
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

const wireTable = (document: Document, table: HTMLTableElement, body: HTMLTableSectionElement): void => {
  const lanes = [...body.querySelectorAll('tr')];
  const dealt = lanes.map((_, at) => at);
  const desk: Desk = {order: columns, seated: dealt};
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
    desk.seated = has(rule) ? ranked(rows, dealt, rule) : dealt;
    desk.seated.forEach(at => body.append(lanes[at]));
  };

  const choose = (next?: Rule): void => {
    rule = next;
    paint();
    measures.forEach(column => announce(document, column, rule));
  };

  measures.forEach(column => wireMenu(document, column, choose));
  wireDrag(table, desk);

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
