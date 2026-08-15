import {has, maybe} from '@ryandur/sand';
import {Row} from '@components/Table';
import {Direction, Rule, glyphs, ranked, unsorted} from '@components/DragSortableTable/sorting';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {hydrated, recentTrades} from '@pages/Demos/Tables/Aggregations/recent-trades';
import {LiveTradesState, liveTrades, opening} from '@pages/Demos/Charts/live-trades';
import {Trade} from '@pages/Demos/Charts/coinbase';

const measures = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

const directions: Record<string, Direction> = {ascending: 'ascending', descending: 'descending'};

const quiet = {tradeFeed: '', tradeHistory: '', tradeProduct: ''};

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

export const wire = (document: Document): void => {
  maybe(document.querySelector('tbody')).map(body => {
    const lanes = [...body.querySelectorAll('tr')];
    const dealt = lanes.map((_, at) => at);
    const env = {...quiet, ...window.__env};

    let history: readonly Trade[] = [];
    let live: LiveTradesState = opening;
    let rule: Rule | undefined;

    const paint = (): void => {
      const rows: Row[] = windowedAggregates(hydrated(history, live.trades)).map(cells);
      lanes.forEach((lane, at) =>
        measures.forEach((measure, offset) => {
          const {display} = rows[at][measure];
          lane.cells[offset + 1].textContent = typeof display === 'string' ? display : '';
        }));
      const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;
      standing.forEach(at => body.append(lanes[at]));
    };

    const choose = (next?: Rule): void => {
      rule = next;
      paint();
      measures.forEach(column => announce(document, column, rule));
    };

    measures.forEach(column => wireMenu(document, column, choose));

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
  });
};
