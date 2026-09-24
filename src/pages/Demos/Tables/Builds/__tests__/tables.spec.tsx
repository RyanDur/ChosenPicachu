import {FC, useReducer} from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Measured, Measures, measures} from '../../Aggregations/cells';
import {measuresFor} from '../../Aggregations/__test_support';
import {BodyEvents, HeaderEvents} from '@components/DragSortableTable/context';
import {TableColumn} from '@components/DragSortableTable/table-state';
import {arrangementOf, arrangementReducer, arrived, columnMoved, rowMoved, sorted} from '@components/DragSortableTable/arrangement';
import {columnsOf, rowsOf} from '@pages/Demos/store';
import {EagerTable} from '../EagerTable';
import {LazyTable} from '../LazyTable';
import {blurFocusOnMoves} from '@__test_support/focus';
import {Column, DragSortableTable} from '@components/DragSortableTable';
import {ColumnInHand, RowInHand, liftedColumn, liftedRow, noColumnInHand, noRowInHand, rect, rowsLaidOut, rowsSurveyed} from '@components/DragSortableTable/__test_support';

type Table = FC<HeaderEvents & BodyEvents & {caption: string; className?: string; columns: readonly TableColumn<Measured>[]; rows: readonly Measures[]}>;

const windows = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

const startingRows = [3, 9, 5, 7, 1].map((trades, at) => measuresFor(windows[at], trades));

const windowOf = (row: Measures): string => row.window.display;

const Page: FC<{Table: Table; rows: readonly Measures[]; dials: string}> = ({Table, rows, dials}) => {
  const [arrangement, dispatch] = useReducer(
    arrangementReducer,
    arrangementOf(measures.map(({name}) => name), rows.map(windowOf)));
  const arranged = arrangementReducer(arrangement, arrived(rows.map(windowOf)));

  return <Table caption="live aggregations" className={dials} columns={columnsOf(arranged)} rows={rowsOf(arranged, rows)}
    onColumnMoved={({column, to}) => dispatch(columnMoved(column, to))}
    onSorted={({column, direction}) => dispatch(sorted(column, direction))}
    onRowMoved={({row, to, standing: shownStanding}) => dispatch(rowMoved(row, to, shownStanding))}/>;
};

const seated = (Table: Table, rows: readonly Measures[], dials = 'hide animated') => <Page Table={Table} rows={rows} dials={dials}/>;

const seat = (Table: Table, dials = 'hide animated', rows: readonly Measures[] = startingRows) => render(seated(Table, rows, dials));

describe('a header the table does not know', () => {
  test('stands on its own and wears its own name', () => {
    render(<DragSortableTable caption="a table" columns={[{name: 'window', data: {label: 'window'}}]} rows={[]}>
      <thead><tr><Column column="ghost" className="cell">a header</Column></tr></thead>
    </DragSortableTable>);

    expect(screen.getByRole('columnheader', {name: 'ghost'})).toBeVisible();
  });
});

const sourceTable = (): HTMLTableElement => {
  const found = screen.getAllByRole('table')[0];
  if (!(found instanceof HTMLTableElement)) throw new Error('no table');
  return found;
};
const nameOf = (header: Element): string => header.getAttribute('aria-label') ?? '';
const seats = (): HTMLElement[] => {
  const table = within(sourceTable());
  return [...table.getAllByRole('columnheader'), ...table.getAllByRole('rowheader'), ...table.getAllByRole('cell')];
};
const carried = (): Element[] => seats().filter(seat => seat.classList.contains('carried'));
const columnOrder = (): string[] => within(sourceTable()).getAllByRole('columnheader').map(nameOf);
const header = (name: string): HTMLElement => within(sourceTable()).getByRole('columnheader', {name});
const ownText = (cell: Element): string =>
  cell.getAttribute('aria-label')
  ?? [...cell.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent ?? '').join('').trim();
