import {FC, useReducer} from 'react';
import {render} from '@testing-library/react';
import {Lookback, Measured, Measures, cells} from '@pages/Demos/Market';
import {measuresFor} from '../../Aggregations/__test_support';
import {BodyEvents, Column, DragSortable, HeaderEvents, Motion, Origin, useDragSortable} from '@components/DragSortableTable';
import {TableColumn, arrangements} from '@components/DragSortableTable/model';
import {arrangedView} from '@pages/Demos/Market';
import {EagerTable} from '../EagerTable';
import {LazyTable} from '../LazyTable';
import {blurFocusOnMoves} from '@__test_support/focus';
import {liveTable} from '../__test_support/table';

type Dials = {origin: Origin; motion: Motion};

type Table = FC<HeaderEvents & BodyEvents & Dials & {
  caption: string;
  columns: readonly TableColumn<Measured>[];
  rows: readonly Measures[];
}>;

const lookbacks = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

const keys: readonly Lookback[] = ['minute', 'five-minutes', 'fifteen-minutes', 'hour', 'session'];

const startingRows = [3, 9, 5, 7, 1].map((trades, at) => measuresFor(keys[at], lookbacks[at], trades));

const lookbackOf = (row: Measures): string => row.lookback.key;

const Page: FC<{Table: Table; rows: readonly Measures[]; dials: Dials}> = ({Table, rows, dials}) => {
  const [arrangement, dispatch] = useReducer(
    arrangements.reducer,
    arrangements.of(cells.measures.map(({name}) => name), rows.map(lookbackOf)));
  const arranged = arrangements.reducer(arrangement, arrangements.arrived(rows.map(lookbackOf)));

  return <Table caption="live aggregations" {...dials} columns={arrangedView.columnsOf(arranged)} rows={arrangedView.rowsOf(arranged, rows)}
    onColumnMoved={({column, to}) => dispatch(arrangements.columnMoved(column, to))}
    onSorted={({column, direction}) => dispatch(arrangements.sorted(column, direction))}
    onRowMoved={({row, to, standing: shownStanding}) => dispatch(arrangements.rowMoved(row, to, shownStanding))}/>;
};

const Seated: FC<{table: Table; rows: readonly Measures[]; dials: Dials}> = ({table, rows, dials}) =>
  <Page Table={table} rows={rows} dials={dials}/>;

const seat = (Table: Table, dials: Dials = {origin: 'hide', motion: 'animated'}, rows: readonly Measures[] = startingRows) => render(<Seated table={Table} rows={rows} dials={dials}/>);

describe('a header the table does not know', () => {
  test('stands on its own and wears its own name', () => {
    const Page: FC = () =>
      <DragSortable value={useDragSortable([{name: 'lookback', data: {label: 'lookback'}}], [], {origin: 'hide', motion: 'animated'})}>
        <table>
          <thead><tr><Column column="ghost">a header</Column></tr></thead>
        </table>
      </DragSortable>;
    render(<Page/>);

    expect(liveTable.header('ghost')).toBeVisible();
  });
});

