import {fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {vanillaFrame} from '../__test_support';
import {blurFocusOnMoves} from '@__test_support/focus';

describe('the frame table', () => {
  const windowNames = (): string[] =>
    screen.getAllByRole('rowheader').map(header => (header.textContent ?? '').trim());

  const sortMenu = (column: string) =>
    within(screen.getByRole('columnheader', {name: new RegExp(column)}));

  const measure = (window: string, at: number): HTMLElement =>
    within(screen.getByRole('row', {name: new RegExp(window)})).getAllByRole('cell')[at];

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('without a feed the starting zeros stand', () => {
    vanillaFrame.stand();

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(measure('this minute', 0)).toHaveTextContent('0');
  });

  it('a sort with no values still announces its direction', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(measure('this minute', 0)).toHaveTextContent('0');
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });

  it('reset restores the birth order and withdraws the announcement', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'reset', hidden: true}));

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('columnheader', {name: /buys/})).not.toHaveAttribute('aria-sort');
  });

  it('choosing a sort says it', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'ascending', hidden: true}));
    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('buys sorted ascending');

    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'reset', hidden: true}));
    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('buys sort reset');
  });

  it('a new sort releases the old column', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    expect(screen.getByRole('columnheader', {name: /buys/})).not.toHaveAttribute('aria-sort');
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });

  it('trades fold into the windows', async () => {
    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed();

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() => expect(measure('session', 0)).toHaveTextContent('2'));
    expect(measure('this minute', 0)).toHaveTextContent('1');
  });

  const columnOrder = (): string[] =>
    screen.getAllByRole('columnheader').map(header => header.getAttribute('aria-label') ?? '');

  const stubbedRects = (): void => {
    const widths: Record<string, number> = {window: 160, trades: 100, buys: 100, sells: 100, volume: 100, vwap: 120, change: 120};
    screen.getByRole('table').getBoundingClientRect = () => ({
      left: 0, right: 800, top: 0, bottom: 200, width: 800, height: 200, x: 0, y: 0, toJSON: () => ({})
    });
    screen.getAllByRole('columnheader').forEach(header => {
      const name = header.getAttribute('aria-label') ?? '';
      header.getBoundingClientRect = () => ({
        left: 0, right: 0, top: 0, bottom: 0, width: widths[name] ?? 0, height: 0, x: 0, y: 0, toJSON: () => ({})
      });
    });
  };

  it('the keyboard walks a column', async () => {
    vanillaFrame.stand();

    screen.getByRole('columnheader', {name: /trades/}).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  it('a column walks right to the end and left back home, keypress after keypress, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    vanillaFrame.stand({pace: 'eager'});

    const trades = screen.getByRole('columnheader', {name: /trades/});
    trades.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(document.activeElement).toBe(trades);
  });

  it('a row walks to the bottom and back to the top, keypress after keypress, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    vanillaFrame.stand({pace: 'eager'});

    const grip = within(screen.getByRole('row', {name: /this minute/})).getByRole('button', {name: /move row/});
    grip.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']);

    await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(document.activeElement).toBe(grip);
  });

  it('the first seat is anchored', async () => {
    vanillaFrame.stand();

    screen.getByRole('columnheader', {name: /trades/}).focus();
    await userEvent.keyboard('{ArrowLeft}');

    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  it('a column drags past its neighbour and the swap is eager', () => {
    vanillaFrame.stand();
    stubbedRects();

    const trades = screen.getByRole('columnheader', {name: /trades/});
    held(trades, {clientX: 200, clientY: 50, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 335, clientY: 100, pointerId: 1});

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    fireEvent.pointerUp(surface(), {pointerId: 1});
  });

  it('the fold finds its columns after they move', async () => {
    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed();
    screen.getByRole('columnheader', {name: /trades/}).focus();
    await userEvent.keyboard('{ArrowRight}');

    broadcast(feed, [tradeFrame(100, 1700000000000, '0.01', 'sell')]);

    await waitFor(() => {
      const row = within(screen.getByRole('row', {name: /session/})).getAllByRole('cell');
      expect(row[0]).toHaveTextContent('0');
      expect(row[1]).toHaveTextContent('1');
      expect(row[2]).toHaveTextContent('1');
    });
  });

  let holder: HTMLElement | undefined;
  afterEach(() => {
    holder = undefined;
  });
  const held = (element: HTMLElement, at: {clientX: number; clientY: number; pointerId: number}): void => {
    holder = element;
    fireEvent.pointerDown(element, at);
  };
  const surface = (): HTMLElement => {
    if (holder) return holder;
    throw new Error('nothing was lifted');
  };
  const carried = (): Element[] =>
    [...screen.getAllByRole('columnheader'), ...screen.getAllByRole('rowheader'), ...screen.getAllByRole('cell')]
      .filter(seat => seat.classList.contains('carried'));

  const rowRects = (): void => {
    stubbedRects();
    screen.getAllByRole('row').slice(1).forEach((lane, at) => {
      lane.getBoundingClientRect = () => ({
        left: 0, right: 800, top: at * 40, bottom: at * 40 + 40, width: 800, height: 40, x: 0, y: at * 40, toJSON: () => ({})
      });
    });
  };

  it('a reseat leaves settled rows untouched', async () => {
    vanillaFrame.stand();

    const still = screen.getByRole('row', {name: /this hour/});
    const [, hold] = screen.getAllByRole('rowgroup');
    let touched = false;
    const observer = new MutationObserver(records =>
      records.forEach(record => {
        if ([...record.addedNodes].includes(still)) {
          touched = true;
        }
      }));
    observer.observe(hold, {childList: true});

    await userEvent.click(screen.getByRole('button', {name: 'move row 1'}));
    await userEvent.keyboard('{ArrowDown}');

    observer.takeRecords();
    observer.disconnect();
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    expect(touched).toBe(false);
  });

  it('the keyboard walks a row, and its label follows', async () => {
    vanillaFrame.stand();

    await userEvent.click(screen.getByRole('button', {name: 'move row 1'}));
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    const row = screen.getByRole('row', {name: /this minute/});
    expect(within(row).getByRole('button', {name: 'move row 2'})).toBeInTheDocument();
  });

  it('a row nudge says the move', async () => {
    vanillaFrame.stand();

    await userEvent.click(screen.getByRole('button', {name: 'move row 1'}));
    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('row moved to 2 of 5');
  });

  it('a column walk says the move', async () => {
    vanillaFrame.stand();

    screen.getByRole('columnheader', {name: /trades/}).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('trades moved to column 3 of 7');
  });

  it('the last seat clamps the walk', async () => {
    vanillaFrame.stand();

    await userEvent.click(screen.getByRole('button', {name: 'move row 5'}));
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
  });

  it('a row drags past its neighbour and the swap is eager', () => {
    vanillaFrame.stand();
    rowRects();

    const grip = within(screen.getByRole('row', {name: /this minute/})).getByRole('button', {name: 'move row 1'});
    held(grip, {clientX: 20, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 20, clientY: 75, pointerId: 1});

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    fireEvent.pointerUp(surface(), {pointerId: 1});
  });

  it('a hand that lifts a row and drops it where it was leaves the sort standing', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'ascending', hidden: true}));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');

    held(screen.getByRole('button', {name: 'move row 1'}), {clientX: 20, clientY: 20, pointerId: 1});
    fireEvent.pointerUp(surface(), {pointerId: 1});

    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');
    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
  });

  it('a keyboard nudge ends the sort and keeps the rows where it left them', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'ascending', hidden: true}));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');

    screen.getByRole('button', {name: 'move row 1'}).focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('columnheader', {name: /trades/})).not.toHaveAttribute('aria-sort');
    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  it('a keyboard nudge at the rail keeps the sort and says nothing', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'ascending', hidden: true}));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');

    screen.getByRole('button', {name: 'move row 1'}).focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');
    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('trades sorted ascending');
  });

  it('a keyboard nudge at the rail of the lazy build keeps the sort and says nothing', async () => {
    vanillaFrame.stand({pace: 'lazy'});

    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'ascending', hidden: true}));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');

    screen.getByRole('button', {name: 'move row 1'}).focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');
    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('trades sorted ascending');
  });

  it('the keyboard trades shares between neighbours', async () => {
    vanillaFrame.stand();
    stubbedRects();

    const handle = screen.getByRole('button', {name: 'resize trades'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('columnheader', {name: /trades/}).style.getPropertyValue('--share')).toBe('14.5%');
    expect(screen.getByRole('columnheader', {name: /buys/}).style.getPropertyValue('--share')).toBe('10.5%');
    expect(screen.getByRole('button', {name: /resize trades, 15%/})).toBeInTheDocument();
  });

  it('a share trade says the new share', async () => {
    vanillaFrame.stand();
    stubbedRects();

    const handle = screen.getByRole('button', {name: 'resize trades'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('trades resized to 15%');
  });

  it('a hand drags the vanilla handle and the neighbours trade share', () => {
    vanillaFrame.stand();
    stubbedRects();
    const handle = screen.getByRole('button', {name: 'resize trades'});

    fireEvent.pointerDown(handle, {clientX: 100, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(handle, {buttons: 1, clientX: 140, clientY: 20, pointerId: 1});
    fireEvent.pointerUp(handle, {pointerId: 1});

    expect(screen.getByRole('columnheader', {name: /trades/}).style.getPropertyValue('--share')).toBe('17.5%');
    expect(screen.getByRole('columnheader', {name: /buys/}).style.getPropertyValue('--share')).toBe('7.5%');
    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('trades resized to 18%');
  });

  it('a resize whose pointer is cancelled stops following the pointer', () => {
    vanillaFrame.stand();
    stubbedRects();
    const handle = screen.getByRole('button', {name: 'resize trades'});
    fireEvent.pointerDown(handle, {clientX: 100, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(handle, {buttons: 1, clientX: 108, clientY: 20, pointerId: 1});
    const shareAfterMoving = screen.getByRole('columnheader', {name: /trades/}).style.getPropertyValue('--share');

    fireEvent.pointerCancel(handle, {pointerId: 1});
    fireEvent.pointerMove(handle, {buttons: 0, clientX: 200, clientY: 20, pointerId: 1});

    expect(screen.getByRole('columnheader', {name: /trades/}).style.getPropertyValue('--share')).toBe(shareAfterMoving);
    expect(shareAfterMoving).not.toBe('12.5%');
  });

  it('the sort stands while trades land', async () => {
    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed();
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() =>
      expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });

  describe('the worlds of pace, origin, and motion', () => {
    it('a lazy column holds its shape while it crosses', () => {
      vanillaFrame.stand({pace: 'lazy'});
      stubbedRects();

      const trades = screen.getByRole('columnheader', {name: /trades/});
      held(trades, {clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 335, clientY: 100, pointerId: 1});

      expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    });

    it('a lazy column commits on the drop', () => {
      vanillaFrame.stand({pace: 'lazy'});
      stubbedRects();
      const trades = screen.getByRole('columnheader', {name: /trades/});
      held(trades, {clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 335, clientY: 100, pointerId: 1});

      fireEvent.pointerUp(surface(), {pointerId: 1});

      expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    });

    it('a lazy drop at home changes nothing', () => {
      vanillaFrame.stand({pace: 'lazy'});
      stubbedRects();

      const trades = screen.getByRole('columnheader', {name: /trades/});
      held(trades, {clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 335, clientY: 100, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerUp(surface(), {pointerId: 1});

      expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    });

    it('a lazy row dropped at home changes nothing', () => {
      vanillaFrame.stand({pace: 'lazy'});
      rowRects();

      const grip = within(screen.getByRole('row', {name: /this minute/})).getByRole('button', {name: 'move row 1'});
      held(grip, {clientX: 20, clientY: 20, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 20, clientY: 75, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 20, clientY: 20, pointerId: 1});
      fireEvent.pointerUp(surface(), {pointerId: 1});

      expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    });

    const lazyRowLifted = (): void => {
      vanillaFrame.stand({pace: 'lazy'});
      rowRects();
      const grip = within(screen.getByRole('row', {name: /this minute/})).getByRole('button', {name: 'move row 1'});
      held(grip, {clientX: 20, clientY: 20, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 20, clientY: 30, pointerId: 1});
    };

    it('a lazy build dresses the lifted row as carried', () => {
      lazyRowLifted();

      expect(carried().length).toBeGreaterThan(0);
    });

    it('a lazy build moves nothing until the drop', () => {
      lazyRowLifted();

      expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);

      fireEvent.pointerUp(surface(), {pointerId: 1});
      expect(carried()).toEqual([]);
    });

    it('a lazy build dresses the carried column with its drift, and undresses it on the drop', () => {
      vanillaFrame.stand({pace: 'lazy'});
      stubbedRects();

      const trades = screen.getByRole('columnheader', {name: /trades/});
      held(trades, {clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 220, clientY: 50, pointerId: 1});

      expect(trades).toHaveClass('carried');
      expect(trades).toHaveStyle({'--drift-x': '20px', '--drift-y': '0px'});

      fireEvent.pointerUp(surface(), {pointerId: 1});
      expect(carried()).toEqual([]);
      expect(trades.style.getPropertyValue('--drift-x')).toBe('');
    });

    it('hide carries every cell of the lifted column by its offset from home', () => {
      vanillaFrame.stand({pace: 'eager'});
      stubbedRects();

      const trades = screen.getByRole('columnheader', {name: /trades/});
      held(trades, {clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 230, clientY: 60, pointerId: 1});

      const column = [trades, ...screen.getAllByRole('row').slice(1).map(lane => lane.children[1])];
      column.forEach(cell => {
        expect(cell).toHaveClass('carried');
        expect(cell).toHaveStyle({'--seat-x': '-160px', '--drift-x': '30px', '--drift-y': '10px'});
      });
    });

    it('a dropped column lands as itself', () => {
      vanillaFrame.stand({pace: 'eager'});
      stubbedRects();
      const trades = screen.getByRole('columnheader', {name: /trades/});
      held(trades, {clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 230, clientY: 60, pointerId: 1});

      fireEvent.pointerUp(surface(), {pointerId: 1});

      expect(carried()).toEqual([]);
      expect(trades.style.getPropertyValue('--seat-x')).toBe('');
    });

    it('a lifted row is carried, every cell of it', () => {
      vanillaFrame.stand({pace: 'eager'});
      rowRects();

      const grip = within(screen.getByRole('row', {name: /this minute/})).getByRole('button', {name: 'move row 1'});
      held(grip, {clientX: 20, clientY: 20, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 20, clientY: 20, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 25, clientY: 35, pointerId: 1});

      [...screen.getByRole('row', {name: /this minute/}).children].forEach(cell => {
        expect(cell).toHaveClass('carried');
        expect(cell).toHaveStyle({'--seat-y': '0px', '--drift-x': '5px', '--drift-y': '15px'});
      });

      fireEvent.pointerUp(surface(), {pointerId: 1});
      expect(carried()).toEqual([]);
    });

    it('a menu sort in an animated world cuts: nothing is carried, nothing to land', async () => {
      vanillaFrame.stand({pace: 'eager'});

      await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

      expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
      expect(carried()).toEqual([]);
    });

    const tradesCarriedPastBuys = (): {trades: HTMLElement; buys: HTMLElement} => {
      vanillaFrame.stand({pace: 'eager'});
      stubbedRects();
      const trades = screen.getByRole('columnheader', {name: /trades/});
      const buys = screen.getByRole('columnheader', {name: /buys/});
      held(trades, {clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 300, clientY: 50, pointerId: 1});
      return {trades, buys};
    };

    it('a strike shoves the neighbour', () => {
      const {buys} = tradesCarriedPastBuys();

      expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
      const shoved = [buys, ...screen.getAllByRole('row').slice(1).map(lane => lane.children[1])];
      shoved.forEach(cell => {
        expect(cell).toHaveClass('shoved-start');
        expect(cell).toHaveStyle({'--shoved-by': '100px'});
      });
    });

    it('on release the column settles from where it was dropped', () => {
      const {trades} = tradesCarriedPastBuys();

      fireEvent.pointerUp(surface(), {pointerId: 1});

      expect(carried()).toEqual([]);
      const settling = [trades, ...screen.getAllByRole('row').slice(1).map(lane => lane.children[2])];
      settling.forEach(cell => {
        expect(cell).toHaveClass('settling');
        expect(cell).toHaveStyle({'--settle-x': '-260px', '--settle-y': '0px'});
      });
    });

    it('the next lift clears the marks', () => {
      const {trades, buys} = tradesCarriedPastBuys();
      fireEvent.pointerUp(surface(), {pointerId: 1});

      held(buys, {clientX: 200, clientY: 50, pointerId: 1});

      expect(trades).not.toHaveClass('settling');
      expect(buys).not.toHaveClass('shoved-start');
    });

    it('every release marks what settles', () => {
      const {trades} = tradesCarriedPastBuys();

      fireEvent.pointerUp(surface(), {pointerId: 1});

      expect(carried()).toEqual([]);
      expect(trades).toHaveClass('settling');
      expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    });
  });
});
