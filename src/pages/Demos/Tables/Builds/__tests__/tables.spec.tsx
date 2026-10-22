import {FC, useReducer} from 'react';
import {render} from '@testing-library/react';
import {Measured, Measures, measures} from '../../Aggregations/cells';
import {measuresFor} from '../../Aggregations/__test_support';
import {BodyEvents, HeaderEvents} from '@components/DragSortableTable/context';
import {TableColumn} from '@components/DragSortableTable/table-state';
import {arrangementOf, arrangementReducer, arrived, columnMoved, rowMoved, sorted} from '@components/DragSortableTable/arrangement';
import {columnsOf, rowsOf} from '@pages/Demos/store';
import {EagerTable} from '../EagerTable';
import {LazyTable} from '../LazyTable';
import {blurFocusOnMoves} from '@__test_support/focus';
import {liveTable} from '../__test_support/table';
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

    expect(liveTable.header('ghost')).toBeVisible();
  });
});

describe('columns by hand', () => {

  test('a keyboard walk says the move', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    liveTable.focusColumn('trades');
    await liveTable.press('{ArrowRight}');

    expect(liveTable.columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(liveTable.announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('the lazy table says a column move', async () => {
    seat(LazyTable, {origin: 'keep', motion: 'static'});

    liveTable.focusColumn('trades');
    await liveTable.press('{ArrowRight}');

    expect(liveTable.announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('a menu appears only where the column asks for one', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(liveTable.sortToggle('window')).not.toBeInTheDocument();
    expect(liveTable.sortToggleIn('trades')).toBeVisible();
  });

  test('every column offers a resize handle', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(liveTable.resizeHandleIn('trades')).toBeVisible();
    expect(liveTable.resizeHandleIn('window')).toBeVisible();
  });
});

describe('rows by hand', () => {

  test('every control says its tab stop outright, so a browser that tabs only to fields still reaches it', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(liveTable.grip('this minute')).toHaveAttribute('tabindex', '0');
    expect(liveTable.sortToggleIn('trades')).toHaveAttribute('tabindex', '0');
    expect(liveTable.resizeHandleIn('trades')).toHaveAttribute('tabindex', '0');
    expect(liveTable.menuChoice('trades', 'ascending')).toHaveAttribute('tabindex', '0');
  });

  test('the keyboard walks a row down and back up', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');
    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    await liveTable.press('{ArrowUp}');
    expect(liveTable.windowNames()).toEqual(windows);
  });

  test('the top row cannot walk off the table', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowUp}');

    expect(liveTable.windowNames()).toEqual(windows);
  });

  test('rows that arrive after the deal still walk', async () => {
    const {rerender} = render(seated(EagerTable, [], {origin: 'keep', motion: 'static'}));
    rerender(seated(EagerTable, startingRows, {origin: 'keep', motion: 'static'}));

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');

    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  test('rows that arrive after the deal still say the move', async () => {
    const {rerender} = render(seated(EagerTable, [], {origin: 'keep', motion: 'static'}));
    rerender(seated(EagerTable, startingRows, {origin: 'keep', motion: 'static'}));

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');

    expect(liveTable.announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('rows that arrive after the deal still walk and say the move on the animated table', async () => {
    const {rerender} = render(seated(EagerTable, [], {origin: 'keep', motion: 'animated'}));
    rerender(seated(EagerTable, startingRows, {origin: 'keep', motion: 'animated'}));

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');

    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    expect(liveTable.announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('the lazy table says a row move', async () => {
    seat(LazyTable, {origin: 'keep', motion: 'static'});

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');

    expect(liveTable.announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('a keyboard nudge says the move', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');

    expect(liveTable.announced()).toEqual(['this minute moved to 2 of 5']);
  });
});

describe('sort criteria menus', () => {
  const retraded = (thisMinute: number): Measures[] => [measuresFor('this minute', thisMinute), ...startingRows.slice(1)];

  test('a direction chosen from the column menu sorts the rows', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'descending');

    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(liveTable.header('trades')).toHaveAttribute('aria-sort', 'descending');
  });

  test('the sort keeps sorting as the values change', async () => {
    const {rerender} = seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'ascending');
    expect(liveTable.windowNames()).toEqual(['session', 'this minute', 'last 15 minutes', 'this hour', 'last 5 minutes']);

    rerender(seated(EagerTable, retraded(10), {origin: 'keep', motion: 'static'}));
    expect(liveTable.windowNames()).toEqual(['session', 'last 15 minutes', 'this hour', 'last 5 minutes', 'this minute']);
  });

  test('an arrow at the edge of a sorted table keeps the sort and adds no report', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});
    await liveTable.choose('trades', 'descending');

    liveTable.focusRow('last 5 minutes');
    await liveTable.press('{ArrowUp}');

    expect(liveTable.header('trades')).toHaveAttribute('aria-sort', 'descending');
    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(liveTable.announced()).toEqual(['trades sorted descending']);
  });

  test('choosing a sort says it', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'descending');
    expect(liveTable.announced()).toEqual(['trades sorted descending']);

    await liveTable.choose('trades', 'reset');
    expect(liveTable.announced()).toEqual(['trades sort reset']);
  });

  test('a sort on a second column replaces what the page said about the first', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'descending');
    await liveTable.choose('buys', 'ascending');

    expect(liveTable.announced()).toEqual(['buys sorted ascending']);
  });

  test('a table speaks through one move report', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(liveTable.moveReports()).toHaveLength(1);
  });

  test('an arrow at the edge of a sorted lazy table keeps the sort and adds no report', async () => {
    seat(LazyTable, {origin: 'keep', motion: 'static'});
    await liveTable.choose('trades', 'descending');

    liveTable.focusRow('last 5 minutes');
    await liveTable.press('{ArrowUp}');

    expect(liveTable.header('trades')).toHaveAttribute('aria-sort', 'descending');
    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(liveTable.announced()).toEqual(['trades sorted descending']);
  });

  test('reset returns the rows to the order before the sort', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'descending');
    await liveTable.choose('trades', 'reset');

    expect(liveTable.windowNames()).toEqual(windows);
    expect(liveTable.header('trades')).not.toHaveAttribute('aria-sort');
  });

  test('reset returns a row moved before the sort to the seat it held before the sort', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});
    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');
    const beforeTheSort = liveTable.windowNames();

    await liveTable.choose('trades', 'descending');
    await liveTable.choose('trades', 'reset');

    expect(beforeTheSort).not.toEqual(windows);
    expect(liveTable.windowNames()).toEqual(beforeTheSort);
  });

  test('a hand on a row ends the sort and keeps the standing order', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'descending');
    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowUp}');

    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
    expect(liveTable.header('trades')).not.toHaveAttribute('aria-sort');
  });

  test('the ended sort does not return when the values change', async () => {
    const {rerender} = seat(EagerTable, {origin: 'keep', motion: 'static'});
    await liveTable.choose('trades', 'descending');
    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowUp}');

    rerender(seated(EagerTable, retraded(10), {origin: 'keep', motion: 'static'}));

    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
  });
});

