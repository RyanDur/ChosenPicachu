import {FC, useReducer} from 'react';
import {act, fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Measured, Measures, measures, seated as projected} from '../../Aggregations/cells';
import {BodyEvents, HeaderEvents} from '@components/DragSortableTable/context';
import {TableColumn} from '@components/DragSortableTable/table-state';
import {arrangementOf, arrangementReducer, arrived, columnMoved, rowMoved, sorted, standingOf} from '@components/DragSortableTable/arrangement';
import {EagerKeepStaticTable} from '../EagerKeepStaticTable';
import {EagerKeepAnimatedTable} from '../EagerKeepAnimatedTable';
import {EagerHideStaticTable} from '../EagerHideStaticTable';
import {LazyKeepStaticTable} from '../LazyKeepStaticTable';
import {LazyKeepAnimatedTable} from '../LazyKeepAnimatedTable';
import {EagerHideAnimatedTable} from '../EagerHideAnimatedTable';

type Table = FC<HeaderEvents & BodyEvents & {columns: readonly TableColumn<Measured>[]; rows: readonly Measures[]}>;

const windows = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

const measured = (window: string, trades: number): Measures => ({
  window: {display: window},
  trades: {display: String(trades), value: trades},
  buys: {display: '0', value: 0},
  sells: {display: '0', value: 0},
  volume: {display: '0.00', value: 0},
  vwap: {display: '—'},
  change: {display: '—'}
});

const startingRows = [3, 9, 5, 7, 1].map((trades, at) => measured(windows[at], trades));

const windowOf = (row: Measures): string => row.window?.display ?? '';

const Page: FC<{Table: Table; rows: readonly Measures[]}> = ({Table, rows}) => {
  const [arrangement, dispatch] = useReducer(
    arrangementReducer,
    arrangementOf(measures.map(({name}) => name), rows.map(windowOf)));
  const shown = projected(rows);
  const valueOf = (row: string, column: string) => shown.find(({key}) => key === row)?.values[column];
  const arranged = arrangementReducer(arrangement, arrived(rows.map(windowOf)));
  const columns = arranged.columns.map(name => ({
    name,
    data: {label: name},
    sorted: arranged.sort?.column === name ? arranged.sort.direction : undefined
  }));
  const standing = standingOf(arranged, valueOf).flatMap(key => rows.filter(row => windowOf(row) === key));

  return <Table columns={columns} rows={standing}
                onColumnMoved={({column, to}) => dispatch(columnMoved(column, to))}
                onSorted={({column, direction}) => dispatch(sorted(column, direction))}
                onRowMoved={({row, to, standing: shownStanding}) => dispatch(rowMoved(row, to, shownStanding))}/>;
};

const seated = (Table: Table, rows: readonly Measures[]) => <Page Table={Table} rows={rows}/>;

const seat = (Table: Table, rows: readonly Measures[] = startingRows) => render(seated(Table, rows));

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
const rect = (box: Partial<DOMRect>): DOMRect => ({
  left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}), ...box
});
const announced = (): string[] => screen.getAllByRole('status').map(({textContent}) => textContent ?? '').filter(text => text !== '');
const menuFor = (label: string): HTMLElement => screen.getByLabelText(`${label} by`);

