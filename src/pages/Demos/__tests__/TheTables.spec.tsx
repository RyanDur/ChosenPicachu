import {cleanup, fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  broadcast,
  listeningFeed,
  subscribed,
  tradeFrame,
  urlOf
} from '@test-support/feed';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/DemosPage';
import {Trading} from '@pages/Demos/Trading';
import {Paths} from '@pages/Paths';

const folds = (root: HTMLElement): HTMLElement[] =>
  within(root).getAllByRole('group').filter(group => group.tagName === 'DETAILS');
const built = (fold: HTMLElement): boolean => [...fold.children].some(child => child.textContent === 'how we built it');
const stories = (root: HTMLElement): HTMLElement[] => folds(root).filter(fold => !built(fold));
const reveals = (root: HTMLElement): HTMLElement[] => folds(root).filter(built);
const opened = (details: readonly HTMLElement[]): HTMLElement[] => details.filter(fold => fold.hasAttribute('open'));

const renderTables = (feedUrl: string, search = '?tab=tables') =>
  renderWithMemoryRouter({
    path: Paths.demos,
    element: <EnvProvider env={{tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9'}}><Trading/></EnvProvider>,
    children: [{index: true, element: <DemosPage/>}]
  }, {path: `${Paths.demos}${search}`});

const feedIsSubscribed = async (): Promise<void> => {
  await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
};

const dialCombos = ['eager', 'lazy'].flatMap(pace =>
  ['keep', 'hide'].flatMap(origin =>
    ['animated', 'static'].map(motion => `pace=${pace}&origin=${origin}&motion=${motion}`)));
const builds = ['react', 'vanilla'].flatMap(world => dialCombos.map(dials => `world=${world}&${dials}`));

describe('the tables demo', () => {
  afterEach(() => {
    cleanup();
  });

  test('the fixed windows hold their rows while the stream fills the cells', async () => {
    const feed = await listeningFeed();

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
    const texts = (row: HTMLElement) => [within(row).getByRole('rowheader'), ...within(row).getAllByRole('cell')].map(cell => cell.textContent);
    const rowFor = (label: string) => within(card).getByRole('row', {name: new RegExp(`^${label}`)});
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
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const card = screen.getByRole('region', {name: 'live aggregations'});
    const controls = await screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});
    for (const axis of ['pace', 'origin', 'motion']) {
      expect(within(controls).getByRole('group', {name: axis})).toBeVisible();
    }
    for (const choice of ['Eager', 'Lazy', 'Keep', 'Hide']) {
      expect(within(controls).getByRole('radio', {name: choice})).toBeVisible();
    }
    expect(within(controls).getByRole('radio', {name: 'Eager'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Hide'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Animate'})).toBeChecked();

    const header = (name: string) =>
      within(card).getByRole('columnheader', {name: new RegExp(`^${name}`)});
    const table = within(card).getAllByRole('table')[0];
    table.getBoundingClientRect = () => ({
      left: 0, right: 860, top: 0, bottom: 240, width: 860, height: 240, x: 0, y: 0, toJSON: () => ({})
    });
    const spans = [150, 110, 100, 100, 120, 150, 130];
    within(table).getAllByRole('columnheader').forEach((head, at) => {
      head.getBoundingClientRect = () => ({
        left: 0, right: 0, top: 0, bottom: 0, width: spans[at], height: 0, x: 0, y: 0, toJSON: () => ({})
      });
    });
    fireEvent.pointerDown(header('vwap'), {clientX: 700, clientY: 20, pointerId: 1});
    fireEvent.pointerMove(header('vwap'), {buttons: 1, clientX: 40, clientY: 120, pointerId: 1});
    fireEvent.pointerUp(header('vwap'), {pointerId: 1});

    const headerTexts = within(card).getAllByRole('columnheader').map(head => head.textContent);
    ['window', 'vwap', 'trades', 'buys', 'sells', 'volume', 'change'].forEach((name, at) =>
      expect(headerTexts[at]).toMatch(new RegExp(`^${name}`)));
  });

  test('the windows can trade places by hand', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const card = screen.getByRole('region', {name: 'live aggregations'});
    const rowOf = (label: string) => {
      const row = within(card).getByRole('row', {name: new RegExp(`^${label}`)});
      if (!row) throw new Error(`no row for ${label}`);
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
    const grip = within(rowOf('session')).getByLabelText(/move row/);
    fireEvent.pointerDown(grip, {clientX: 100, clientY: 300, pointerId: 1});
    fireEvent.pointerMove(grip, {buttons: 1, clientX: 100, clientY: 50, pointerId: 1});
    fireEvent.pointerUp(grip, {pointerId: 1});

    const labels = within(card).getAllByRole('rowheader').map(header => header.getAttribute('aria-label'));
    expect(labels).toEqual(['session', 'this minute', 'last 5 minutes', 'last 15 minutes', 'this hour']);
  });

  test('a criterion from a column menu rules the windows', async () => {
    const feed = await listeningFeed();

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
      .map(row => within(row).getByRole('rowheader').textContent);
    const menuFor = (label: string) => within(card).getByLabelText(`${label} by`);
    await waitFor(() => expect(within(card).getAllByText('4')).not.toHaveLength(0));

    await userEvent.click(within(menuFor('sort trades')).getByText('descending'));

    expect(labels()).toEqual(['this hour', 'session', 'last 15 minutes', 'last 5 minutes', 'this minute']);
    expect(within(card).getByRole('columnheader', {name: /^trades/}))
      .toHaveAttribute('aria-sort', 'descending');
  });

  test('the controls fold behind their readout', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const opener = await screen.findByText('settings', {}, {timeout: 5000});
    const fold = folds(document.body).find(details => details.contains(opener));
    expect(fold).toHaveAttribute('open');
    expect(screen.getByText('<EagerHideAnimatedTable/>')).toBeVisible();

    await userEvent.click(opener);
    expect(screen.getByRole('region', {name: 'table controls'})).not.toBeVisible();
    expect(screen.getByText('<EagerHideAnimatedTable/>')).toBeVisible();
  });

  test('a phone viewport starts the controls closed', async () => {
    const feed = await listeningFeed();
    document.documentElement.style.setProperty('--phone', '600px');
    const wideMedia = window.matchMedia;
    window.matchMedia = (query: string) =>
      ({matches: query.includes('600px'), media: query} as MediaQueryList);
    try {
      renderTables(urlOf(feed));

      await feedIsSubscribed();
      const opener = await screen.findByText('settings', {}, {timeout: 5000});
      expect(folds(document.body).find(details => details.contains(opener))).not.toHaveAttribute('open');
      expect(screen.getByRole('region', {name: 'table controls'})).not.toBeVisible();
    } finally {
      window.matchMedia = wideMedia;
      document.documentElement.style.removeProperty('--phone');
    }
  });

  test('the controls read out whatever is chosen', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const controls = await screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});
    expect(controls).toHaveTextContent(/Neighbours swap the moment you drag past them/);
    expect(controls).toHaveTextContent(/blanks out at its origin/);
    expect(controls).toHaveTextContent(/slide to their new seats/);
    expect(screen.getByText('<EagerHideAnimatedTable/>')).toBeVisible();

    await userEvent.click(within(controls).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(controls).getByRole('radio', {name: 'Keep'}));
    await userEvent.click(within(controls).getByRole('radio', {name: 'Static'}));

    expect(controls).toHaveTextContent(/dispatches the new order on drop/);
    expect(controls).toHaveTextContent(/stays where it was/);
    expect(controls).toHaveTextContent(/single frame/);
    expect(screen.getByText('<LazyKeepStaticTable/>')).toBeVisible();
    expect(controls).not.toHaveTextContent(/Neighbours swap/);
  });

  test('a change of table stands a fresh arrangement: the seating belongs to the table, not the page', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const card = screen.getByRole('region', {name: 'live aggregations'});
    const windows = () => within(card).getAllByRole('rowheader').map(header => header.getAttribute('aria-label'));
    const headers = () => within(card).getAllByRole('columnheader').map(header => header.getAttribute('aria-label'));
    expect(windows().slice(0, 2)).toEqual(['this minute', 'last 5 minutes']);

    fireEvent.keyDown(within(card).getByRole('button', {name: 'move row 1'}), {key: 'ArrowDown'});
    fireEvent.keyDown(within(card).getByRole('columnheader', {name: /^trades/}), {key: 'ArrowRight'});
    expect(windows().slice(0, 2)).toEqual(['last 5 minutes', 'this minute']);

    const controls = await screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});
    await userEvent.click(within(controls).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(controls).getByRole('radio', {name: 'Static'}));

    expect(screen.getByText('<LazyHideStaticTable/>')).toBeVisible();
    expect(windows().slice(0, 2)).toEqual(['this minute', 'last 5 minutes']);
    expect(headers().slice(0, 3)).toEqual(['window', 'trades', 'buys']);
  });

  test('the recipe teaches whatever the dials are set to', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(recipe).toBeVisible();
    expect(recipe).toHaveTextContent(/no drag-and-drop library/);
    expect(recipe).toHaveTextContent(/The trader can sort by column/);
    expect(stories(recipe)).toHaveLength(2);
    expect(opened(stories(recipe))).toHaveLength(0);
    expect(screen.getByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/I watch the market all day/)).toBeVisible();
    expect(screen.getByRole('heading', {name: 'Start with the need, and let it pick the element'})).toBeVisible();
    expect(screen.getByRole('heading', {name: 'The trader can watch the live market in windows they arrange'})).toBeVisible();
    expect(screen.getByText(/so that what they compare sits side by side/)).toBeVisible();
    expect(screen.getByRole('columnheader', {name: 'what it tells you'})).toBeVisible();
    expect(screen.getByRole('rowheader', {name: /keep themselves current/})).toBeVisible();
    expect(screen.getByRole('heading', {name: 'Sketch a design from the need'})).toBeVisible();
    expect(screen.getByRole('heading', {name: 'Slice the design into stories'})).toBeVisible();
    const sliced = within(screen.getByRole('list', {name: 'the slices'}));
    [['The trader can read the market in a table', 'station 4'],
      ['The trader can watch the market live, in windows', 'station 5'],
      ['The trader can sort by column, and by row', 'station 6'],
      ['The trader can sort the windows by any measure, or take the order back', 'station 6'],
      ['The trader can widen a column', 'station 6']
    ].forEach(([slice, station]) =>
      expect(sliced.getAllByRole('listitem').find(item => within(item).queryByText(slice) !== null)).toHaveTextContent(station));
    expect(sliced.getAllByRole('link').map(link => link.getAttribute('href')))
      .toEqual(['#station-4', '#station-5', '#station-6', '#station-6', '#station-6']);
    [['station-4', 'The trader can read the market in a table'],
      ['station-5', 'The trader can watch the market live, in windows'],
      ['station-6', 'Layer on functionality, in the order it was asked for']
    ].forEach(([id, holds]) =>
      expect(within(screen.getByRole('list', {name: 'the stations'})).getAllByRole('listitem')
        .filter(station => within(station).queryAllByText(holds).length > 0).map(station => station.id)).toContain(id));
    expect(screen.getByRole('link', {name: 'user story'}))
      .toHaveAttribute('href', expect.stringContaining('initialcapacity.io/insights/user-story'));
    expect(screen.getByRole('complementary', {name: 'what a design cannot tell you'})).toBeVisible();
    expect(screen.getByText(/keep building on your best interpretation/)).toBeVisible();
    expect(screen.getByText(/What you see above is our interpretation of that/)).toBeVisible();
    expect(recipe).toHaveTextContent(/The sort happens while you drag/);
    const still = screen.getByRole('region', {name: 'the still table'});
    expect(still).toBeVisible();
    expect(still).toHaveTextContent(/The trader can read the market in a table/);
    expect(still).toHaveTextContent(/Deal a real HTML table/);
    expect(still).toHaveTextContent(/scope="col"/);
    expect(stories(still)).toHaveLength(2);
    expect(still).toHaveTextContent(/that is what a table is for/);
    expect(still).toHaveTextContent(/The page is a store/);
    expect(still).toHaveTextContent(/Actions are data, and one reducer reads them/);
    expect(still).toHaveTextContent(/The exchange is middleware/);
    expect(still).toHaveTextContent(/export const demosStore/);
    const living = screen.getByRole('region', {name: 'the living table'});
    expect(living).toBeVisible();
    expect(living).toHaveTextContent(/The trader can watch the market live/);
    expect(stories(living)).toHaveLength(1);
    expect(living).toHaveTextContent(/a socket comes next/);
    expect(living).toHaveTextContent(/Hydrate with one fetch/);
    expect(living).toHaveTextContent(/where a number comes from/);
    expect(living).toHaveTextContent(/Drawn, not recorded/);
    expect(screen.getByRole('heading', {name: 'Layer on functionality, in the order it was asked for'})).toBeVisible();
    expect(screen.getByText(/Both axes, every layer, or the layer is not done/)).toBeVisible();
    expect(screen.getByRole('columnheader', {name: 'by keyboard'})).toBeVisible();
    expect(screen.getByRole('rowheader', {name: 'Widen a column'})).toBeVisible();
    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));
    expect(within(recipe).getByRole('link', {name: /Drag sort list demo/}))
      .toHaveAttribute('href', expect.stringContaining('tab=dragAndDrop'));
    expect(recipe).toHaveTextContent(/touch-action/);
    expect(recipe).toHaveTextContent(/Write each listener once, for both worlds/);
    const [term] = within(recipe).getAllByRole('button', {name: 'survey'});
    expect(term).toHaveClass('term');
    expect(term).toHaveAttribute('popovertarget');
    const [definition] = within(recipe).getAllByLabelText('survey');
    expect(definition).toHaveTextContent(/the one measurement taken at the grab/);
    expect(recipe).toHaveTextContent(/export type Store<State, Action>/);
    expect(within(recipe).getAllByText('how we built it').length).toBeGreaterThan(0);
    expect(opened(reveals(recipe))).toHaveLength(0);
    expect(recipe).toHaveTextContent(/Commit inside the move/);
    expect(recipe).toHaveTextContent(/Carry the real thing/);
    expect(recipe).toHaveTextContent(/translate: var\(--carried-by, 0 0\)/);
    expect(within(recipe).getAllByRole('link', {name: 'the implementation'})[0])
      .toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/tree/main/src/pages/Demos/Tables/Builds/EagerHideAnimatedTable');
    expect(recipe).toHaveTextContent(/Let the column settle/);
    expect(recipe).toHaveTextContent(/the only motion code there is/);
    expect(recipe).toHaveTextContent(/@keyframes settle \{/);
    expect(recipe).toHaveTextContent(/Turn the carry vertical/);
    expect(within(recipe).getByRole('link', {name: 'insertBefore'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore'));

    await userEvent.click(within(recipe).getByText(/The trader can sort by row/));
    expect(opened(stories(recipe))).toHaveLength(2);
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Static'}));

    expect(recipe).toHaveTextContent(/Hold still, dispatch on release/);
    expect(recipe).toHaveTextContent(/the sort lands on the drop/);
    expect(recipe).toHaveTextContent(/stays where it stands while you drag/);
    expect(recipe).toHaveTextContent(/instantly, with no motion/);
    expect(recipe).toHaveTextContent(/Leave the origin in place/);
    expect(recipe).toHaveTextContent(/Leave the motion out/);
    expect(recipe).not.toHaveTextContent(/1cqi/);
    expect(recipe).not.toHaveTextContent(/Commit inside the move/);
    const controls = await screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});
    expect(within(controls).getByRole('radio', {name: 'Lazy'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Keep'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Static'})).toBeChecked();
  });

  test('a hash arriving in the url is brought to its station', async () => {
    const brought: string[] = [];
    Element.prototype.scrollIntoView = function (this: Element) {
      brought.push(this.id);
    };
    location.hash = '#station-5';
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await screen.findByRole('heading', {name: 'Slice the design into stories'});
    expect(brought).toContain('station-5');
    Element.prototype.scrollIntoView = () => undefined;
    location.hash = '';
  });

  test('the keyboard track teaches the same sort by other hands', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    await userEvent.click(within(recipe).getByRole('button', {name: 'By keyboard'}));

    expect(recipe).toHaveTextContent(/Give focus a place to land/);
    expect(recipe).toHaveTextContent(/Arrows speak direction/);
    expect(recipe).toHaveTextContent(/Both parties slide/);
    expect(recipe).toHaveTextContent(/the stylesheet slides them/);
    await userEvent.click(within(recipe).getByText(/The trader can sort by column/));
    expect(recipe).toHaveTextContent(/measures the header row at the keypress/);
    expect(recipe).toHaveTextContent(/The trader can sort by row/);
    expect(recipe).toHaveTextContent(/Turn the arrows vertical/);
    expect(stories(recipe)).toHaveLength(2);
    expect(recipe).not.toHaveTextContent(/Hold the pointer from the lift/);
    expect(within(recipe).queryByRole('radio', {name: 'Lazy'})).toBeNull();

    await userEvent.click(within(recipe).getByRole('radio', {name: 'Static'}));

    expect(recipe).toHaveTextContent(/Cut on the keypress/);
    expect(recipe).not.toHaveTextContent(/Both parties slide/);

    await userEvent.click(within(recipe).getByRole('button', {name: 'By pointer'}));
    expect(recipe).toHaveTextContent(/Hold the pointer from the lift/);
  });

  test('the chosen track travels in the url', async () => {
    const feed = await listeningFeed();

    renderWithMemoryRouter({
      path: Paths.demos,
      element: <EnvProvider env={{tradeFeed: urlOf(feed), tradeHistory: 'http://127.0.0.1:9'}}><Trading/></EnvProvider>,
    children: [{index: true, element: <DemosPage/>}]
    }, {path: `${Paths.demos}?tab=tables&track=keyboard`});

    await feedIsSubscribed();
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(recipe).toHaveTextContent(/Arrows speak direction/);
    expect(recipe).not.toHaveTextContent(/Hold the pointer from the lift/);
  });

  test('a second tutorial answers the resize', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    expect(await screen.findByRole('region', {name: 'build the drag sort yourself'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'build the drag resize yourself'})).toBeNull();

    await userEvent.click(screen.getByRole('button', {name: 'Drag resize'}));

    const resize = await screen.findByRole('region', {name: 'build the drag resize yourself'});
    expect(resize).toBeVisible();
    expect(resize).toHaveTextContent(/zero-sum ledger/);
    expect(resize).toHaveTextContent(/Trade, never take/);
    expect(resize).toHaveTextContent(/A handle that is a button/);
    expect(stories(resize)).toHaveLength(1);
    expect(resize).toHaveTextContent(/The trader can widen a column/);
    expect(within(resize).getByRole('link', {name: 'captures its pointer'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture'));
    expect(screen.queryByRole('region', {name: 'build the drag sort yourself'})).toBeNull();
    expect(screen.queryByRole('region', {name: 'table controls'})).toBeNull();
    expect(screen.getByRole('region', {name: 'the living table'})).toBeVisible();

    await userEvent.click(screen.getByRole('button', {name: 'Drag sort'}));
    expect(await screen.findByRole('region', {name: 'build the drag sort yourself'})).toBeVisible();
  });

  test('the open cards travel in the url', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed), '?tab=tables&sort=column');

    await feedIsSubscribed();
    const recipe = await screen.findByRole('region', {name: 'build the drag sort yourself'});
    expect(opened(stories(recipe))).toHaveLength(1);
    expect(stories(recipe)[0]).toHaveAttribute('open');
    const living = screen.getByRole('region', {name: 'the living table'});
    expect(opened(stories(living))).toHaveLength(0);
  });

  test('the dials travel in the url', async () => {
    const feed = await listeningFeed();

    renderWithMemoryRouter({
      path: Paths.demos,
      element: <EnvProvider env={{tradeFeed: urlOf(feed), tradeHistory: 'http://127.0.0.1:9'}}><Trading/></EnvProvider>,
    children: [{index: true, element: <DemosPage/>}]
    }, {path: `${Paths.demos}?tab=tables&pace=lazy&origin=keep&motion=static`});

    await feedIsSubscribed();
    const controls = await screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});
    expect(within(controls).getByRole('radio', {name: 'Lazy'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Keep'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Static'})).toBeChecked();
    expect(screen.getByText('<LazyKeepStaticTable/>')).toBeVisible();
  });

  test('a third tutorial answers the menu', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    await feedIsSubscribed();
    await userEvent.click(screen.getByRole('button', {name: 'Sort menu'}));

    const recipe = await screen.findByRole('region', {name: 'build the sort menu yourself'});
    expect(recipe).toBeVisible();
    expect(recipe).toHaveTextContent(/popover/);
    expect(recipe).toHaveTextContent(/position-area/);
    expect(recipe).toHaveTextContent(/The rule is a drape, not a bake/);
    expect(recipe).toHaveTextContent(/A hand ends the rule/);
    expect(recipe).toHaveTextContent(/ruledBy\(column, direction\) : reset\(arrival\)/);
    expect(recipe).not.toHaveTextContent(/Dress the menu as a card/);
    expect(within(recipe).getByRole('link', {name: 'position-area'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/CSS/position-area'));
    expect(stories(recipe)).toHaveLength(1);
    expect(recipe).toHaveTextContent(/The trader can sort the windows by any measure/);
    expect(screen.queryByRole('region', {name: 'build the drag sort yourself'})).toBeNull();
    expect(screen.queryByRole('region', {name: 'table controls'})).toBeNull();
    expect(screen.getByRole('region', {name: 'the living table'})).toBeVisible();

    expect(recipe).toHaveTextContent(/Rule directly/);
    expect(recipe).toHaveTextContent(/a menu click has none/);
  });

  test('the chosen tutorial travels in the url', async () => {
    const feed = await listeningFeed();

    renderWithMemoryRouter({
      path: Paths.demos,
      element: <EnvProvider env={{tradeFeed: urlOf(feed), tradeHistory: 'http://127.0.0.1:9'}}><Trading/></EnvProvider>,
    children: [{index: true, element: <DemosPage/>}]
    }, {path: `${Paths.demos}?tab=tables&tut=resize`});

    await feedIsSubscribed();
    expect(await screen.findByRole('region', {name: 'build the drag resize yourself'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'build the drag sort yourself'})).toBeNull();
  });

  test('every column is resizable', async () => {
    const feed = await listeningFeed();

    renderTables(urlOf(feed));

    const card = screen.getByRole('region', {name: 'live aggregations'});
    expect(within(card).getAllByRole('button', {name: /^resize/})).toHaveLength(7);
  });

  describe('the table worlds', () => {
    const standFrame = async () => {
      const frame = await screen.findByTitle('the living table, in vanilla');
      Object.defineProperty(frame, 'contentDocument', {
        value: {body: {getBoundingClientRect: () => ({height: 487})}}
      });
      fireEvent.load(frame);
      return frame;
    };

    test('react holds the stage by default, and no frame stands', async () => {
      const feed = await listeningFeed();

      renderTables(urlOf(feed));

      expect(await screen.findByRole('region', {name: 'live aggregations'})).toBeInTheDocument();
      expect(screen.queryByTitle('the living table, in vanilla')).not.toBeInTheDocument();
    });

    test('the html world deals the table in its own document', async () => {
      const feed = await listeningFeed();

      renderTables(urlOf(feed), '?tab=tables&world=vanilla');

      const frame = await standFrame();
      expect(frame).toHaveAttribute('srcdoc', expect.stringContaining('<table'));
      const card = screen.getByRole('region', {name: 'live aggregations'});
      expect(card).toContainElement(frame);
      await waitFor(() => expect(within(card).queryByRole('table')).not.toBeInTheDocument());
    });

    test('one tutorial stands in both worlds; only the build swaps', async () => {
      const feed = await listeningFeed();

      renderTables(urlOf(feed), '?tab=tables&world=vanilla');

      expect(await screen.findByRole('heading', {name: 'The trader can watch the market live, in windows'})).toBeInTheDocument();
      expect(screen.getByText('Drag resize')).toBeInTheDocument();
      expect((await screen.findAllByRole('radio', {name: 'Eager', hidden: true})).length).toBeGreaterThan(0);
      expect(screen.queryByText('The trader can read the market in windows')).not.toBeInTheDocument();
    });

    test('the menu story stands in the html world', async () => {
      const feed = await listeningFeed();

      renderTables(urlOf(feed), '?tab=tables&world=vanilla&tut=menu');

      expect(await screen.findByRole('heading', {name: 'The trader can sort the windows by any measure, or take the order back'})).toBeInTheDocument();
    });

    test('the resize story stands in the html world', async () => {
      const feed = await listeningFeed();

      renderTables(urlOf(feed), '?tab=tables&world=vanilla&tut=resize');

      expect(await screen.findByRole('heading', {name: 'The trader can widen a column'})).toBeInTheDocument();
    });

    test('the sort tutorial stands in every build, in both worlds, on both tracks', async () => {
      const feed = await listeningFeed();
      for (const build of builds) {
        const {unmount} = renderTables(urlOf(feed), `?tab=tables&tut=sort&${build}`);
        expect(await screen.findByText('The trader can sort by column')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', {name: 'By keyboard'}));
        expect(await screen.findByText('Give focus a place to land')).toBeInTheDocument();
        unmount();
      }
    }, 20000);

    test('the explainer stands in the html world too', async () => {
      const feed = await listeningFeed();

      renderTables(urlOf(feed), '?tab=tables&world=vanilla');

      expect(await screen.findByText('what am I looking at?')).toBeInTheDocument();
      expect(screen.getByTitle('the living table, in vanilla')).toBeInTheDocument();
    });

    test('the frame wears its own document\u2019s height', async () => {
      const feed = await listeningFeed();

      renderTables(urlOf(feed), '?tab=tables&world=vanilla');

      const frame = await standFrame();

      expect(frame).toHaveStyle({'--stage-block-size': '487px'});
    });

    test('the world dial swaps the stage', async () => {
      const feed = await listeningFeed();

      renderTables(urlOf(feed));

      await userEvent.click(await screen.findByRole('radio', {name: 'Vanilla'}));

      const frame = await standFrame();
      const card = screen.getByRole('region', {name: 'live aggregations'});
      expect(card).toContainElement(frame);
      await waitFor(() => expect(within(card).queryByRole('table')).not.toBeInTheDocument());
    });
  });
});