const lanes = (): HTMLTableRowElement[] => [...sourceTable().tBodies[0].rows];
const windowNames = (): string[] => lanes().map(lane => ownText(lane.cells[0]));
const rowOf = (window: string): HTMLTableRowElement => {
  const row = lanes().find(lane => ownText(lane.cells[0]) === window);
  if (!row) throw new Error(`no row for ${window}`);
  return row;
};
const cellsOf = (window: string): string[] => [...rowOf(window).cells].map(ownText);
const grip = (window: string): HTMLElement => within(rowOf(window)).getByRole('button', {name: /move row/});
let heldRow = '';
let rowInHand: RowInHand = noRowInHand;
const liftRow = (window: string): void => {
  heldRow = window;
  rowsSurveyed(sourceTable());
  rowInHand = liftedRow(grip(window), windowNames().indexOf(window));
};
const startCarryingRow = (): void => rowInHand.carryStarted();
const carryRowOver = (target: string): void => rowInHand.carriedOver(windowNames().indexOf(heldRow), windowNames().indexOf(target));
const carryRowOn = (by: number): void => rowInHand.carriedOn(by);
const dropRow = (): void => rowInHand.dropped();
let widths: Record<string, number> = {};
const even = (): Record<string, number> => Object.fromEntries(measures.map(({name}) => [name, 100]));
beforeEach(() => {
  widths = even();
});
const columnsSurveyed = (): void => {
  const total = Object.values(widths).reduce((sum, width) => sum + width, 0);
  sourceTable().getBoundingClientRect = () => rect({left: 0, right: total, width: total, top: 0, bottom: 240, height: 240});
  let edge = 0;
  within(sourceTable()).getAllByRole('columnheader').forEach(head => {
    const left = edge;
    const width = widths[nameOf(head)] ?? 0;
    head.getBoundingClientRect = () => rect({x: left, left, width, right: left + width});
    edge += width;
  });
};
const edgeOf = (name: string): number => {
  let edge = 0;
  for (const each of columnOrder()) {
    if (each === name) break;
    edge += widths[each] ?? 0;
  }
  return edge;
};
let heldColumn = '';
let columnInHand: ColumnInHand = noColumnInHand;
const liftColumn = (name: string): void => {
  heldColumn = name;
  columnsSurveyed();
  columnInHand = liftedColumn(header(name), edgeOf(name) + (widths[name] ?? 0) / 2);
};
const carryColumnInto = (target: string, fraction: number): void => columnInHand.carriedTo(edgeOf(target) + (widths[target] ?? 0) * fraction);
const carryColumnOver = (target: string): void => {
  const order = columnOrder();
  carryColumnInto(target, order.indexOf(target) < order.indexOf(heldColumn) ? 0.25 : 0.75);
};
const startCarryingColumn = (): void => columnInHand.carryStarted();
const carryColumnOn = (by: {x?: number; y?: number}): void => columnInHand.carriedOn(by);
const loseColumnCaptureOver = (target: string): void => columnInHand.captureLostAt(edgeOf(target) + (widths[target] ?? 0) / 2);
const dropColumn = (): void => columnInHand.dropped();
afterEach(() => {
  heldRow = '';
  rowInHand = noRowInHand;
  heldColumn = '';
  columnInHand = noColumnInHand;
});
const announced = (): string[] => screen.getAllByRole('status', {name: 'move report'}).map(({textContent}) => textContent ?? '').filter(text => text !== '');
const menuFor = (label: string): HTMLElement => screen.getByLabelText(`${label} by`);