describe('columns by hand', () => {
  let widths: Record<string, number> = {};
  const even = (): Record<string, number> => Object.fromEntries(measures.map(({name}) => [name, 100]));

  beforeEach(() => {
    widths = even();
  });

  const surveyed = (): void => {
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
  let aloft = '';
  const surface = (): Element => header(aloft);
  const lift = (name: string): void => {
    aloft = name;
    surveyed();
    fireEvent.pointerDown(header(name), {clientX: 100, clientY: 20, pointerId: 1});
  };
  const carryOver = (target: string): void => {
    const order = columnOrder();
    let edge = 0;
    for (const name of order) {
      if (name === target) break;
      edge += widths[name];
    }
    const past = order.indexOf(target) < order.indexOf(aloft) ? 0.25 : 0.75;
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: edge + widths[target] * past, clientY: 20, pointerId: 1});
  };
  const drop = (): void => {
    fireEvent.pointerUp(surface(), {pointerId: 1});
  };

  test('an eager column follows the pointer as it crosses its neighbors', () => {
    seat(EagerKeepStaticTable);

    lift('trades');
    carryOver('buys');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(cellsOf('last 5 minutes')).toEqual(['last 5 minutes', '0', '9', '0', '0.00', '—', '—']);
  });

  test('a lazy column waits for the drop', () => {
    seat(LazyKeepStaticTable);

    lift('trades');
    carryOver('buys');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);

    drop();
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  test('a hiding column is carried, every cell of it, and lands as itself', () => {
    seat(EagerHideStaticTable);

    lift('buys');
    expect(header('buys').classList).toContain('carried');
    windows.forEach(window => expect(rowOf(window).cells[2].classList).toContain('carried'));

    carryOver('trades');
    drop();
    expect(carried()).toEqual([]);
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  test('the carried column wears its offset from home, and a settle mid-drag moves home under it', () => {
    seat(EagerHideStaticTable);

    lift('trades');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 150, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 170, clientY: 35, pointerId: 1});
    [header('trades'), ...lanes().map(lane => lane.cells[1])].forEach(cell => {
      expect(cell).toHaveClass('carried');
      expect(cell).toHaveStyle({'--carried-by': '20px 15px'});
    });

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 275, clientY: 35, pointerId: 1});
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    [header('trades'), ...lanes().map(lane => lane.cells[2])].forEach(cell => {
      expect(cell).toHaveStyle({'--carried-by': '25px 15px'});
    });
    drop();
    expect(carried()).toEqual([]);
  });

  test('losing pointer capture mid-drag is the move it carries, not the drop: the holder takes the pointer back and strikes', () => {
    seat(EagerKeepStaticTable);
    lift('trades');
    const captured: number[] = [];
    surface().setPointerCapture = id => captured.push(id);

    carryOver('buys');
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    fireEvent.lostPointerCapture(surface(), {buttons: 1, clientX: 350, clientY: 20, pointerId: 1});
    expect(surface()).toHaveClass('carried');
    expect(captured).toEqual([1, 1]);
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);

    carryOver('volume');
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'trades', 'vwap', 'change']);

    drop();
    expect(carried()).toEqual([]);
  });

  test('a column carried back without dropping comes home', () => {
    seat(EagerKeepStaticTable);

    lift('trades');
    carryOver('buys');
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);

    carryOver('buys');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    drop();
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  test('a lazy column carried home lands nowhere', () => {
    seat(LazyKeepStaticTable);

    lift('trades');
    carryOver('buys');
    carryOver('trades');
    drop();

    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  test('the switch waits for the inner half of the neighbor', () => {
    seat(EagerKeepStaticTable);

    lift('trades');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 220, clientY: 20, pointerId: 1});
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 260, clientY: 20, pointerId: 1});
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    drop();
  });

  test('a slim column reaches deeper into a wide neighbor before switching', () => {
    widths = {...even(), trades: 40, buys: 360};
    seat(EagerKeepStaticTable);

    lift('trades');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 260, clientY: 20, pointerId: 1});
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 320, clientY: 20, pointerId: 1});
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    drop();
  });

  test('the first and last columns hold their posts', () => {
    seat(EagerKeepStaticTable);

    expect(header('window').classList).not.toContain('grabbable');
    expect(header('change').classList).not.toContain('grabbable');
    expect(header('trades').classList).toContain('grabbable');

    lift('window');
    expect(carried()).toEqual([]);

    lift('buys');
    carryOver('window');
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    drop();
  });

  test('a keyboard walk says the move', async () => {
    seat(EagerKeepStaticTable);

    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('a dropped column says where it landed', () => {
    seat(EagerKeepStaticTable);

    lift('trades');
    carryOver('buys');
    drop();

    expect(announced()).toEqual(['trades moved to column 3 of 7']);
  });

  test('a menu appears only where the column asks for one', () => {
    seat(EagerKeepStaticTable);

    expect(screen.queryByRole('button', {name: 'sort window'})).toBeNull();
    expect(screen.getByRole('button', {name: 'sort trades'})).toBeVisible();
    expect(within(header('trades')).getByRole('button', {name: 'sort trades'})).toBeVisible();
    expect(within(header('trades')).getByRole('button', {name: /resize trades/})).toBeVisible();
    expect(within(header('window')).queryByRole('button', {name: 'sort window'})).toBeNull();
    expect(within(header('window')).getByRole('button', {name: /resize window/})).toBeVisible();
  });
});

