import {has, maybe} from '@ryandur/sand';
import {Row} from '@components/Table';
import {Direction, Rule, glyphs, ranked, unsorted} from '@components/DragSortableTable/sorting';

const columns = ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

const directions: Record<string, Direction> = {ascending: 'ascending', descending: 'descending'};

const numeric = (text: string): number | undefined => {
  const parsed = Number(text.replace(/[$,+—]/g, ''));
  return text === '' || Number.isNaN(parsed) ? undefined : parsed;
};

const dealtRows = (lanes: readonly HTMLTableRowElement[]): Row[] =>
  lanes.map(lane =>
    columns.reduce<Row>((row, column, at) => {
      const display = (lane.cells[at].textContent ?? '').trim();
      return {...row, [column]: {display, value: at === 0 ? display : numeric(display)}};
    }, {}));

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
        const direction = directions[item.textContent ?? ''];
        choose(has(direction) ? {column, direction} : undefined);
        menu.hidePopover();
      })));
};

export const wire = (document: Document): void => {
  maybe(document.querySelector('tbody')).map(body => {
    const lanes = [...body.querySelectorAll('tr')];
    const rows = dealtRows(lanes);
    const dealt = lanes.map((_, at) => at);

    const choose = (rule?: Rule): void => {
      const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;
      standing.forEach(at => body.append(lanes[at]));
      columns.forEach(column => announce(document, column, rule));
    };

    columns.forEach(column => wireMenu(document, column, choose));
  });
};
