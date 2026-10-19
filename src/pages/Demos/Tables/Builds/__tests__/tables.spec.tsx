import {FC, useReducer} from 'react';
import {render, screen, within} from '@testing-library/react';
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
import {Motion, Origin} from '@components/DragSortableTable/DragSortableTable';

type Dials = {origin: Origin; motion: Motion};

type Table = FC<HeaderEvents & BodyEvents & Dials & {caption: string; columns: readonly TableColumn<Measured>[]; rows: readonly Measures[]}>;

const windows = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

const startingRows = [3, 9, 5, 7, 1].map((trades, at) => measuresFor(windows[at], trades));

const windowOf = (row: Measures): string => row.window.display;

const Page: FC<{Table: Table; rows: readonly Measures[]; dials: Dials}> = ({Table, rows, dials}) => {
  const [arrangement, dispatch] = useReducer(
    arrangementReducer,
    arrangementOf(measures.map(({name}) => name), rows.map(windowOf)));
  const arranged = arrangementReducer(arrangement, arrived(rows.map(windowOf)));

  return <Table caption="live aggregations" {...dials} columns={columnsOf(arranged)} rows={rowsOf(arranged, rows)}
    onColumnMoved={({column, to}) => dispatch(columnMoved(column, to))}
    onSorted={({column, direction}) => dispatch(sorted(column, direction))}
    onRowMoved={({row, to, standing: shownStanding}) => dispatch(rowMoved(row, to, shownStanding))}/>;
};

const seated = (Table: Table, rows: readonly Measures[], dials: Dials = {origin: 'hide', motion: 'animated'}) => <Page Table={Table} rows={rows} dials={dials}/>;

const seat = (Table: Table, dials: Dials = {origin: 'hide', motion: 'animated'}, rows: readonly Measures[] = startingRows) => render(seated(Table, rows, dials));