describe('rows by hand', () => {
  const surveyed = (): void => {
    sourceTable().getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 0, bottom: 240, height: 240});
    within(sourceTable()).getAllByRole('columnheader').forEach(head => {
      head.getBoundingClientRect = () => rect({width: 100});
    });
    lanes().forEach((lane, at) => {
      lane.getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 40 + at * 40, y: 40 + at * 40, bottom: 80 + at * 40, height: 40});
    });
  };
  let aloft = '';
  const surface = (): Element => grip(aloft);
  const lift = (window: string): void => {
    aloft = window;
    surveyed();
    fireEvent.pointerDown(grip(window), {clientX: 100, clientY: 50, pointerId: 1});
  };
  const carryOver = (target: string): void => {
    const names = windowNames();
    const at = names.indexOf(target);
    const past = at < names.indexOf(aloft) ? 10 : 30;
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 100, clientY: 40 + at * 40 + past, pointerId: 1});
  };
  const drop = (): void => {
    fireEvent.pointerUp(surface(), {pointerId: 1});
  };

  test('an eager row follows the pointer as it crosses its neighbors', () => {
    seat(EagerKeepStaticTable);

    lift('this minute');
    carryOver('last 15 minutes');

    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
  });

  test('a lazy row waits for the drop', () => {
    seat(LazyKeepStaticTable);

    lift('this minute');
    carryOver('last 15 minutes');
    expect(windowNames()).toEqual(windows);

    drop();
    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
  });

  test('a hiding row is carried, every cell of it, and lands as itself', () => {
    seat(EagerHideStaticTable);

    lift('last 5 minutes');
    [...rowOf('last 5 minutes').cells].forEach(cell => expect(cell.classList).toContain('carried'));

    carryOver('this minute');
    drop();
    expect(carried()).toEqual([]);
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  test('a row carried back without dropping comes home', () => {
    seat(EagerKeepStaticTable);

    lift('this minute');
    carryOver('last 5 minutes');
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);

    carryOver('last 5 minutes');
    drop();
    expect(windowNames()).toEqual(windows);
  });

  test('the carried row wears its offset from home on every cell', () => {
    seat(EagerHideStaticTable);

    lift('last 5 minutes');
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 100, clientY: 90, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 100, clientY: 105, pointerId: 1});

    [...rowOf('last 5 minutes').cells].forEach(cell => {
      expect(cell).toHaveClass('carried');
      expect(cell).toHaveStyle({'--carried-by': '0px 15px'});
    });
    drop();
    expect(carried()).toEqual([]);
  });

  test('the keyboard walks a row up and down', async () => {
    seat(EagerKeepStaticTable);

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
  });

  test('rows that arrive after the deal still walk and speak', async () => {
    const {rerender} = render(seated(EagerKeepStaticTable, []));
    rerender(seated(EagerKeepStaticTable, startingRows));

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    expect(announced()).toEqual(['row moved to 2 of 5']);
  });

  test('rows that arrive after the deal still walk on the animated table', async () => {
    const {rerender} = render(seated(EagerKeepAnimatedTable, []));
    rerender(seated(EagerKeepAnimatedTable, startingRows));

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    expect(announced()).toEqual(['row moved to 2 of 5']);
  });

  test('rows that arrive after the deal still drag', () => {
    const {rerender} = render(seated(EagerKeepStaticTable, []));
    rerender(seated(EagerKeepStaticTable, startingRows));

    lift('this minute');
    carryOver('last 15 minutes');
    drop();

    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
  });

  test('a keyboard nudge says the move', async () => {
    seat(EagerKeepStaticTable);

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(announced()).toEqual(['row moved to 2 of 5']);
  });

  test('a dropped row says where it landed', () => {
    seat(EagerKeepStaticTable);

    lift('this minute');
    carryOver('last 15 minutes');
    drop();

    expect(announced()).toEqual(['row moved to 3 of 5']);
  });
});

