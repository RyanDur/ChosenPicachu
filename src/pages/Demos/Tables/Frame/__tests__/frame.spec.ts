import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {vanillaFrame} from '../__test_support';
import {blurFocusOnMoves} from '@__test_support/focus';

describe('the frame table', () => {
  it('should make every movable header a tab stop and leave the anchored edges out', () => {
    vanillaFrame.stand();

    ['trades', 'buys', 'sells', 'volume', 'vwap'].forEach(movable => expect(vanillaFrame.header(movable)).toHaveAttribute('tabindex', '0'));
    expect(vanillaFrame.header('window')).not.toHaveAttribute('tabindex');
    expect(vanillaFrame.header('change')).not.toHaveAttribute('tabindex');
  });

  it('should move a row one seat per press after its own grip has been reseated', async () => {
    vanillaFrame.stand();

    await vanillaFrame.moveRowByKey(5, '{ArrowUp}');
    await vanillaFrame.press('{ArrowUp}');

    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'session', 'last 15 minutes', 'this hour']);
    expect(vanillaFrame.moveReport()).toHaveTextContent('session moved to 3 of 5');
  });

  it('should sort buys from its menu after trades walks past it', async () => {
    vanillaFrame.stand();
    vanillaFrame.header('trades').focus();

    await vanillaFrame.press('{ArrowRight}');
    await vanillaFrame.choose('buys', 'descending');

    expect(vanillaFrame.header('buys')).toHaveAttribute('aria-sort', 'descending');
    expect(vanillaFrame.moveReport()).toHaveTextContent('buys sorted descending');
  });

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

  it('reset ends the sort and withdraws the announcement', async () => {
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
    await feedIsSubscribed(feed);

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() => expect(measure('session', 0)).toHaveTextContent('2'));
    expect(measure('this minute', 0)).toHaveTextContent('1');
  });

  const columnOrder = (): string[] =>
    screen.getAllByRole('columnheader').map(header => header.getAttribute('aria-label') ?? '');

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

  it('the fold finds its columns after they move', async () => {
    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed(feed);
    screen.getByRole('columnheader', {name: /trades/}).focus();
    await userEvent.keyboard('{ArrowRight}');

    broadcast(feed, [tradeFrame(100, 1700000000000, '0.01', 'sold')]);

    await waitFor(() => {
      const row = within(screen.getByRole('row', {name: /session/})).getAllByRole('cell');
      expect(row[0]).toHaveTextContent('0');
      expect(row[1]).toHaveTextContent('1');
      expect(row[2]).toHaveTextContent('1');
    });
  });

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

    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('this minute moved to 2 of 5');
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

  it('a hand that lifts a row and drops it where it was leaves the sort standing', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'ascending', hidden: true}));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');

    await vanillaFrame.liftAndLetGo(1);

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

  it('a keyboard nudge at the rail keeps the sort and adds no report', async () => {
    vanillaFrame.stand();

    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'ascending', hidden: true}));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');

    screen.getByRole('button', {name: 'move row 1'}).focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'ascending');
    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('trades sorted ascending');
  });

  it('the sort stands while trades land', async () => {
    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed(feed);
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() =>
      expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });

});