describe('columns by hand', () => {
  const surface = (): HTMLElement => header(heldColumn);

  test('an eager column follows the pointer as it crosses its neighbors', () => {
    seat(EagerTable, 'keep static');

    liftColumn('trades');
    carryColumnOver('buys');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(cellsOf('last 5 minutes')).toEqual(['last 5 minutes', '0', '9', '0', '0.00', '—', '—']);
  });

  test('a lazy column waits for the drop', () => {
    seat(LazyTable, 'keep static');

    liftColumn('trades');
    carryColumnOver('buys');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);

    dropColumn();
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  test('a hiding column is carried, every cell of it', () => {
    seat(EagerTable, 'hide static');

    liftColumn('buys');

    expect(header('buys').classList).toContain('carried');
    windows.forEach(window => expect(rowOf(window).cells[2].classList).toContain('carried'));
  });

  test('a dropped column lands as itself', () => {
    seat(EagerTable, 'hide static');
    liftColumn('buys');

    carryColumnOver('trades');
    dropColumn();

    expect(carried()).toEqual([]);
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  test('the carried column wears its offset from home', () => {
    seat(EagerTable, 'hide static');

    liftColumn('trades');
    startCarryingColumn();
    carryColumnOn({x: 20, y: 15});

    [header('trades'), ...lanes().map(lane => lane.cells[1])].forEach(cell => {
      expect(cell).toHaveClass('carried');
      expect(cell).toHaveStyle({'--seat-x': '0px', '--drift-x': '20px', '--drift-y': '15px'});
    });
    dropColumn();
  });

  test('a settle mid-drag moves home under the carried column', () => {
    seat(EagerTable, 'hide static');
    liftColumn('trades');
    startCarryingColumn();
    carryColumnOn({x: 20, y: 15});

    carryColumnOver('buys');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    [header('trades'), ...lanes().map(lane => lane.cells[2])].forEach(cell => {
      expect(cell).toHaveStyle({'--seat-x': '-100px', '--drift-x': '125px', '--drift-y': '15px'});
    });
    dropColumn();
    expect(carried()).toEqual([]);
  });

  test('losing the pointer mid-drag keeps the column aloft', () => {
    seat(EagerTable, 'keep static');
    liftColumn('trades');
    const captured: number[] = [];
    surface().setPointerCapture = id => captured.push(id);
    carryColumnOver('buys');

    loseColumnCaptureOver('sells');

    expect(surface()).toHaveClass('carried');
    expect(captured).toEqual([1, 1]);
    dropColumn();
  });

  test('a column that loses the pointer keeps crossing its neighbours', () => {
    seat(EagerTable, 'keep static');
    liftColumn('trades');
    surface().setPointerCapture = () => undefined;
    carryColumnOver('buys');
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);

    loseColumnCaptureOver('sells');
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
    carryColumnOver('volume');

    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'trades', 'vwap', 'change']);
    dropColumn();
    expect(carried()).toEqual([]);
  });

  test('a column carried back without dropping comes home', () => {
    seat(EagerTable, 'keep static');

    liftColumn('trades');
    carryColumnOver('buys');
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);

    carryColumnOver('buys');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    dropColumn();
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  test('a lazy column carried home lands nowhere', () => {
    seat(LazyTable, 'keep static');

    liftColumn('trades');
    carryColumnOver('buys');
    carryColumnOver('trades');
    dropColumn();

    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  test('the switch waits until the column is a quarter into an even neighbor', () => {
    seat(EagerTable, 'keep static');

    liftColumn('trades');
    carryColumnInto('buys', 0.2);
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);

    carryColumnInto('buys', 0.3);
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    dropColumn();
  });

  test('a slim column reaches deeper into a wide neighbor before switching', () => {
    widths = {...even(), trades: 40, buys: 360};
    seat(EagerTable, 'keep static');

    liftColumn('trades');
    carryColumnInto('buys', 1 / 3);
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);

    carryColumnInto('buys', 1 / 2);
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    dropColumn();
  });

  test('the first and last columns hold their posts', () => {
    seat(EagerTable, 'keep static');

    liftColumn('window');
    expect(carried()).toEqual([]);

    liftColumn('buys');
    carryColumnOver('window');
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    dropColumn();
  });

  test('a keyboard walk says the move', async () => {
    seat(EagerTable, 'keep static');

    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('the lazy table says a column move', async () => {
    seat(LazyTable, 'keep static');

    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('a dropped column says where it landed', () => {
    seat(EagerTable, 'keep static');

    liftColumn('trades');
    carryColumnOver('buys');
    dropColumn();

    expect(announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('a menu appears only where the column asks for one', () => {
    seat(EagerTable, 'keep static');

    expect(screen.queryByRole('button', {name: 'sort window'})).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'sort trades'})).toBeVisible();
    expect(within(header('trades')).getByRole('button', {name: 'sort trades'})).toBeVisible();
    expect(within(header('window')).queryByRole('button', {name: 'sort window'})).not.toBeInTheDocument();
  });

  test('every column offers a resize handle', () => {
    seat(EagerTable, 'keep static');

    expect(within(header('trades')).getByRole('button', {name: /resize trades/})).toBeVisible();
    expect(within(header('window')).getByRole('button', {name: /resize window/})).toBeVisible();
  });
});

describe('rows by hand', () => {

  test('an eager row follows the pointer as it crosses its neighbors', () => {
    seat(EagerTable, 'keep static');

    liftRow('this minute');
    carryRowOver('last 15 minutes');

    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
  });

  test('every control says its tab stop outright, so a browser that tabs only to fields still reaches it', () => {
    seat(EagerTable, 'keep static');

    expect(grip('this minute')).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', {name: 'sort trades'})).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', {name: 'resize trades'})).toHaveAttribute('tabindex', '0');
    expect(within(menuFor('sort trades')).getByRole('button', {name: 'ascending', hidden: true})).toHaveAttribute('tabindex', '0');
  });

  test('a retaken pointer lands on the grip that lifted the row, never on the header cell', () => {
    seat(EagerTable, 'keep static');
    const retaken: string[] = [];
    liftRow('this minute');
    grip('this minute').setPointerCapture = () => retaken.push('grip');
    rowOf('this minute').cells[0].setPointerCapture = () => retaken.push('header cell');

    carryRowOver('last 5 minutes');
    fireEvent.lostPointerCapture(rowOf('this minute').cells[0], {buttons: 0, clientX: 100, clientY: 70, pointerId: 1});

    expect(retaken).toEqual(['grip']);
  });

  test('a row that lost the pointer keeps crossing its neighbours', () => {
    seat(EagerTable, 'keep static');
    liftRow('this minute');
    grip('this minute').setPointerCapture = () => undefined;
    carryRowOver('last 5 minutes');
    fireEvent.lostPointerCapture(rowOf('this minute').cells[0], {buttons: 0, clientX: 100, clientY: 70, pointerId: 1});
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);

    carryRowOver('last 15 minutes');

    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
  });

  test('a lazy row waits for the drop', () => {
    seat(LazyTable, 'keep static');

    liftRow('this minute');
    carryRowOver('last 15 minutes');
    expect(windowNames()).toEqual(windows);

    dropRow();
    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
  });

  test('a hiding row is carried, every cell of it', () => {
    seat(EagerTable, 'hide static');

    liftRow('last 5 minutes');

    [...rowOf('last 5 minutes').cells].forEach(cell => expect(cell.classList).toContain('carried'));
  });

  test('a dropped row lands as itself', () => {
    seat(EagerTable, 'hide static');
    liftRow('last 5 minutes');

    carryRowOver('this minute');
    dropRow();

    expect(carried()).toEqual([]);
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  test('a row carried back without dropping comes home', () => {
    seat(EagerTable, 'keep static');

    liftRow('this minute');
    carryRowOver('last 5 minutes');
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);

    carryRowOver('last 5 minutes');
    dropRow();
    expect(windowNames()).toEqual(windows);
  });

  test('the carried row wears its offset from home on every cell', () => {
    seat(EagerTable, 'hide static');

    liftRow('last 5 minutes');
    startCarryingRow();
    carryRowOn(15);

    [...rowOf('last 5 minutes').cells].forEach(cell => {
      expect(cell).toHaveClass('carried');
      expect(cell).toHaveStyle({'--seat-y': '0px', '--drift-x': '0px', '--drift-y': '15px'});
    });
    dropRow();
    expect(carried()).toEqual([]);
  });

  test('the keyboard walks a row down and back up', async () => {
    seat(EagerTable, 'keep static');

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
  });

  test('the top row cannot walk off the table', async () => {
    seat(EagerTable, 'keep static');

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(windowNames()).toEqual(windows);
  });

  test('rows that arrive after the deal still walk', async () => {
    const {rerender} = render(seated(EagerTable, [], 'keep static'));
    rerender(seated(EagerTable, startingRows, 'keep static'));

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  test('rows that arrive after the deal still say the move', async () => {
    const {rerender} = render(seated(EagerTable, [], 'keep static'));
    rerender(seated(EagerTable, startingRows, 'keep static'));

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('rows that arrive after the deal still walk and say the move on the animated table', async () => {
    const {rerender} = render(seated(EagerTable, [], 'keep animated'));
    rerender(seated(EagerTable, startingRows, 'keep animated'));

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    expect(announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('rows that arrive after the deal still drag', () => {
    const {rerender} = render(seated(EagerTable, [], 'keep static'));
    rerender(seated(EagerTable, startingRows, 'keep static'));

    liftRow('this minute');
    carryRowOver('last 15 minutes');
    dropRow();

    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
  });

  test('a keyboard nudge says the move', async () => {
    seat(EagerTable, 'keep static');

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('the lazy table says a row move', async () => {
    seat(LazyTable, 'keep static');

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    expect(announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('a dropped row says where it landed', () => {
    seat(EagerTable, 'keep static');

    liftRow('this minute');
    carryRowOver('last 15 minutes');
    dropRow();

    expect(announced()).toEqual(['this minute moved to 3 of 5']);
  });
});

describe('sort criteria menus', () => {
  const retraded = (thisMinute: number): Measures[] => [measuresFor('this minute', thisMinute), ...startingRows.slice(1)];
  const tradesHeader = (): HTMLElement => header('trades');

  test('a direction chosen from the column menu sorts the rows', async () => {
    seat(EagerTable, 'keep static');

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));

    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(tradesHeader()).toHaveAttribute('aria-sort', 'descending');
  });

  test('the sort keeps sorting as the values change', async () => {
    const {rerender} = seat(EagerTable, 'keep static');

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'ascending', hidden: true}));
    expect(windowNames()).toEqual(['session', 'this minute', 'last 15 minutes', 'this hour', 'last 5 minutes']);

    rerender(seated(EagerTable, retraded(10), 'keep static'));
    expect(windowNames()).toEqual(['session', 'last 15 minutes', 'this hour', 'last 5 minutes', 'this minute']);
  });

  test('an arrow at the edge of a sorted table keeps the sort and adds no report', async () => {
    seat(EagerTable, 'keep static');
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));

    grip('last 5 minutes').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(tradesHeader()).toHaveAttribute('aria-sort', 'descending');
    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(announced()).toEqual(['trades sorted descending']);
  });

  test('choosing a sort says it', async () => {
    seat(EagerTable, 'keep static');

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    expect(announced()).toEqual(['trades sorted descending']);

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'reset', hidden: true}));
    expect(announced()).toEqual(['trades sort reset']);
  });

  test('a sort on a second column replaces what the page said about the first', async () => {
    seat(EagerTable, 'keep static');

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    await userEvent.click(within(menuFor('sort buys')).getByRole('button', {name: 'ascending', hidden: true}));

    expect(announced()).toEqual(['buys sorted ascending']);
  });

  test('a table speaks through one move report', () => {
    seat(EagerTable, 'keep static');

    expect(screen.getAllByRole('status', {name: 'move report'})).toHaveLength(1);
  });

  test('an arrow at the edge of a sorted lazy table keeps the sort and adds no report', async () => {
    seat(LazyTable, 'keep static');
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));

    grip('last 5 minutes').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(tradesHeader()).toHaveAttribute('aria-sort', 'descending');
    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(announced()).toEqual(['trades sorted descending']);
  });

  test('reset restores the starting order', async () => {
    seat(EagerTable, 'keep static');

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'reset', hidden: true}));

    expect(windowNames()).toEqual(windows);
    expect(tradesHeader()).not.toHaveAttribute('aria-sort');
  });

  test('a hand on a row ends the sort and keeps the standing order', async () => {
    seat(EagerTable, 'keep static');

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
    expect(tradesHeader()).not.toHaveAttribute('aria-sort');
  });

  test('the ended sort does not return when the values change', async () => {
    const {rerender} = seat(EagerTable, 'keep static');
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    grip('this minute').focus();
    await userEvent.keyboard('{ArrowUp}');

    rerender(seated(EagerTable, retraded(10), 'keep static'));

    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
  });

  test('the menu toggle never lifts the column', () => {
    seat(EagerTable, 'keep static');

    fireEvent.pointerDown(screen.getByRole('button', {name: 'sort trades'}), {clientX: 100, clientY: 20, pointerId: 1});

    expect(carried()).toEqual([]);
  });

  test('choosing a direction never lifts the column', async () => {
    seat(EagerTable, 'keep static');

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));

    expect(carried()).toEqual([]);
  });
});

