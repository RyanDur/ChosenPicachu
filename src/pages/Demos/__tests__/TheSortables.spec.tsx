import {cleanup, createEvent, fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {interceptedNetwork, listeningFeed, realSockets, subscribed, urlOf} from '@test-support/feed';
import {WebSocketServer} from 'ws';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';

beforeAll(realSockets);
afterAll(interceptedNetwork);

const renderSortables = (feedUrl: string, search = '?tab=dragAndDrop') =>
  renderWithMemoryRouter({
    path: Paths.demos,
    element: <EnvProvider env={{tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9'}}><DemosPage/></EnvProvider>
  }, {path: `${Paths.demos}${search}`});

const feedIsSubscribed = async (): Promise<void> => {
  await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
};

const seats = (): string[] =>
  within(screen.getByRole('list', {name: 'sortable list'}))
    .getAllByRole('listitem').map(({textContent}) => textContent ?? '');

const lifted = (item: string) => {
  fireEvent.mouseDown(screen.getByLabelText(`grip for ${item}`));
  fireEvent.dragStart(screen.getByText(item), {dataTransfer: {effectAllowed: ''}});
};

const draggedOver = (item: string, clientX: number) => {
  const over = createEvent.dragOver(screen.getByText(item));
  Object.defineProperty(over, 'clientX', {value: clientX});
  Object.defineProperty(over, 'dataTransfer', {value: {dropEffect: ''}});
  fireEvent(screen.getByText(item), over);
};

describe('the sortable list demo', () => {
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

  test('one list answers the dials', async () => {
    const feed = await streamingFeed();

    renderSortables(urlOf(feed));

    await feedIsSubscribed();
    expect(seats()).toEqual(['A', 'B', 'C']);
    const controls = screen.getByRole('region', {name: 'list controls'});
    expect(within(controls).getByRole('radio', {name: 'Eager'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Hide'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Animate'})).toBeChecked();
    expect(controls).toHaveTextContent('<EagerHideAnimatedList/>');
  });

  test('an eager drag commits on the crossing', async () => {
    const feed = await streamingFeed();

    renderSortables(urlOf(feed));

    await feedIsSubscribed();
    lifted('A');
    draggedOver('C', 10);

    expect(seats()).toEqual(['B', 'C', 'A']);
  });

  test('a lazy drag holds its shape and settles on release', async () => {
    const feed = await streamingFeed();

    renderSortables(urlOf(feed));

    await feedIsSubscribed();
    const controls = screen.getByRole('region', {name: 'list controls'});
    await userEvent.click(within(controls).getByRole('radio', {name: 'Lazy'}));

    lifted('A');
    draggedOver('C', 10);
    expect(seats()).toEqual(['A', 'B', 'C']);

    fireEvent.dragEnd(screen.getByText('A'), {dataTransfer: {dropEffect: 'move'}});
    await waitFor(() => expect(seats()).toEqual(['B', 'C', 'A']));
  });

  test('hide blanks the origin while something is aloft', async () => {
    const feed = await streamingFeed();

    renderSortables(urlOf(feed));

    await feedIsSubscribed();
    lifted('A');
    expect(screen.getByText('A').closest('.draggable')).toHaveClass('hide');
    fireEvent.dragEnd(screen.getByText('A'), {dataTransfer: {dropEffect: 'none'}});

    const controls = screen.getByRole('region', {name: 'list controls'});
    await userEvent.click(within(controls).getByRole('radio', {name: 'Keep'}));
    lifted('B');
    expect(screen.getByText('B').closest('.draggable')).not.toHaveClass('hide');
  });

  test('the dials travel in the url', async () => {
    const feed = await streamingFeed();

    renderSortables(urlOf(feed), '?tab=dragAndDrop&pace=lazy&origin=keep&motion=static');

    await feedIsSubscribed();
    const controls = screen.getByRole('region', {name: 'list controls'});
    expect(within(controls).getByRole('radio', {name: 'Lazy'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Keep'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Static'})).toBeChecked();
    expect(controls).toHaveTextContent('<LazyKeepStaticList/>');
  });

  test('arrow keys walk an item, and both parties slide', async () => {
    const feed = await streamingFeed();

    renderSortables(urlOf(feed));

    await feedIsSubscribed();
    const grip = screen.getByRole('button', {name: 'grip for A'});
    grip.focus();
    fireEvent.keyDown(grip, {key: 'ArrowRight'});

    expect(seats()).toEqual(['B', 'A', 'C']);
    expect(screen.getByText('A').closest('li')).toHaveClass('pushed');
    expect(screen.getByText('A').closest('li')).toHaveStyle({'--toward': '-1'});
    expect(screen.getByText('B').closest('li')).toHaveClass('pushed');
    expect(screen.getByText('B').closest('li')).toHaveStyle({'--toward': '1'});

    fireEvent.keyDown(screen.getByRole('button', {name: 'grip for A'}), {key: 'ArrowLeft'});
    expect(seats()).toEqual(['A', 'B', 'C']);
  });

  test('the recipe teaches the native road as the dials sit', async () => {
    const feed = await streamingFeed();

    renderSortables(urlOf(feed));

    await feedIsSubscribed();
    const recipe = screen.getByRole('region', {name: 'build the native drag sort yourself'});
    expect(recipe).toBeVisible();
    expect(within(recipe).getByRole('link', {name: /Tables demo/}))
      .toHaveAttribute('href', expect.stringContaining('tab=tables'));
    expect(recipe).toHaveTextContent(/Arm the drag from its handle/);
    expect(recipe).toHaveTextContent(/Accept the drop, or the platform takes it back/);
    expect(recipe).toHaveTextContent(/Commit inside the crossing/);
    expect(recipe).toHaveTextContent(/Fade the origin to a whisper/);
    expect(recipe).toHaveTextContent(/Slide the crossed item home/);
    expect(recipe).toHaveTextContent(/Arrows go straight to the order/);
    expect(recipe).toHaveTextContent(/Know where the road ends/);
    expect(recipe).toHaveTextContent(/read in dragover: always ""/);
    expect(recipe).toHaveTextContent(/onDrop never fired/);
    expect(within(recipe).getByRole('link', {name: 'dataTransfer'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/DataTransfer'));
    expect(recipe.querySelectorAll('.snippet.foil')).toHaveLength(2);
    expect(recipe.querySelectorAll('.story')).toHaveLength(6);
    expect(recipe).toHaveTextContent(/The trader can sort the list the platform’s way/);

    await userEvent.click(within(recipe).getByText(/sees the list answer as they drag/));
    await userEvent.click(within(recipe).getByText(/one card riding the pointer/));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));

    expect(recipe).toHaveTextContent(/Stash the landing, settle after the drag/);
    expect(recipe).toHaveTextContent(/Leave the origin standing/);
    expect(recipe).toHaveTextContent(/Glide the settle, one tick after/);
    expect(recipe).not.toHaveTextContent(/Commit inside the crossing/);
    const controls = screen.getByRole('region', {name: 'list controls'});
    expect(within(controls).getByRole('radio', {name: 'Lazy'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Keep'})).toBeChecked();
  });
});
