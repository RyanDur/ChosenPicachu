import {TestApp} from '@test-support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {createEvent, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {listeningFeed} from '@test-support/feed';
import {feedIsSubscribed} from '@test-support';
import {story} from '@pages/Demos/Recipe/__test_support';

const seatOf = (item: string): HTMLElement => {
  const seat = screen.getAllByRole('listitem').find(candidate => within(candidate).queryByText(item) !== null);
  if (!seat) throw new Error(`no seat for ${item}`);
  return seat;
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

const nativeRecipe = async (): Promise<HTMLElement> => {
  const feed = await listeningFeed();
  render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);
  await feedIsSubscribed();
  return await screen.findByRole('region', {name: 'build the native drag sort yourself'});
};

describe('the sortable list demo', () => {
  test('the open cards travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop&native=sort')} feed={feed}/>);

    await feedIsSubscribed();
    const recipe = await screen.findByRole('region', {name: 'build the native drag sort yourself'});
    expect(story(recipe, 'The user can arrange the list by hand')).toHaveAttribute('open');
    expect(story(recipe, 'The user can arrange the list from the keyboard')).not.toHaveAttribute('open');
  });

  test('the list starts eager, hiding and animated, and says so', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed();
    expect(seats()).toEqual(['A', 'B', 'C']);
    const controls = screen.getByRole('region', {name: 'list controls'});
    expect(within(controls).getByRole('radio', {name: 'Eager'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Hide'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Animate'})).toBeChecked();
    expect(screen.getByText('<EagerHideAnimatedList/>')).toBeVisible();
  });

  test('an eager drag commits on the crossing', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed();
    lifted('A');
    draggedOver('C', 10);

    expect(seats()).toEqual(['B', 'C', 'A']);
  });

  const lazyListWithALifted = async (): Promise<void> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);
    await feedIsSubscribed();
    const controls = screen.getByRole('region', {name: 'list controls'});
    await userEvent.click(within(controls).getByRole('radio', {name: 'Lazy'}));
    lifted('A');
    draggedOver('C', 10);
  };

  test('a lazy drag holds its shape while it crosses', async () => {
    await lazyListWithALifted();

    expect(seats()).toEqual(['A', 'B', 'C']);
  });

  test('a lazy drag settles on release', async () => {
    await lazyListWithALifted();

    fireEvent.dragEnd(screen.getByText('A'), {dataTransfer: {dropEffect: 'move'}});

    await waitFor(() => expect(seats()).toEqual(['B', 'C', 'A']));
  });

  test('the dials travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop&pace=lazy&origin=keep&motion=static')} feed={feed}/>);

    await feedIsSubscribed();
    const controls = screen.getByRole('region', {name: 'list controls'});
    expect(within(controls).getByRole('radio', {name: 'Lazy'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Keep'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Static'})).toBeChecked();
    expect(screen.getByText('<LazyKeepStaticList/>')).toBeVisible();
  });

  test('an arrow key walks an item past its neighbour, and back', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed();
    const grip = screen.getByRole('button', {name: 'grip for A'});
    grip.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(seats()).toEqual(['B', 'A', 'C']);

    screen.getByRole('button', {name: 'grip for A'}).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(seats()).toEqual(['A', 'B', 'C']);
  });

  test('both parties slide toward their new seats', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed();
    screen.getByRole('button', {name: 'grip for A'}).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(seatOf('A')).toHaveStyle({'--toward': '-1'});
    expect(seatOf('B')).toHaveStyle({'--toward': '1'});
  });

  test('an arrow walk says the move', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed();
    const grip = screen.getByRole('button', {name: 'grip for A'});
    grip.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('A moved to 2 of 3');
  });

  test('an eager crossing says the move', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed();
    lifted('A');
    draggedOver('C', 10);

    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('A moved to 3 of 3');
  });

  test('a lazy release says the move', async () => {
    await lazyListWithALifted();

    fireEvent.dragEnd(screen.getByText('A'), {dataTransfer: {dropEffect: 'move'}});

    await waitFor(() => expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('A moved to 3 of 3'));
  });

  test('the recipe opens on the need with both stories listed', async () => {
    const recipe = await nativeRecipe();

    expect(recipe).toBeVisible();
    expect(screen.getByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getAllByText(/the order is mine/).length).toBeGreaterThan(0);
    expect(story(recipe, 'The user can arrange the list by hand')).toBeInTheDocument();
    expect(story(recipe, 'The user can arrange the list from the keyboard')).toBeInTheDocument();
    expect(recipe).toHaveTextContent(/The list answers as you drag/);
  });

  test('the recipe walks the stations from need to design to slices', async () => {
    const recipe = await nativeRecipe();

    expect(screen.getByRole('heading', {name: 'Start with the need, and let it pick the element'})).toBeVisible();
    expect(screen.getByRole('rowheader', {name: /pick it up and put it there/})).toBeVisible();
    expect(screen.getByRole('heading', {name: 'Sketch a design from the need'})).toBeVisible();
    expect(screen.getByRole('complementary', {name: 'what a design cannot tell you'})).toBeVisible();
    expect(screen.getByRole('heading', {name: 'The user can keep the list in the order they mean'})).toBeVisible();
    expect(screen.getByRole('link', {name: 'user story'}))
      .toHaveAttribute('href', expect.stringContaining('initialcapacity.io/insights/user-story'));
    expect(screen.getByRole('heading', {name: 'Layer on functionality, in the order it was asked for'})).toBeVisible();
    expect(screen.getByText(/What you see above is our interpretation of that/)).toBeVisible();
    expect(recipe).toHaveTextContent(/Arm the drag from its handle/);
    expect(recipe).toHaveTextContent(/Accept the drop, or the platform takes it back/);
    expect(recipe).toHaveTextContent(/Commit inside the crossing/);
    expect(recipe).toHaveTextContent(/Fade the origin to a whisper/);
    expect(recipe).toHaveTextContent(/Slide the crossed item home/);
    expect(recipe).toHaveTextContent(/Arrows go straight to the order/);
    expect(recipe).toHaveTextContent(/Know where the road ends/);
    expect(within(recipe).getByRole('link', {name: 'dataTransfer'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/DataTransfer'));
  });

  test('the slices point at their station', async () => {
    await nativeRecipe();

    expect(screen.getByRole('heading', {name: 'Slice the design into stories'})).toBeVisible();
    const sliced = within(screen.getByRole('list', {name: 'the slices'}));
    ['The user can arrange the list by hand', 'The user can arrange the list from the keyboard']
      .forEach(slice => expect(sliced.getAllByRole('listitem').find(item => within(item).queryByText(slice) !== null)).toHaveTextContent('station 4'));
    expect(sliced.getAllByRole('link').map(link => link.getAttribute('href')))
      .toEqual(['#station-4', '#station-4']);
    expect(within(screen.getByRole('list', {name: 'the stations'})).getAllByRole('listitem')
      .filter(station => within(station).queryAllByText('Layer on functionality, in the order it was asked for').length > 0).map(station => station.id)).toContain('station-4');
  });

  test('opening the by-hand story points at the tables demo', async () => {
    const recipe = await nativeRecipe();

    await userEvent.click(within(recipe).getByText(/The user can arrange the list by hand/));

    expect(story(recipe, 'The user can arrange the list by hand')).toHaveAttribute('open');
    expect(within(recipe).getByRole('link', {name: /Tables demo/}))
      .toHaveAttribute('href', expect.stringContaining('tab=tables'));
  });

  const byHandStoryDialledLazyKeep = async (): Promise<HTMLElement> => {
    const recipe = await nativeRecipe();
    await userEvent.click(within(recipe).getByText(/The user can arrange the list by hand/));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Lazy'}));
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Keep'}));
    return recipe;
  };

  test('the recipe teaches whatever the dials are set to', async () => {
    const recipe = await byHandStoryDialledLazyKeep();

    expect(recipe).toHaveTextContent(/Stash the landing, settle after the drag/);
    expect(recipe).toHaveTextContent(/Leave the origin standing/);
    expect(recipe).toHaveTextContent(/Glide the settle, one tick after/);
    expect(recipe).not.toHaveTextContent(/Commit inside the crossing/);
  });

  test("turning a dial in the recipe turns the list's own controls", async () => {
    await byHandStoryDialledLazyKeep();

    const controls = screen.getByRole('region', {name: 'list controls'});
    expect(within(controls).getByRole('radio', {name: 'Lazy'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Keep'})).toBeChecked();
  });
});