describe('sort criteria menus', () => {
  const retraded = (thisMinute: number): Measures[] => [measured('this minute', thisMinute), ...startingRows.slice(1)];
  const tradesHeader = (): HTMLElement => header('trades');

  test('a direction chosen from the column menu sorts the rows', async () => {
    seat(EagerKeepStaticTable);

    await userEvent.click(within(menuFor('sort trades')).getByText('descending'));

    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);
    expect(tradesHeader()).toHaveAttribute('aria-sort', 'descending');
  });

  test('the sort keeps sorting as the values change', async () => {
    const {rerender} = seat(EagerKeepStaticTable);

    await userEvent.click(within(menuFor('sort trades')).getByText('ascending'));
    expect(windowNames()).toEqual(['session', 'this minute', 'last 15 minutes', 'this hour', 'last 5 minutes']);

    rerender(seated(EagerKeepStaticTable, retraded(10)));
    expect(windowNames()).toEqual(['session', 'last 15 minutes', 'this hour', 'last 5 minutes', 'this minute']);
  });

  test('reset restores the starting order', async () => {
    seat(EagerKeepStaticTable);

    await userEvent.click(within(menuFor('sort trades')).getByText('descending'));
    await userEvent.click(within(menuFor('sort trades')).getByText('reset'));

    expect(windowNames()).toEqual(windows);
    expect(tradesHeader()).not.toHaveAttribute('aria-sort');
  });

  test('a hand on a row ends the sort and keeps the standing order', async () => {
    const {rerender} = seat(EagerKeepStaticTable);

    await userEvent.click(within(menuFor('sort trades')).getByText('descending'));
    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'last 15 minutes', 'this minute', 'session']);

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
    expect(tradesHeader()).not.toHaveAttribute('aria-sort');

    rerender(seated(EagerKeepStaticTable, retraded(10)));
    expect(windowNames()).toEqual(['last 5 minutes', 'this hour', 'this minute', 'last 15 minutes', 'session']);
  });

  test('the menu toggle never lifts the column', () => {
    seat(EagerKeepStaticTable);

    fireEvent.pointerDown(screen.getByRole('button', {name: 'sort trades'}), {clientX: 100, clientY: 20, pointerId: 1});

    expect(carried()).toEqual([]);
  });

  test('choosing a direction never lifts the column', async () => {
    seat(EagerKeepStaticTable);

    await userEvent.click(within(menuFor('sort trades')).getByText('descending'));

    expect(carried()).toEqual([]);
    expect(screen.getAllByRole('table')).toHaveLength(1);
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

  test('the css owns the widths until a hand arrives', () => {
    seat(EagerKeepStaticTable);

    expect(sourceTable().classList).toContain('apportioned');
    expect(header('window').style.width).toBe('');
    expect(header('trades').style.width).toBe('');
    expect(screen.getByRole('button', {name: 'resize window'})).toBeVisible();
  });

  test('the first touch surveys the headers into the ledger', () => {
    seat(EagerKeepStaticTable);
    surveyed();

    fireEvent.focus(screen.getByRole('button', {name: 'resize window'}));

    expect(screen.getByRole('button', {name: 'resize window, 50%'})).toBeVisible();
    expect(header('window').style.getPropertyValue('--share')).toBe('50%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('40%');
  });

  test('the keyboard moves the boundary and the total holds', async () => {
    seat(EagerKeepStaticTable);
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize window'});
    act(() => handle.focus());
    await userEvent.keyboard('{ArrowRight}');
    expect(header('window').style.getPropertyValue('--share')).toBe('52%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('38%');
    expect(screen.getByRole('button', {name: 'resize window, 52%'})).toBeVisible();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(header('window').style.getPropertyValue('--share')).toBe('48%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('42%');
  });

  test('dragging the handle trades share between neighbors', () => {
    seat(EagerKeepStaticTable);
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize window'});
    fireEvent.pointerDown(handle, {clientX: 300, pointerId: 1});
    fireEvent.pointerMove(handle, {clientX: 340, pointerId: 1});
    fireEvent.pointerUp(handle, {pointerId: 1});

    expect(header('window').style.getPropertyValue('--share')).toBe('54%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('36%');
  });

  test('a resize says the new share', async () => {
    seat(EagerKeepStaticTable);
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize window'});
    act(() => handle.focus());
    await userEvent.keyboard('{ArrowRight}');

    expect(announced()).toEqual(['window resized to 52%']);
  });

  test('a boundary can never starve a column', async () => {
    seat(EagerKeepStaticTable);
    surveyed();

    const handle = screen.getByRole('button', {name: 'resize window'});
    act(() => handle.focus());
    await userEvent.keyboard('{ArrowRight}'.repeat(30));
    expect(header('window').style.getPropertyValue('--share')).toBe('85%');
    expect(header('trades').style.getPropertyValue('--share')).toBe('5%');
  });

  test('arrow keys on the resize handle trade shares, never seats', () => {
    seat(EagerKeepStaticTable);
    surveyed();

    const handle = screen.getByRole('button', {name: /resize trades/});
    fireEvent.focus(handle);
    fireEvent.keyDown(handle, {key: 'ArrowRight'});

    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  test('an apportioned table clips through the cascade, not through cell classes', () => {
    seat(EagerKeepStaticTable);

    expect(sourceTable().classList).toContain('apportioned');
    expect(header('window').classList).not.toContain('clipped');
    within(within(sourceTable()).getAllByRole('rowgroup')[1]).getAllByRole('cell')
      .forEach(cell => expect(cell.classList).not.toContain('ellipsis'));
  });
});

describe('animated moves', () => {
  // the browser blurs a focused node when it is moved in the DOM; jsdom does not, so the suite supplies the loss
  const blurringMoves = (): (() => void) => {
    const untouched = Object.getOwnPropertyDescriptor(Node.prototype, 'insertBefore');
    if (untouched === undefined) throw new Error('no insertBefore to blur');
    Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, child: Node | null): T {
      const focused = document.activeElement;
      if (node instanceof HTMLElement && focused instanceof HTMLElement && node.contains(focused)) {
        focused.blur();
      }
      return Reflect.apply(untouched.value as (this: Node, node: T, child: Node | null) => T, this, [node, child]);
    };
    return () => {
      Object.defineProperty(Node.prototype, 'insertBefore', untouched);
    };
  };
  const spanned = (): void => {
    sourceTable().getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 0, bottom: 240, height: 240});
    within(sourceTable()).getAllByRole('columnheader').forEach((head, at) => {
      head.getBoundingClientRect = () => rect({x: at * 100, left: at * 100, width: 100, right: at * 100 + 100});
    });
  };
  const surface = (): Element => {
    const table = within(sourceTable());
    const found = [...table.getAllByRole('columnheader'), ...table.getAllByRole('rowheader')].find(head => head.classList.contains('carried'));
    if (!found) throw new Error('nothing is aloft');
    return found;
  };
  const columnCells = (name: string): Element[] => [header(name), ...lanes().map(lane => lane.cells[columnOrder().indexOf(name)])];
  const settledRows = (): void => lanes().forEach((lane, at) => {
    lane.getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 40 + at * 40, y: 40 + at * 40, bottom: 80 + at * 40, height: 40});
  });

  test('a keyboard walk settles the walked column from across its neighbour, and shoves the neighbour by the walked width', async () => {
    seat(EagerKeepAnimatedTable);
    spanned();

    header('trades').focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(carried()).toEqual([]);
    columnCells('trades').forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settling-from': '-100px 0px'});
    });
    columnCells('buys').forEach(cell => {
      expect(cell).toHaveClass('shoved-start');
      expect(cell).toHaveStyle({'--shoved-by': '100px'});
    });

    fireEvent.animationEnd(header('trades'));
    fireEvent.animationEnd(header('buys'));
    columnCells('trades').forEach(cell => expect(cell).not.toHaveClass('settling'));
    columnCells('buys').forEach(cell => expect(cell).not.toHaveClass('shoved-start'));

    await userEvent.keyboard('{ArrowRight}');
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
    expect(header('trades')).toHaveClass('settling');
    expect(header('sells')).toHaveClass('shoved-start');
  });

  test('a column walks the whole way right and back left, keypress after keypress, with no animation ending between', async () => {
    const restore = blurringMoves();
    seat(EagerKeepAnimatedTable);
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
    expect(header('trades')).toHaveStyle({'--settling-from': '100px 0px'});
    expect(header('vwap')).toHaveClass('shoved-end');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowLeft}');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    await userEvent.keyboard('{ArrowLeft}');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(document.activeElement).toBe(header('trades'));
    restore();
  });

  test('a row walks to the bottom and back to the top, keypress after keypress, with no animation ending between', async () => {
    const restore = blurringMoves();
    seat(EagerKeepAnimatedTable);
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
      expect(cell).toHaveStyle({'--settling-from': '0px 40px'});
    });
    [...rowOf('session').cells].forEach(cell => expect(cell).toHaveClass('shoved-down'));
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
    await userEvent.keyboard('{ArrowUp}');
    expect(windowNames()).toEqual(windows);
    expect(document.activeElement).toBe(grip('this minute'));
    restore();
  });

  test('a keyboard nudge settles the walked row from across the row it passed, and shoves that row up', async () => {
    seat(EagerKeepAnimatedTable);
    spanned();
    settledRows();

    grip('this minute').focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    [...rowOf('this minute').cells].forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settling-from': '0px -40px'});
    });
    [...rowOf('last 5 minutes').cells].forEach(cell => {
      expect(cell).toHaveClass('shoved-up');
      expect(cell).toHaveStyle({'--shoved-by': '40px'});
    });
  });

  test('a strike shoves the neighbour by the carried width, toward the side it gave up', () => {
    seat(EagerHideAnimatedTable);
    spanned();

    fireEvent.pointerDown(header('trades'), {clientX: 150, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 275, clientY: 20, pointerId: 1});

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    expect(header('trades')).not.toHaveClass('settling');
    columnCells('buys').forEach(cell => {
      expect(cell).toHaveClass('shoved-start');
      expect(cell).toHaveStyle({'--shoved-by': '100px'});
    });

    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 125, clientY: 20, pointerId: 1});
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    columnCells('buys').forEach(cell => {
      expect(cell).toHaveClass('shoved-end');
      expect(cell).not.toHaveClass('shoved-start');
    });
  });

  test('on release the real column settles from where it was carried', () => {
    seat(EagerHideAnimatedTable);
    spanned();

    fireEvent.pointerDown(header('trades'), {clientX: 150, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 275, clientY: 20, pointerId: 1});
    expect(header('trades')).toHaveClass('carried');
    expect(header('trades')).toHaveStyle({'--carried-by': '-100px 0px'});

    fireEvent.pointerUp(surface(), {pointerId: 1});
    expect(carried()).toEqual([]);
    columnCells('trades').forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settling-from': '-100px 0px'});
    });
    columnCells('buys').forEach(cell => expect(cell).toHaveClass('shoved-start'));
  });

  test('the next lift clears every settling and shoved mark', () => {
    seat(EagerKeepAnimatedTable);
    spanned();

    fireEvent.pointerDown(header('trades'), {clientX: 150, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 275, clientY: 20, pointerId: 1});
    fireEvent.pointerUp(surface(), {pointerId: 1});
    expect(header('trades')).toHaveClass('settling');
    expect(header('buys')).toHaveClass('shoved-start');

    fireEvent.pointerDown(header('sells'), {clientX: 350, clientY: 20, pointerId: 1});
    expect(header('trades')).not.toHaveClass('settling');
    expect(header('buys')).not.toHaveClass('shoved-start');
  });

  test('a lazy column settles on the slot it takes at the drop, shoving everything it passed', () => {
    seat(LazyKeepAnimatedTable);
    spanned();

    fireEvent.pointerDown(header('trades'), {clientX: 150, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 375, clientY: 20, pointerId: 1});
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(header('buys').className).not.toMatch(/shoved/);

    fireEvent.pointerUp(surface(), {pointerId: 1});
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
    expect(header('trades')).toHaveClass('settling');
    expect(header('trades')).toHaveStyle({'--settling-from': '-200px 0px'});
    expect(header('buys')).toHaveClass('shoved-start');
    expect(header('sells')).toHaveClass('shoved-start');
    expect(header('volume').className).not.toMatch(/shoved/);
  });

  test('a static release settles nothing and shoves nothing', () => {
    seat(EagerKeepStaticTable);
    spanned();

    fireEvent.pointerDown(header('trades'), {clientX: 150, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 275, clientY: 20, pointerId: 1});
    fireEvent.pointerUp(surface(), {pointerId: 1});

    expect(carried()).toEqual([]);
    expect(header('trades')).not.toHaveClass('settling');
    expect(header('buys').className).not.toMatch(/shoved/);
    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  test('a dropped row settles every cell from the drop height, and the row it passed is shoved up by its height', () => {
    seat(EagerKeepAnimatedTable);
    spanned();
    settledRows();

    fireEvent.pointerDown(grip('this minute'), {clientX: 20, clientY: 60, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 20, clientY: 100, pointerId: 1});
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    [...rowOf('last 5 minutes').cells].forEach(cell => {
      expect(cell).toHaveClass('shoved-up');
      expect(cell).toHaveStyle({'--shoved-by': '40px'});
    });

    fireEvent.pointerUp(surface(), {pointerId: 1});
    expect(carried()).toEqual([]);
    [...rowOf('this minute').cells].forEach(cell => {
      expect(cell).toHaveClass('settling');
      expect(cell).toHaveStyle({'--settling-from': '0px -40px'});
    });
  });
});