describe('a header the table does not know', () => {
  test('stands on its own and wears its own name', () => {
    render(<DragSortableTable caption="a table" origin="hide" motion="animated" columns={[{name: 'window', data: {label: 'window'}}]} rows={[]}>
      <thead><tr><Column column="ghost">a header</Column></tr></thead>
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
const grip = (window: string): HTMLElement => within(rowOf(window)).getByRole('button', {name: /move row/});
const announced = (): string[] => screen.getAllByRole('status', {name: 'move report'}).map(({textContent}) => textContent ?? '').filter(text => text !== '');
const menuFor = (label: string): HTMLElement => screen.getByLabelText(`${label} by`);

describe('columns by hand', () => {

  test('a keyboard walk says the move', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('a menu appears only where the column asks for one', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(screen.queryByRole('button', {name: 'sort window'})).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'sort trades'})).toBeVisible();
    expect(within(header('trades')).getByRole('button', {name: 'sort trades'})).toBeVisible();
    expect(within(header('window')).queryByRole('button', {name: 'sort window'})).not.toBeInTheDocument();
  });

  test('every column offers a resize handle', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(within(header('trades')).getByRole('button', {name: /resize trades/})).toBeVisible();
    expect(within(header('window')).getByRole('button', {name: /resize window/})).toBeVisible();
  });
});

describe('rows by hand', () => {

  test('every control says its tab stop outright, so a browser that tabs only to fields still reaches it', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(grip('this minute')).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', {name: 'sort trades'})).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('button', {name: 'resize trades'})).toHaveAttribute('tabindex', '0');
    expect(within(menuFor('sort trades')).getByRole('button', {name: 'ascending', hidden: true})).toHaveAttribute('tabindex', '0');
  });

  test('the keyboard walks a row down and back up', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
  });

  test('the top row cannot walk off the table', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(windowNames()).toEqual(windows);
  });

  test('rows that arrive after the deal still walk', async () => {
    const {rerender} = render(seated(EagerTable, [], {origin: 'keep', motion: 'static'}));
    rerender(seated(EagerTable, startingRows, {origin: 'keep', motion: 'static'}));

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  test('rows that arrive after the deal still say the move', async () => {
    const {rerender} = render(seated(EagerTable, [], {origin: 'keep', motion: 'static'}));
    rerender(seated(EagerTable, startingRows, {origin: 'keep', motion: 'static'}));

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('rows that arrive after the deal still walk and say the move on the animated table', async () => {
    const {rerender} = render(seated(EagerTable, [], {origin: 'keep', motion: 'animated'}));
    rerender(seated(EagerTable, startingRows, {origin: 'keep', motion: 'animated'}));

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    expect(announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('a keyboard nudge says the move', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(announced()).toEqual(['this minute moved to 2 of 5']);
  });
});

describe('sort criteria menus', () => {
  const retraded = (thisMinute: number): Measures[] => [measuresFor('this minute', thisMinute), ...startingRows.slice(1)];
  const tradesHeader = (): HTMLElement => header('trades');

  test('a direction chosen from the column menu sorts the rows', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));

    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(tradesHeader()).toHaveAttribute('aria-sort', 'descending');
  });

  test('the sort keeps sorting as the values change', async () => {
    const {rerender} = seat(EagerTable, {origin: 'keep', motion: 'static'});

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'ascending', hidden: true}));
    expect(windowNames()).toEqual(['session', 'this minute', 'last 15 minutes', 'this hour', 'last 5 minutes']);

    rerender(seated(EagerTable, retraded(10), {origin: 'keep', motion: 'static'}));
    expect(windowNames()).toEqual(['session', 'last 15 minutes', 'this hour', 'last 5 minutes', 'this minute']);
  });

  test('an arrow at the edge of a sorted table keeps the sort and adds no report', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));

    grip('last 5 minutes').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(tradesHeader()).toHaveAttribute('aria-sort', 'descending');
    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(announced()).toEqual(['trades sorted descending']);
  });

  test('choosing a sort says it', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    expect(announced()).toEqual(['trades sorted descending']);

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'reset', hidden: true}));
    expect(announced()).toEqual(['trades sort reset']);
  });

  test('a sort on a second column replaces what the page said about the first', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    await userEvent.click(within(menuFor('sort buys')).getByRole('button', {name: 'ascending', hidden: true}));

    expect(announced()).toEqual(['buys sorted ascending']);
  });

  test('a table speaks through one move report', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(screen.getAllByRole('status', {name: 'move report'})).toHaveLength(1);
  });

  test('an arrow at the edge of a sorted lazy table keeps the sort and adds no report', async () => {
    seat(LazyTable, {origin: 'keep', motion: 'static'});
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));

    grip('last 5 minutes').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(tradesHeader()).toHaveAttribute('aria-sort', 'descending');
    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(announced()).toEqual(['trades sorted descending']);
  });

  test('reset returns the rows to the order before the sort', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'reset', hidden: true}));

    expect(windowNames()).toEqual(windows);
    expect(tradesHeader()).not.toHaveAttribute('aria-sort');
  });

  test('reset returns a row moved before the sort to the seat it held before the sort', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});
    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');
    const beforeTheSort = windowNames();

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'reset', hidden: true}));

    expect(beforeTheSort).not.toEqual(windows);
    expect(windowNames()).toEqual(beforeTheSort);
  });

  test('a hand on a row ends the sort and keeps the standing order', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
    expect(tradesHeader()).not.toHaveAttribute('aria-sort');
  });

  test('the ended sort does not return when the values change', async () => {
    const {rerender} = seat(EagerTable, {origin: 'keep', motion: 'static'});
    await userEvent.click(within(menuFor('sort trades')).getByRole('button', {name: 'descending', hidden: true}));
    grip('this minute').focus();
    await userEvent.keyboard('{ArrowUp}');

    rerender(seated(EagerTable, retraded(10), {origin: 'keep', motion: 'static'}));

    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
  });
});

describe('animated moves', () => {
  test('a column walks the whole way right and back left, keypress after keypress, with no animation ending between, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    seat(EagerTable, {origin: 'keep', motion: 'animated'});

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
    seat(EagerTable, {origin: 'keep', motion: 'animated'});

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
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
    expect(document.activeElement).toBe(grip('this minute'));
  });
});