describe('columns by hand', () => {

  test('a keyboard walk says the move', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    liveTable.focusColumn('trades');
    await liveTable.press('{ArrowRight}');

    expect(liveTable.columnOrder()).toEqual(['lookback', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(liveTable.announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('a key that is no arrow leaves the columns where they stand', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    liveTable.focusColumn('trades');
    await liveTable.press('{Enter}');

    expect(liveTable.columnOrder()).toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  test('the lazy table says a column move', async () => {
    seat(LazyTable, {origin: 'keep', motion: 'static'});

    liveTable.focusColumn('trades');
    await liveTable.press('{ArrowRight}');

    expect(liveTable.announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test.each([['eager', EagerTable], ['lazy', LazyTable]])('every header of the %s table reads its column’s name and nothing more', (_, Table) => {
    seat(Table, {origin: 'keep', motion: 'static'});

    expect(liveTable.columnsNotReadingTheirName()).toEqual([]);
  });

  test('a menu appears only where the column asks for one', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(liveTable.sortToggle('lookback')).not.toBeInTheDocument();
    expect(liveTable.sortToggleIn('trades')).toBeVisible();
  });

  test('every column offers a resize handle', () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    expect(liveTable.columnsWithoutAResizeHandle()).toEqual([]);
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
    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    await liveTable.press('{ArrowUp}');
    expect(liveTable.lookbackNames()).toEqual(lookbacks);
  });

  test('the top row cannot walk off the table', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowUp}');

    expect(liveTable.lookbackNames()).toEqual(lookbacks);
  });

  test('rows that arrive after the deal still walk', async () => {
    const {rerender} = render(<Seated table={EagerTable} rows={[]} dials={{origin: 'keep', motion: 'static'}}/>);
    rerender(<Seated table={EagerTable} rows={startingRows} dials={{origin: 'keep', motion: 'static'}}/>);

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');

    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  test('rows that arrive after the deal still say the move', async () => {
    const {rerender} = render(<Seated table={EagerTable} rows={[]} dials={{origin: 'keep', motion: 'static'}}/>);
    rerender(<Seated table={EagerTable} rows={startingRows} dials={{origin: 'keep', motion: 'static'}}/>);

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');

    expect(liveTable.announced()).toEqual(['this minute moved to 2 of 5']);
  });

  test('rows that arrive after the deal still walk and say the move on the animated table', async () => {
    const {rerender} = render(<Seated table={EagerTable} rows={[]} dials={{origin: 'keep', motion: 'animated'}}/>);
    rerender(<Seated table={EagerTable} rows={startingRows} dials={{origin: 'keep', motion: 'animated'}}/>);

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');

    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
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
  const retraded = (thisMinute: number): Measures[] => [measuresFor('minute', 'this minute', thisMinute), ...startingRows.slice(1)];

  test('a direction chosen from the column menu sorts the rows', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'descending');

    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(liveTable.header('trades')).toHaveAttribute('aria-sort', 'descending');
  });

  test('the sort keeps sorting as the values change', async () => {
    const {rerender} = seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'ascending');
    expect(liveTable.lookbackNames()).toEqual(['session', 'this minute', 'last 15 minutes', 'this hour', 'last 5 minutes']);

    rerender(<Seated table={EagerTable} rows={retraded(10)} dials={{origin: 'keep', motion: 'static'}}/>);
    expect(liveTable.lookbackNames()).toEqual(['session', 'last 15 minutes', 'this hour', 'last 5 minutes', 'this minute']);
  });

  test('an arrow at the edge of a sorted table keeps the sort and adds no report', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});
    await liveTable.choose('trades', 'descending');

    liveTable.focusRow('last 5 minutes');
    await liveTable.press('{ArrowUp}');

    expect(liveTable.header('trades')).toHaveAttribute('aria-sort', 'descending');
    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
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
    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(liveTable.announced()).toEqual(['trades sorted descending']);
  });

  test('reset returns the rows to the order before the sort', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'descending');
    await liveTable.choose('trades', 'reset');

    expect(liveTable.lookbackNames()).toEqual(lookbacks);
    expect(liveTable.header('trades')).not.toHaveAttribute('aria-sort');
  });

  test('reset returns a row moved before the sort to the seat it held before the sort', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});
    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowDown}');
    const beforeTheSort = liveTable.lookbackNames();

    await liveTable.choose('trades', 'descending');
    await liveTable.choose('trades', 'reset');

    expect(beforeTheSort).not.toEqual(lookbacks);
    expect(liveTable.lookbackNames()).toEqual(beforeTheSort);
  });

  test('a hand on a row ends the sort and keeps the standing order', async () => {
    seat(EagerTable, {origin: 'keep', motion: 'static'});

    await liveTable.choose('trades', 'descending');
    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);

    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowUp}');

    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
    expect(liveTable.header('trades')).not.toHaveAttribute('aria-sort');
  });

  test('the ended sort does not return when the values change', async () => {
    const {rerender} = seat(EagerTable, {origin: 'keep', motion: 'static'});
    await liveTable.choose('trades', 'descending');
    liveTable.focusRow('this minute');
    await liveTable.press('{ArrowUp}');

    rerender(<Seated table={EagerTable} rows={retraded(10)} dials={{origin: 'keep', motion: 'static'}}/>);

    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
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
    expect(liveTable.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);
    await liveTable.press('{ArrowRight}');
    expect(liveTable.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    await liveTable.press('{ArrowLeft}');
    expect(liveTable.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'volume', 'trades', 'vwap', 'change']);
    await liveTable.press('{ArrowLeft}');
    await liveTable.press('{ArrowLeft}');
    await liveTable.press('{ArrowLeft}');
    expect(liveTable.columnOrder()).toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    await liveTable.press('{ArrowLeft}');
    expect(liveTable.columnOrder()).toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
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
    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']);
    await liveTable.press('{ArrowDown}');
    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']);

    await liveTable.press('{ArrowUp}');
    expect(liveTable.lookbackNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'this minute', 'session']);
    await liveTable.press('{ArrowUp}');
    await liveTable.press('{ArrowUp}');
    await liveTable.press('{ArrowUp}');
    expect(liveTable.lookbackNames()).toEqual(lookbacks);
    await liveTable.press('{ArrowUp}');
    expect(liveTable.lookbackNames()).toEqual(lookbacks);
    expect(liveTable.grip('this minute')).toHaveFocus();
  });
});
