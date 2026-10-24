import {waitFor} from '@testing-library/react';
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

    await vanillaFrame.moveColumnByKey('trades', '{ArrowRight}');
    await vanillaFrame.choose('buys', 'descending');

    expect(vanillaFrame.header('buys')).toHaveAttribute('aria-sort', 'descending');
    expect(vanillaFrame.moveReport()).toHaveTextContent('buys sorted descending');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('without a feed the starting zeros stand', () => {
    vanillaFrame.stand();

    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(vanillaFrame.figures('this minute')[0]).toHaveTextContent('0');
  });

  it('a sort with no values still announces its direction', async () => {
    vanillaFrame.stand();

    await vanillaFrame.choose('trades', 'descending');

    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(vanillaFrame.figures('this minute')[0]).toHaveTextContent('0');
    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'descending');
  });

  it('reset ends the sort and withdraws the announcement', async () => {
    vanillaFrame.stand();

    await vanillaFrame.choose('buys', 'ascending');
    await vanillaFrame.choose('buys', 'reset');

    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(vanillaFrame.header('buys')).not.toHaveAttribute('aria-sort');
  });

  it('choosing a sort says it', async () => {
    vanillaFrame.stand();

    await vanillaFrame.choose('buys', 'ascending');
    expect(vanillaFrame.moveReport()).toHaveTextContent('buys sorted ascending');

    await vanillaFrame.choose('buys', 'reset');
    expect(vanillaFrame.moveReport()).toHaveTextContent('buys sort reset');
  });

  it('a new sort releases the old column', async () => {
    vanillaFrame.stand();

    await vanillaFrame.choose('buys', 'ascending');
    await vanillaFrame.choose('trades', 'descending');

    expect(vanillaFrame.header('buys')).not.toHaveAttribute('aria-sort');
    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'descending');
  });

  it('trades fold into the windows', async () => {
    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed(feed);

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() => expect(vanillaFrame.figures('session')[0]).toHaveTextContent('2'));
    expect(vanillaFrame.figures('this minute')[0]).toHaveTextContent('1');
  });

  it('the keyboard walks a column', async () => {
    vanillaFrame.stand();

    await vanillaFrame.moveColumnByKey('trades', '{ArrowRight}');

    expect(vanillaFrame.columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  it('a column walks right to the end and left back home, keypress after keypress, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    vanillaFrame.stand({pace: 'eager'});

    const trades = vanillaFrame.header('trades');
    vanillaFrame.focusColumn('trades');
    await vanillaFrame.press('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(vanillaFrame.columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    await vanillaFrame.press('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(vanillaFrame.columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(trades).toHaveFocus();
  });

  it('a row walks to the bottom and back to the top, keypress after keypress, keeping the focus the moves take', async () => {
    blurFocusOnMoves();
    vanillaFrame.stand({pace: 'eager'});

    const grip = vanillaFrame.grip('this minute');
    vanillaFrame.focusRow('this minute');
    await vanillaFrame.press('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(vanillaFrame.windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']);

    await vanillaFrame.press('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(grip).toHaveFocus();
  });

  it('the first seat is anchored', async () => {
    vanillaFrame.stand();

    await vanillaFrame.moveColumnByKey('trades', '{ArrowLeft}');

    expect(vanillaFrame.columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  it('the fold finds its columns after they move', async () => {
    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed(feed);
    await vanillaFrame.moveColumnByKey('trades', '{ArrowRight}');

    broadcast(feed, [tradeFrame(100, 1700000000000, '0.01', 'sold')]);

    await waitFor(() => expect(vanillaFrame.figures('session').slice(0, 3).map(figure => figure.textContent)).toEqual(['0', '1', '1']));
  });

  it('the keyboard walks a row, and its label follows', async () => {
    vanillaFrame.stand();

    await vanillaFrame.moveRowByKey(1, '{ArrowDown}');

    expect(vanillaFrame.windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    expect(vanillaFrame.grip('this minute')).toHaveAccessibleName('move row 2');
  });

  it('a row nudge says the move', async () => {
    vanillaFrame.stand();

    await vanillaFrame.moveRowByKey(1, '{ArrowDown}');

    expect(vanillaFrame.moveReport()).toHaveTextContent('this minute moved to 2 of 5');
  });

  it('a column walk says the move', async () => {
    vanillaFrame.stand();

    await vanillaFrame.moveColumnByKey('trades', '{ArrowRight}');

    expect(vanillaFrame.moveReport()).toHaveTextContent('trades moved to column 3 of 7');
  });

  it('the last seat clamps the walk', async () => {
    vanillaFrame.stand();

    await vanillaFrame.moveRowByKey(5, '{ArrowDown}');

    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
  });

  it('a hand that lifts a row and drops it where it was leaves the sort standing', async () => {
    vanillaFrame.stand();

    await vanillaFrame.choose('trades', 'ascending');
    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'ascending');

    await vanillaFrame.liftAndLetGo(1);

    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'ascending');
    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
  });

  it('a keyboard nudge ends the sort and keeps the rows where it left them', async () => {
    vanillaFrame.stand();

    await vanillaFrame.choose('trades', 'ascending');
    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'ascending');

    await vanillaFrame.moveRowByKey(1, '{ArrowDown}');

    expect(vanillaFrame.header('trades')).not.toHaveAttribute('aria-sort');
    expect(vanillaFrame.windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  it('a keyboard nudge at the rail keeps the sort and adds no report', async () => {
    vanillaFrame.stand();

    await vanillaFrame.choose('trades', 'ascending');
    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'ascending');

    await vanillaFrame.moveRowByKey(1, '{ArrowUp}');

    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'ascending');
    expect(vanillaFrame.windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(vanillaFrame.moveReport()).toHaveTextContent('trades sorted ascending');
  });

  it('the sort stands while trades land', async () => {
    const feed = await listeningFeed();
    vanillaFrame.stand({feed});
    await feedIsSubscribed(feed);
    await vanillaFrame.choose('trades', 'descending');

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() =>
      expect(vanillaFrame.windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']));
    expect(vanillaFrame.header('trades')).toHaveAttribute('aria-sort', 'descending');
  });
});