describe('animated moves', () => {
  test('a column walks the whole way right and back left, keypress after keypress, with no animation ending between, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    seat(EagerTable, {origin: 'keep', motion: 'animated'});

    liveTable.focusColumn('trades');
    await liveTable.press('{ArrowRight}');
    await liveTable.press('{ArrowRight}');
    await liveTable.press('{ArrowRight}');
    await liveTable.press('{ArrowRight}');
    expect(liveTable.columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);
    await liveTable.press('{ArrowRight}');
    expect(liveTable.columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    await liveTable.press('{ArrowLeft}');
    expect(liveTable.columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'trades', 'vwap', 'change']);
    await liveTable.press('{ArrowLeft}');
    await liveTable.press('{ArrowLeft}');
    await liveTable.press('{ArrowLeft}');
    expect(liveTable.columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    await liveTable.press('{ArrowLeft}');
    expect(liveTable.columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(liveTable.header('trades')).toHaveFocus();
  });

  test('a row walks to the bottom and back to the top, keypress after keypress, with no animation ending between, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    seat(EagerTable, {origin: 'keep', motion: 'animated'});

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');
    await liveTable.press('{ArrowDown}');
    await liveTable.press('{ArrowDown}');
    await liveTable.press('{ArrowDown}');
    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']);
    await liveTable.press('{ArrowDown}');
    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']);

    await liveTable.press('{ArrowUp}');
    expect(liveTable.windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'this minute', 'session']);
    await liveTable.press('{ArrowUp}');
    await liveTable.press('{ArrowUp}');
    await liveTable.press('{ArrowUp}');
    expect(liveTable.windowNames()).toEqual(windows);
    await liveTable.press('{ArrowUp}');
    expect(liveTable.windowNames()).toEqual(windows);
    expect(liveTable.grip('this minute')).toHaveFocus();
  });
});
