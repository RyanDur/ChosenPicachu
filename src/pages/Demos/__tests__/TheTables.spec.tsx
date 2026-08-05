import {cleanup, fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  broadcast,
  interceptedNetwork,
  listeningFeed,
  realSockets,
  subscribed,
  tradeFrame,
  urlOf
} from '@test-support/feed';
import {WebSocketServer} from 'ws';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';

beforeAll(realSockets);
afterAll(interceptedNetwork);

const renderTables = (feedUrl: string) =>
  renderWithMemoryRouter({
    path: Paths.demos,
    element: <EnvProvider env={{tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9'}}><DemosPage/></EnvProvider>
  }, {path: `${Paths.demos}?tab=tables`});

const feedIsSubscribed = async (): Promise<void> => {
  await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
};

describe('the tables demo', () => {
  const feeds: WebSocketServer[] = [];

  const streamingFeed = async (): Promise<WebSocketServer> => {
    const feed = await listeningFeed();
    feeds.push(feed);
    return feed;
  };

  afterEach(async () => {
    cleanup();
    subscribed.clear();
    await Promise.all(feeds.map(feed => new Promise(resolve => feed.close(resolve))));
    feeds.length = 0;
  });

  test('the fixed windows hold their rows while the stream fills the cells', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const card = screen.getByRole('region', {name: 'live aggregations'});
    for (const measure of ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']) {
      expect(within(card).getByRole('columnheader', {name: new RegExp(`^${measure}`)})).toBeVisible();
    }
    expect(within(card).getAllByRole('row')).toHaveLength(6);
    const now = 1700000000000;
    broadcast(feed, [
      tradeFrame(50001, now - 30 * 60000, '0.10', 'buy'),
      tradeFrame(50002, now - 10 * 60000, '0.25', 'sell'),
      tradeFrame(50003, now - 3 * 60000, '0.05', 'buy'),
      tradeFrame(50004, now, '0.01', 'buy')
    ]);
    const texts = (row: HTMLElement) => within(row).getAllByRole('cell').map(cell => cell.textContent);
    const rowFor = (label: string) => {
      const cell = within(card).getByText(label);
      const row = cell.closest('tr');
      if (row === null) throw new Error(`no row for ${label}`);
      return row;
    };
    await waitFor(() => expect(texts(rowFor('this minute'))).toEqual(
      ['this minute', '1', '1', '0', '0.01', '$50,004.00', '+$0.00']));
    expect(texts(rowFor('last 5 minutes'))).toEqual(
      ['last 5 minutes', '2', '2', '0', '0.06', '$50,003.17', '+$1.00']);
    expect(texts(rowFor('last 15 minutes'))).toEqual(
      ['last 15 minutes', '3', '2', '1', '0.31', '$50,002.23', '+$2.00']);
    expect(texts(rowFor('this hour'))).toEqual(
      ['this hour', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
    expect(texts(rowFor('session'))).toEqual(
      ['session', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
  });

  test('the glider chooses how a dragged column travels', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const card = screen.getByRole('region', {name: 'live aggregations'});
    for (const axis of ['pace', 'origin', 'motion']) {
      expect(screen.getByRole('group', {name: axis})).toBeVisible();
    }
    for (const choice of ['Eager', 'Lazy', 'Keep', 'Hide']) {
      expect(screen.getByRole('radio', {name: choice})).toBeVisible();
    }
    expect(screen.getByRole('radio', {name: 'Eager'})).toBeChecked();
    expect(screen.getByRole('radio', {name: 'Hide'})).toBeChecked();
    expect(screen.getByRole('radio', {name: 'Animate'})).toBeChecked();

    const header = (name: string) =>
      within(card).getByRole('columnheader', {name: new RegExp(`^${name}`)});
    const table = within(card).getAllByRole('table')[0];
    table.getBoundingClientRect = () => ({
      left: 0, right: 860, top: 0, bottom: 240, width: 860, height: 240, x: 0, y: 0, toJSON: () => ({})
    });
    fireEvent.pointerDown(header('vwap'), {clientX: 700, clientY: 20, pointerId: 1});
    const surface = document.querySelector('.drag-surface');
    if (surface === null) throw new Error('nothing is aloft');
    fireEvent.pointerMove(surface, {buttons: 1, clientX: 40, clientY: 120, pointerId: 1});
    fireEvent.pointerUp(surface, {pointerId: 1});

    const headerTexts = within(card).getAllByRole('columnheader').map(head => head.textContent);
    ['window', 'vwap', 'trades', 'buys', 'sells', 'volume', 'change'].forEach((name, at) =>
      expect(headerTexts[at]).toMatch(new RegExp(`^${name}`)));
  });

  test('the windows can trade places by hand', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const card = screen.getByRole('region', {name: 'live aggregations'});
    const rowOf = (label: string) => {
      const row = within(card).getByText(label).closest('tr');
      if (row === null) throw new Error(`no row for ${label}`);
      return row;
    };
    const stage = within(card).getAllByRole('table')[0];
    stage.getBoundingClientRect = () => ({
      left: 0, right: 860, top: 0, bottom: 240, width: 860, height: 240, x: 0, y: 0, toJSON: () => ({})
    });
    within(card).getAllByRole('row').slice(1).forEach(row => {
      row.getBoundingClientRect = () => ({
        left: 0, right: 860, top: 0, bottom: 40, width: 860, height: 40, x: 0, y: 0, toJSON: () => ({})
      });
    });
    fireEvent.pointerDown(within(rowOf('session')).getByLabelText(/move row/), {clientX: 100, clientY: 300, pointerId: 1});
    const lifted = document.querySelector('.drag-surface');
    if (lifted === null) throw new Error('nothing is aloft');
    fireEvent.pointerMove(lifted, {buttons: 1, clientX: 100, clientY: 50, pointerId: 1});
    fireEvent.pointerUp(lifted, {pointerId: 1});

    const labels = within(card).getAllByRole('row').slice(1)
      .map(row => within(row).getAllByRole('cell')[0].textContent);
    expect(labels).toEqual(['session', 'this minute', 'last 5 minutes', 'last 15 minutes', 'this hour']);
  });

  test('a criterion from a column menu rules the windows', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const card = screen.getByRole('region', {name: 'live aggregations'});
    const now = 1700000000000;
    broadcast(feed, [
      tradeFrame(50001, now - 30 * 60000, '0.10', 'buy'),
      tradeFrame(50002, now - 10 * 60000, '0.25', 'sell'),
      tradeFrame(50003, now - 3 * 60000, '0.05', 'buy'),
      tradeFrame(50004, now, '0.01', 'buy')
    ]);
    const labels = () => within(card).getAllByRole('row').slice(1)
      .map(row => within(row).getAllByRole('cell')[0].textContent);
    const menuFor = (label: string) => {
      const toggle = within(card).getByRole('button', {name: label});
      const target = toggle.getAttribute('popovertarget') ?? '';
      const menu = document.getElementById(target);
      if (menu === null) throw new Error(`no menu for ${label}`);
      return menu;
    };
    await waitFor(() => expect(within(card).getAllByText('4')).not.toHaveLength(0));

    await userEvent.click(within(menuFor('sort trades')).getByText('descending'));

    expect(labels()).toEqual(['this hour', 'session', 'last 15 minutes', 'last 5 minutes', 'this minute']);
    expect(within(card).getByRole('columnheader', {name: /^trades/}))
      .toHaveAttribute('aria-sort', 'descending');
  });

  test('the controls read out whatever is chosen', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const controls = screen.getByRole('region', {name: 'table controls'});
    expect(controls).toHaveTextContent(/Neighbours swap the moment you drag past them/);
    expect(controls).toHaveTextContent(/blanks out at its origin/);
    expect(controls).toHaveTextContent(/slide to their new seats/);
    expect(controls).toHaveTextContent('dragStyle="hide-eager-move" animated={true}');

    await userEvent.click(screen.getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(screen.getByRole('radio', {name: 'Keep'}));
    await userEvent.click(screen.getByRole('radio', {name: 'Static'}));

    expect(controls).toHaveTextContent(/commits the new order on drop/);
    expect(controls).toHaveTextContent(/stays where it was/);
    expect(controls).toHaveTextContent(/single frame/);
    expect(controls).toHaveTextContent('dragStyle="lazy-move" animated={false}');
    expect(controls).not.toHaveTextContent(/Neighbours swap/);
  });

  test('the recipe teaches whatever the dials are set to', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const recipe = screen.getByRole('region', {name: 'build it from scratch'});
    expect(recipe).toBeVisible();
    expect(recipe).toHaveTextContent(/Nine steps, no drag-and-drop library/);
    expect(within(recipe).getByRole('link', {name: /Drag and Drop/}))
      .toHaveAttribute('href', expect.stringContaining('tab=dragAndDrop'));
    expect(recipe).toHaveTextContent(/touch-action/);
    expect(recipe).toHaveTextContent(/Commit inside the move/);
    expect(recipe).toHaveTextContent(/Blank the origin while it is aloft/);
    expect(recipe).toHaveTextContent(/visibility: hidden/);
    expect(recipe).toHaveTextContent(/Slide the theater, not the layout/);
    expect(recipe).toHaveTextContent(/1cqi/);
    expect(recipe).toHaveTextContent(/translateY\(var\(--drop\)\)/);

    await userEvent.click(screen.getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(screen.getByRole('radio', {name: 'Keep'}));
    await userEvent.click(screen.getByRole('radio', {name: 'Static'}));

    expect(recipe).toHaveTextContent(/Stash the landing, commit on release/);
    expect(recipe).toHaveTextContent(/Leave the origin in place/);
    expect(recipe).toHaveTextContent(/Apply the state update directly/);
    expect(recipe).not.toHaveTextContent(/1cqi/);
    expect(recipe).not.toHaveTextContent(/Commit inside the move/);
  });

  test('every column is resizable', async () => {
    const feed = await streamingFeed();

    renderTables(urlOf(feed));

    const card = screen.getByRole('region', {name: 'live aggregations'});
    expect(within(card).getAllByRole('separator')).toHaveLength(7);
  });
});