describe('resizable columns', () => {
  const surveyed = (): void => {
    const spans: Record<string, number> = {window: 500, trades: 400, buys: 20, sells: 20, volume: 20, vwap: 20, change: 20};
    sourceTable().getBoundingClientRect = () => rect({width: 1000, right: 1000});
    within(sourceTable()).getAllByRole('columnheader').forEach(head => {
      head.getBoundingClientRect = () => rect({width: spans[nameOf(head)] ?? 0});
    });
  };

  test('a column takes no width of its own until a hand resizes it', () => {
    seat(EagerTable, 'keep static');

    expect(header('window').style.width).toBe('');
    expect(header('trades').style.width).toBe('');
    expect(screen.getByRole('button', {name: 'resize window'})).toBeVisible();
  });

  test('the first touch of a handle gives every column its share', () => {
    seat(EagerTable, 'keep static');
    surveyed();

    fireEvent.focus(screen.getByRole('button', {name: 'resize window'}));

    expect(screen.getByRole('button', {name: 'resize window, 50%'})).toBeVisible();
    expect(header('window').style.getPropertyValue('--share')).toBe('50%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('40%');
  });

  test('a resize whose pointer is cancelled stops following the pointer', () => {
    seat(EagerTable, 'keep static');
    surveyed();
    const handle = screen.getByRole('button', {name: 'resize window'});
    fireEvent.pointerDown(handle, {clientX: 100, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(handle, {buttons: 1, clientX: 110, clientY: 20, pointerId: 1});
    const shareAfterMoving = header('window').style.getPropertyValue('--share');

    fireEvent.pointerCancel(handle, {pointerId: 1});
    fireEvent.pointerMove(handle, {buttons: 0, clientX: 200, clientY: 20, pointerId: 1});

    expect(header('window').style.getPropertyValue('--share')).toBe(shareAfterMoving);
    expect(shareAfterMoving).not.toBe('50%');
  });

  test('pressing a handle without moving it reports nothing', () => {
    seat(EagerTable, 'keep static');
    surveyed();
    const handle = screen.getByRole('button', {name: 'resize window'});

    fireEvent.pointerDown(handle, {clientX: 100, clientY: 20, pointerId: 1});
    expect(announced()).toEqual([]);

    fireEvent.pointerUp(handle, {pointerId: 1});
    expect(announced()).toEqual([]);
  });

  test('an arrow right moves the boundary and the total holds', async () => {
    seat(EagerTable, 'keep static');
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize window'});
    await userEvent.click(handle);
    await userEvent.keyboard('{ArrowRight}');

    expect(header('window').style.getPropertyValue('--share')).toBe('52%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('38%');
    expect(screen.getByRole('button', {name: 'resize window, 52%'})).toBeVisible();
  });

  test('an arrow left moves the boundary back', async () => {
    seat(EagerTable, 'keep static');
    surveyed();
    const handle = screen.getByRole('button', {name: 'resize window'});
    await userEvent.click(handle);
    await userEvent.keyboard('{ArrowRight}');

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');

    expect(header('window').style.getPropertyValue('--share')).toBe('48%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('42%');
  });

  test('dragging the handle trades share between neighbors', () => {
    seat(EagerTable, 'keep static');
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize window'});
    fireEvent.pointerDown(handle, {clientX: 300, pointerId: 1});
    fireEvent.pointerMove(handle, {clientX: 340, pointerId: 1});
    fireEvent.pointerUp(handle, {pointerId: 1});

    expect(header('window').style.getPropertyValue('--share')).toBe('54%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('36%');
  });

  test('a dragged handle says the share it landed on', () => {
    seat(EagerTable, 'keep static');
    surveyed();
    const handle = screen.getByRole('button', {name: 'resize window'});

    fireEvent.pointerDown(handle, {clientX: 300, pointerId: 1});
    fireEvent.pointerMove(handle, {clientX: 340, pointerId: 1});
    fireEvent.pointerUp(handle, {pointerId: 1});

    expect(announced()).toEqual(['window resized to 54%']);
  });

  test('a second trade replaces what the page said about the first', async () => {
    seat(EagerTable, 'keep static');
    surveyed();
    await userEvent.click(screen.getByRole('button', {name: 'resize window'}));
    await userEvent.keyboard('{ArrowRight}');

    await userEvent.click(screen.getByRole('button', {name: /^resize trades/}));
    await userEvent.keyboard('{ArrowRight}');

    expect(announced()).toEqual(['trades resized to 35%']);
  });

  test('a resize says the new share', async () => {
    seat(EagerTable, 'keep static');
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize window'});
    await userEvent.click(handle);
    await userEvent.keyboard('{ArrowRight}');

    expect(announced()).toEqual(['window resized to 52%']);
  });

  test('a boundary can never starve a column', async () => {
    seat(EagerTable, 'keep static');
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize window'});
    await userEvent.click(handle);
    await userEvent.keyboard('{ArrowRight}'.repeat(30));
    expect(header('window').style.getPropertyValue('--share')).toBe('85%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('5%');
  });

  test('arrow keys on the resize handle never move the column', () => {
    seat(EagerTable, 'keep static');
    surveyed();

    const handle = screen.getByRole('button', {name: /resize trades/});
    fireEvent.focus(handle);
    fireEvent.keyDown(handle, {key: 'ArrowRight'});

    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  test('a widened column clips its overflow without marking its cells', () => {
    seat(EagerTable, 'keep static');

    expect(sourceTable().classList).toContain('apportioned');
    expect(header('window').classList).not.toContain('clipped');
    within(within(sourceTable()).getAllByRole('rowgroup')[1]).getAllByRole('cell')
      .forEach(cell => expect(cell.classList).not.toContain('ellipsis'));
  });
});

describe('animated moves', () => {
  const spanned = (): void => {
    sourceTable().getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 0, bottom: 240, height: 240});
    within(sourceTable()).getAllByRole('columnheader').forEach((head, at) => {
      head.getBoundingClientRect = () => rect({x: at * 100, left: at * 100, width: 100, right: at * 100 + 100});
    });
  };
  const settledRows = (): void => rowsLaidOut(sourceTable());
  const columnCells = (name: string): Element[] => [header(name), ...lanes().map(lane => lane.cells[columnOrder().indexOf(name)])];

  test('a keyboard walk settles the walked column and shoves its neighbour', async () => {
    seat(EagerTable, 'keep animated');
    spanned();

    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(carried()).toEqual([]);
    columnCells('trades').forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '-100px', '--settle-y': '0px'});
    });
    columnCells('buys').forEach(cell => {
      expect(cell).toHaveClass('shoved-start');
      expect(cell).toHaveStyle({'--shoved-by': '100px'});
    });
  });

  test('the marks clear when the animation ends', async () => {
    seat(EagerTable, 'keep animated');
    spanned();
    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');

    fireEvent.animationEnd(header('trades'));
    fireEvent.animationEnd(header('buys'));

    columnCells('trades').forEach(cell => expect(cell).not.toHaveClass('settling'));
    columnCells('buys').forEach(cell => expect(cell).not.toHaveClass('shoved-start'));
  });

  test('a second walk marks again', async () => {
    seat(EagerTable, 'keep animated');
    spanned();
    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');
    fireEvent.animationEnd(header('trades'));
    fireEvent.animationEnd(header('buys'));

    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
    expect(header('trades')).toHaveClass('settling');
    expect(header('sells')).toHaveClass('shoved-start');
  });

  test('a column walks the whole way right and back left, keypress after keypress, with no animation ending between, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    seat(EagerTable, 'keep animated');
    spanned();

    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);
    await userEvent.keyboard('{ArrowRight}');
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    await userEvent.keyboard('{ArrowLeft}');
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'trades', 'vwap', 'change']);
    expect(header('trades')).toHaveClass('settling');
    expect(header('trades')).toHaveStyle({'--settle-x': '100px', '--settle-y': '0px'});
    expect(header('vwap')).toHaveClass('shoved-end');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    await userEvent.keyboard('{ArrowLeft}');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(document.activeElement).toBe(header('trades'));
  });

  test('a row walks to the bottom and back to the top, keypress after keypress, with no animation ending between, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    seat(EagerTable, 'keep animated');
    spanned();
    settledRows();

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']);
    await userEvent.keyboard('{ArrowDown}');
    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']);

    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'this minute', 'session']);
    [...rowOf('this minute').cells].forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '0px', '--settle-y': '40px'});
    });
    [...rowOf('session').cells].forEach(cell => expect(cell).toHaveClass('shoved-down'));
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
    expect(document.activeElement).toBe(grip('this minute'));
  });

  test('a keyboard nudge settles the walked row from across the row it passed', async () => {
    seat(EagerTable, 'keep animated');
    spanned();
    settledRows();

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    [...rowOf('this minute').cells].forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '0px', '--settle-y': '-40px'});
    });
  });

  test('the row a keyboard nudge passed is shoved up by its height', async () => {
    seat(EagerTable, 'keep animated');
    spanned();
    settledRows();

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    [...rowOf('last 5 minutes').cells].forEach(cell => {
      expect(cell).toHaveClass('shoved-up');
      expect(cell).toHaveStyle({'--shoved-by': '40px'});
    });
  });

  test('a strike shoves the neighbour by the carried width, toward the side it gave up', () => {
    seat(EagerTable, 'hide animated');

    liftColumn('trades');
    carryColumnOver('buys');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(header('trades')).not.toHaveClass('settling');
    columnCells('buys').forEach(cell => {
      expect(cell).toHaveClass('shoved-start');
      expect(cell).toHaveStyle({'--shoved-by': '100px'});
    });
  });

  test('a strike back shoves the neighbour the other way', () => {
    seat(EagerTable, 'hide animated');
    liftColumn('trades');
    carryColumnOver('buys');

    carryColumnOver('buys');

    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    columnCells('buys').forEach(cell => {
      expect(cell).toHaveClass('shoved-end');
      expect(cell).not.toHaveClass('shoved-start');
    });
  });

  test('on release the real column settles from where it was carried', () => {
    seat(EagerTable, 'hide animated');

    liftColumn('trades');
    carryColumnOver('buys');
    expect(header('trades')).toHaveClass('carried');
    expect(header('trades')).toHaveStyle({'--seat-x': '-100px', '--drift-x': '0px'});

    dropColumn();
    expect(carried()).toEqual([]);
    columnCells('trades').forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '-100px', '--settle-drift-x': '0px'});
    });
    columnCells('buys').forEach(cell => expect(cell).toHaveClass('shoved-start'));
  });

  test('the next lift clears every settling and shoved mark', () => {
    seat(EagerTable, 'keep animated');

    liftColumn('trades');
    carryColumnOver('buys');
    dropColumn();
    expect(header('trades')).toHaveClass('settling');
    expect(header('buys')).toHaveClass('shoved-start');

    liftColumn('sells');
    expect(header('trades')).not.toHaveClass('settling');
    expect(header('buys')).not.toHaveClass('shoved-start');
  });

  test('a lazy column settles on the slot it takes at the drop, shoving everything it passed', () => {
    seat(LazyTable, 'keep animated');

    liftColumn('trades');
    carryColumnOver('sells');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(header('buys').className).not.toMatch(/shoved/);

    dropColumn();
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
    expect(header('trades')).toHaveClass('settling');
    expect(header('trades')).toHaveStyle({'--settle-x': '-200px', '--settle-drift-x': '0px'});
    expect(header('buys')).toHaveClass('shoved-start');
    expect(header('sells')).toHaveClass('shoved-start');
    expect(header('volume').className).not.toMatch(/shoved/);
  });

  test('on release the real column settles from where the pointer let go', () => {
    seat(EagerTable, 'hide animated');

    liftColumn('trades');
    carryColumnOver('buys');
    carryColumnOn({x: 8});

    dropColumn();

    columnCells('trades').forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '-100px', '--settle-drift-x': '8px'});
    });
  });

  test('on release the real column settles from the height the pointer let go at', () => {
    seat(EagerTable, 'hide animated');

    liftColumn('trades');
    carryColumnOver('buys');
    carryColumnOn({y: 6});

    dropColumn();

    columnCells('trades').forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '-100px', '--settle-drift-x': '0px', '--settle-drift-y': '6px'});
    });
  });

  test('a lazy column settles from where the pointer let go', () => {
    seat(LazyTable, 'keep animated');

    liftColumn('trades');
    carryColumnOver('sells');
    carryColumnOn({x: 8});

    dropColumn();

    expect(header('trades')).toHaveClass('settling');
    expect(header('trades')).toHaveStyle({'--settle-x': '-200px', '--settle-drift-x': '8px'});
  });

  test('a static release leaves the same marks as an animated one', () => {
    seat(EagerTable, 'keep static');

    liftColumn('trades');
    carryColumnOver('buys');
    dropColumn();

    expect(carried()).toEqual([]);
    expect(header('trades')).toHaveClass('settling');
    expect(header('buys')).toHaveClass('shoved-start');
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  test('the table wears the word the sheet reads', () => {
    seat(EagerTable, 'keep static');

    expect(sourceTable()).toHaveClass('static');
    expect(sourceTable()).not.toHaveClass('animated');
  });

  test('a carried row shoves the row it passes up by its height', () => {
    seat(EagerTable, 'keep animated');
    spanned();

    liftRow('this minute');
    carryRowOver('last 5 minutes');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    [...rowOf('last 5 minutes').cells].forEach(cell => {
      expect(cell).toHaveClass('shoved-up');
      expect(cell).toHaveStyle({'--shoved-by': '40px'});
    });
    dropRow();
  });

  test('a dropped row settles every cell from the drop height', () => {
    seat(EagerTable, 'keep animated');
    spanned();
    liftRow('this minute');
    carryRowOver('last 5 minutes');

    dropRow();

    expect(carried()).toEqual([]);
    [...rowOf('this minute').cells].forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '0px', '--settle-y': '-40px', '--settle-drift-x': '0px', '--settle-drift-y': '0px'});
    });
  });

  test('a dropped row settles from where the pointer let go', () => {
    seat(EagerTable, 'keep animated');
    spanned();
    liftRow('this minute');
    carryRowOver('last 5 minutes');
    carryRowOn(8);

    dropRow();

    [...rowOf('this minute').cells].forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '0px', '--settle-y': '-40px', '--settle-drift-x': '0px', '--settle-drift-y': '8px'});
    });
  });

  test('a lazy row settles from where the pointer let go', () => {
    seat(LazyTable, 'keep animated');
    spanned();
    liftRow('this minute');
    carryRowOver('last 5 minutes');
    carryRowOn(8);

    dropRow();

    [...rowOf('this minute').cells].forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settle-x': '0px', '--settle-y': '-40px', '--settle-drift-x': '0px', '--settle-drift-y': '8px'});
    });
  });
});
