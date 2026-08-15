import {fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {WebSocketServer} from 'ws';
import {broadcast, interceptedNetwork, listeningFeed, realSockets, subscribed, tradeFrame, urlOf} from '@test-support/feed';
import {wire as eagerKeepStatic} from '../shells/EagerKeepStatic';
import {wire as eagerKeepAnimated} from '../shells/EagerKeepAnimated';
import {wire as eagerHideStatic} from '../shells/EagerHideStatic';
import {wire as lazyKeepStatic} from '../shells/LazyKeepStatic';
import tableHtml from '../table.html?raw';

beforeAll(realSockets);
afterAll(interceptedNetwork);

describe('the frame table', () => {
  const feeds: WebSocketServer[] = [];

  const streamingFeed = async (): Promise<WebSocketServer> => {
    const feed = await listeningFeed();
    feeds.push(feed);
    return feed;
  };

  const deal = (feedUrl?: string, wire: (document: Document) => void = eagerKeepStatic): void => {
    window.__env = feedUrl
      ? {tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9', tradeProduct: 'BTC-USD',
         aicDomain: '', harvardDomain: '', harvardAPIKey: '', vamDomain: ''}
      : undefined;
    document.body.innerHTML = tableHtml;
    wire(document);
  };

  const windowNames = (): string[] =>
    screen.getAllByRole('rowheader').map(header => (header.textContent ?? '').trim());

  const sortMenu = (column: string) =>
    within(screen.getByRole('columnheader', {name: new RegExp(column)}));

  const measure = (window: string, at: number): HTMLElement =>
    within(screen.getByRole('row', {name: new RegExp(window)})).getAllByRole('cell')[at];

  afterEach(async () => {
    document.body.innerHTML = '';
    window.__env = undefined;
    subscribed.clear();
    await Promise.all(feeds.map(feed => new Promise(resolve => {
      feed.clients.forEach(client => client.terminate());
      feed.close(resolve);
    })));
    feeds.length = 0;
  });

  it('without an environment the dealt zeros stand, and the rule still announces', async () => {
    deal();

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
    expect(sortMenu('trades').getByRole('button', {name: 'sort trades'})).toHaveTextContent('▼');
  });

  it('as dealt restores the birth order and withdraws the announcement', async () => {
    deal();

    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'as dealt', hidden: true}));

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('columnheader', {name: /buys/})).not.toHaveAttribute('aria-sort');
    expect(sortMenu('buys').getByRole('button', {name: 'sort buys'})).toHaveTextContent('⇅');
  });

  it('a new rule releases the old column', async () => {
    deal();

    await userEvent.click(sortMenu('buys').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    expect(screen.getByRole('columnheader', {name: /buys/})).not.toHaveAttribute('aria-sort');
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });

  it('trades fold into the windows', async () => {
    const feed = await streamingFeed();
    deal(urlOf(feed));
    await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() => expect(measure('session', 0)).toHaveTextContent('2'));
    expect(measure('this minute', 0)).toHaveTextContent('1');
  });

  const columnOrder = (): string[] =>
    screen.getAllByRole('columnheader').map(header => header.className.split(' ')[1]);

  const stubbedRects = (): void => {
    const widths: Record<string, number> = {window: 160, trades: 100, buys: 100, sells: 100, volume: 100, vwap: 120, change: 120};
    screen.getByRole('table').getBoundingClientRect = () => ({
      left: 0, right: 800, top: 0, bottom: 200, width: 800, height: 200, x: 0, y: 0, toJSON: () => ({})
    });
    screen.getAllByRole('columnheader').forEach(header => {
      const name = header.className.split(' ')[1];
      header.getBoundingClientRect = () => ({
        left: 0, right: 0, top: 0, bottom: 0, width: widths[name] ?? 0, height: 0, x: 0, y: 0, toJSON: () => ({})
      });
    });
  };

  it('the keyboard walks a column', async () => {
    deal();

    screen.getByRole('columnheader', {name: /trades/}).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });

  it('the first seat is anchored', async () => {
    deal();

    screen.getByRole('columnheader', {name: /trades/}).focus();
    await userEvent.keyboard('{ArrowLeft}');

    expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });

  it('a column drags past its neighbour and the swap is eager', () => {
    deal();
    stubbedRects();

    const trades = screen.getByRole('columnheader', {name: /trades/});
    fireEvent.pointerDown(trades, {clientX: 200, clientY: 50, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 335, clientY: 100, pointerId: 1});

    expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    fireEvent.pointerUp(surface(), {pointerId: 1});
  });

  it('the fold finds its columns after they move', async () => {
    const feed = await streamingFeed();
    deal(urlOf(feed));
    await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
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

  const surface = (): HTMLElement => {
    const flying = document.querySelector('article.drag-surface');
    if (!(flying instanceof HTMLElement)) {
      throw new Error('no drag surface aloft');
    }
    return flying;
  };

  const rowRects = (): void => {
    stubbedRects();
    screen.getAllByRole('row').slice(1).forEach((lane, at) => {
      lane.getBoundingClientRect = () => ({
        left: 0, right: 800, top: at * 40, bottom: at * 40 + 40, width: 800, height: 40, x: 0, y: at * 40, toJSON: () => ({})
      });
    });
  };

  it('the keyboard walks a row, and its label follows', async () => {
    deal();

    await userEvent.click(screen.getByRole('button', {name: 'move row 1'}));
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    const row = screen.getByRole('row', {name: /this minute/});
    expect(within(row).getByRole('button', {name: 'move row 2'})).toBeInTheDocument();
  });

  it('the last seat clamps the walk', async () => {
    deal();

    await userEvent.click(screen.getByRole('button', {name: 'move row 5'}));
    await userEvent.keyboard('{ArrowDown}');

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
  });

  it('a row drags past its neighbour and the swap is eager', () => {
    deal();
    rowRects();

    const grip = within(screen.getByRole('row', {name: /this minute/})).getByRole('button', {name: 'move row 1'});
    fireEvent.pointerDown(grip, {clientX: 20, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(surface(), {buttons: 1, clientX: 20, clientY: 75, pointerId: 1});

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
    fireEvent.pointerUp(surface(), {pointerId: 1});
  });

  it('a standing rule outranks the dragged seats, and as dealt returns to them', async () => {
    deal();

    await userEvent.click(screen.getByRole('button', {name: 'move row 1'}));
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'as dealt', hidden: true}));

    expect(windowNames()).toEqual(['last 5 minutes', 'this minute', 'last 15 minutes', 'this hour', 'session']);
  });

  it('the keyboard trades shares between neighbours', async () => {
    deal();
    stubbedRects();

    const handle = screen.getByRole('button', {name: 'resize trades'});
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('columnheader', {name: /trades/}).style.getPropertyValue('--share')).toBe('14.5%');
    expect(screen.getByRole('columnheader', {name: /buys/}).style.getPropertyValue('--share')).toBe('10.5%');
    expect(screen.getByRole('button', {name: /resize trades, 15%/})).toBeInTheDocument();
  });

  it('the rule stands while trades land', async () => {
    const feed = await streamingFeed();
    deal(urlOf(feed));
    await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    broadcast(feed, [tradeFrame(100), tradeFrame(101, 1700000000000 - 120000)]);

    await waitFor(() =>
      expect(windowNames()).toEqual(['last 5 minutes', 'last 15 minutes', 'this hour', 'session', 'this minute']));
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });

  describe('the worlds of pace, origin, and motion', () => {
    it('lazy holds its shape and commits on drop', () => {
      deal(undefined, lazyKeepStatic);
      stubbedRects();

      const trades = screen.getByRole('columnheader', {name: /trades/});
      fireEvent.pointerDown(trades, {clientX: 200, clientY: 50, pointerId: 1});
      fireEvent.pointerMove(surface(), {buttons: 1, clientX: 335, clientY: 100, pointerId: 1});

      expect(columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);

      fireEvent.pointerUp(surface(), {pointerId: 1});
      expect(columnOrder()).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
    });

    it('hide blanks the lifted column and flies a ghost', () => {
      deal(undefined, eagerHideStatic);
      stubbedRects();

      const trades = screen.getByRole('columnheader', {name: /trades/});
      fireEvent.pointerDown(trades, {clientX: 200, clientY: 50, pointerId: 1});

      expect(trades.classList).toContain('hide');
      expect(document.querySelector('table.column-ghost')).toBeInTheDocument();

      fireEvent.pointerUp(surface(), {pointerId: 1});
      expect(trades.classList).not.toContain('hide');
      expect(document.querySelector('table.column-ghost')).not.toBeInTheDocument();
    });


    it('the row ghost carries its grip', () => {
      deal(undefined, eagerHideStatic);
      rowRects();

      const grip = within(screen.getByRole('row', {name: /this minute/})).getByRole('button', {name: 'move row 1'});
      fireEvent.pointerDown(grip, {clientX: 20, clientY: 20, pointerId: 1});

      expect(document.querySelector('table.column-ghost .grip')).toBeInTheDocument();

      fireEvent.pointerUp(surface(), {pointerId: 1});
      expect(document.querySelector('table.column-ghost')).not.toBeInTheDocument();
    });

    it('animated commits wear their marks and shed them when the slide ends', async () => {
      deal(undefined, eagerKeepAnimated);
      stubbedRects();

      const trades = screen.getByRole('columnheader', {name: /trades/});
      trades.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(trades.classList).toContain('displaced');
      expect(trades.style.getPropertyValue('--carried')).not.toBe('');

      fireEvent(trades, Object.assign(new Event('animationend', {bubbles: true}), {animationName: 'displaced'}));
      expect(trades.classList).not.toContain('displaced');
      expect(trades.style.getPropertyValue('--carried')).toBe('');
    });
  });
});
