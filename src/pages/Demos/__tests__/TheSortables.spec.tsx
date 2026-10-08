import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {createEvent, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {listeningFeed} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';

const seatOf = (item: string): HTMLElement => {
  const seat = screen.getAllByRole('listitem').find(candidate => within(candidate).queryByText(item) !== null);
  if (!seat) throw new Error(`no seat for ${item}`);
  return seat;
};

const seats = (): string[] =>
  within(screen.getByRole('list', {name: 'sortable list'}))
    .getAllByRole('listitem').map(({textContent}) => textContent ?? '');

const lifted = async (item: string) => {
  await userEvent.pointer({keys: '[TouchA>]', target: screen.getByRole('button', {name: `grip for ${item}`})});
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
  await feedIsSubscribed(feed);
  return await screen.findByRole('region', {name: 'build the native drag sort yourself'});
};

describe('the sortable list demo', () => {
  test('a finger pressed on a grip readies its item to be dragged', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const first = within(screen.getByRole('list', {name: 'sortable list'})).getAllByRole('listitem')[0];
    expect(first).toHaveAttribute('draggable', 'false');

    await userEvent.pointer({keys: '[TouchA>]', target: screen.getByRole('button', {name: 'grip for A'})});

    expect(first).toHaveAttribute('draggable', 'true');
  });

  test('a finger pressed and taken over by the browser leaves its item at rest', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const first = within(screen.getByRole('list', {name: 'sortable list'})).getAllByRole('listitem')[0];

    await userEvent.pointer({keys: '[TouchA>]', target: screen.getByRole('button', {name: 'grip for A'})});
    fireEvent.pointerCancel(screen.getByRole('button', {name: 'grip for A'}), {pointerType: 'touch'});

    expect(first).toHaveAttribute('draggable', 'false');
  });

  test('a finger pressed and lifted without a drag leaves a kept item at rest', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop&origin=keep')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const first = within(screen.getByRole('list', {name: 'sortable list'})).getAllByRole('listitem')[0];

    await userEvent.pointer({keys: '[TouchA]', target: screen.getByRole('button', {name: 'grip for A'})});

    expect(first).toHaveAttribute('draggable', 'false');
  });

  test('the list controls are headed at level four', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('heading', {name: 'list controls', level: 4})).toBeInTheDocument();
  });

  test('a finger pressed and lifted without a drag leaves its item at rest', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const first = within(screen.getByRole('list', {name: 'sortable list'})).getAllByRole('listitem')[0];

    await userEvent.pointer({keys: '[TouchA]', target: screen.getByRole('button', {name: 'grip for A'})});

    expect(first).toHaveAttribute('draggable', 'false');
  });

  test('the open cards travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop&native=sort')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await screen.findByRole('region', {name: 'build the native drag sort yourself'});
    expect(recipeFolds.story(recipe, 'The user can arrange the list by hand')).toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The user can arrange the list from the keyboard')).not.toHaveAttribute('open');
  });

  test('the list starts eager, hiding and animated, and says so', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(seats()).toEqual(['A', 'B', 'C']);
    const controls = screen.getByRole('region', {name: 'list controls'});
    expect(within(controls).getByRole('radio', {name: 'Eager'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Hide'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Animate'})).toBeChecked();
    expect(screen.getByText('<EagerHideAnimatedList/>')).toBeVisible();
  });

  test('letting go of the grip does not end a drag under way', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);
    await feedIsSubscribed(feed);

    await lifted('A');
    fireEvent.pointerCancel(screen.getByRole('button', {name: 'grip for A'}), {pointerType: 'touch'});
    draggedOver('C', 10);

    expect(seats()).toEqual(['B', 'C', 'A']);
  });

  test('an eager drag commits on the crossing', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await lifted('A');
    draggedOver('C', 10);

    expect(seats()).toEqual(['B', 'C', 'A']);
  });

  const lazyListWithALifted = async (): Promise<void> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const controls = screen.getByRole('region', {name: 'list controls'});
    await userEvent.click(within(controls).getByRole('radio', {name: 'Lazy'}));
    await lifted('A');
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

    await feedIsSubscribed(feed);
    const controls = screen.getByRole('region', {name: 'list controls'});
    expect(within(controls).getByRole('radio', {name: 'Lazy'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Keep'})).toBeChecked();
    expect(within(controls).getByRole('radio', {name: 'Static'})).toBeChecked();
    expect(screen.getByText('<LazyKeepStaticList/>')).toBeVisible();
  });

  test('an arrow key walks an item past its neighbour, and back', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed(feed);
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

    await feedIsSubscribed(feed);
    screen.getByRole('button', {name: 'grip for A'}).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(seatOf('A')).toHaveStyle({'--toward': '-1'});
    expect(seatOf('B')).toHaveStyle({'--toward': '1'});
  });

  test('an arrow walk says the move', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const grip = screen.getByRole('button', {name: 'grip for A'});
    grip.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('status', {name: 'move report'})).toHaveTextContent('A moved to 2 of 3');
  });

  test('an eager crossing says the move', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=dragAndDrop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await lifted('A');
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
    expect(recipeFolds.story(recipe, 'The user can arrange the list by hand')).toBeInTheDocument();
    expect(recipeFolds.story(recipe, 'The user can arrange the list from the keyboard')).toBeInTheDocument();
    expect(recipe).toHaveTextContent(/The list answers as you drag/);
  });

  test('the recipe’s clues name their rows and columns', async () => {
    await nativeRecipe();

    const clues = within(screen.getByRole('region', {name: 'Start with the need, and let it pick the element'})).getByRole('table', {name: 'the clues'});
    expect(within(clues).getAllByRole('columnheader')).toHaveLength(2);
    expect(within(clues).getAllByRole('rowheader')).toHaveLength(4);
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

    expect(recipeFolds.story(recipe, 'The user can arrange the list by hand')).toHaveAttribute('open');
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

describe('the native drag sort tutorial’s words', () => {
  test('should head its steps with what happens, not with aloft or the road', async () => {
    const story = await recipeFolds.press(await nativeRecipe(), 'The user can arrange the list by hand');

    expect(recipeFolds.stepTitles(story)).toEqual([
      'Arm the drag from its handle',
      'Keep which item is held in state, not in the drag’s payload',
      'Accept the drop, or the platform takes it back',
      'A swap counts once the pointer is a quarter of the way into a neighbour',
      'Commit inside the crossing',
      'Fade the origin to a whisper',
      'Slide the crossed item home',
      'What drag and drop cannot give you'
    ]);
  });

  test('should arm the drag in one run and walk dragstart in the next', async () => {
    const story = await recipeFolds.press(await nativeRecipe(), 'The user can arrange the list by hand');
    const arm = recipeFolds.steps(story)[0];

    expect(within(arm).getAllByRole('paragraph').map(({textContent}) => textContent.replace(/\s+/g, ' '))).toEqual(expect.arrayContaining([
      'draggable is an attribute, a setting written on the element, so let the grip arm it. An event is the browser telling the page that something happened. On pointerdown, the event for a mouse button, a pen or a finger pressing down, the handle sets a flag, and the card renders draggable just for that gesture. The li also wears the shared classes that paint the card, soft-cornered, field, hairline-outline and handle-raised; they are its look, not its drag.',
      'Then the browser fires dragstart, the event for a drag beginning, and its handler declares the move the platform is about to make. The browser answers with the whole ceremony (the drag image under your pointer, the cursor, the cancel) without another line.'
    ]));
  });

  test('should leave the quarter out of the lazy pace, where nothing moves until the release', async () => {
    const recipe = await nativeRecipe();
    await recipeFolds.press(recipe, 'The user can arrange the list by hand');
    await userEvent.click(within(recipe).getByRole('radio', {name: 'Lazy'}));
    const story = recipeFolds.story(recipe, 'The user can arrange the list by hand');

    expect(recipeFolds.stepTitles(story)).toEqual([
      'Arm the drag from its handle',
      'Keep which item is held in state, not in the drag’s payload',
      'Accept the drop, or the platform takes it back',
      'Stash the landing, settle after the drag',
      'Fade the origin to a whisper',
      'Glide the settle, one tick after',
      'What drag and drop cannot give you'
    ]);
    expect(within(story).queryByRole('figure', {name: /^Where a swap counts\./})).not.toBeInTheDocument();
    expect(story).toHaveTextContent('No quarter has to be passed here, because nothing moves until the release.');
  });

  test.each([
    ['an attribute and an event', 'draggable is an attribute, a setting written on the element, so let the grip arm it. An event is the browser telling the page that something happened. On pointerdown, the event for a mouse button, a pen or a finger pressing down,'],
    ['dragstart', 'dragstart, the event for a drag beginning, and its handler declares the move'],
    ['dataTransfer and dragover', 'dataTransfer is the object a drag event carries its data in, the payload. It exists to carry data between windows, and mid-drag it is locked: a handler for dragover, the event the browser fires again and again on whatever the pointer is over,'],
    ['the road', 'Some pixels are never yours on this road, the browser’s own drag and drop: the drag image, the cursor, the macOS cancel.'],
    ['state', 'Steer with state instead, the values React keeps between one drawing of the page and the next. The lift reports which item is held, which the code calls aloft,'],
    ['preventDefault, dropEffect and drop', 'The dragover handler calls preventDefault, the method that tells the browser not to do what it would by default, and here the default is to refuse the drop. dropEffect, a property of dataTransfer, names the verb, such as move or copy, so the cursor matches. And the handler for drop, the event for a release over a target,'],
    ['a bounding box', 'its bounding box, the rectangle the browser reports for an element’s place and size, is the slot.'],
    ['where a crossing counts', 'only counts once the pointer is past the neighbour’s outer quarter; inside that quarter nothing moves'],
    ['the drag image', 'the drag image, a picture of the card that follows the pointer, the cursor, the cancel.']
  ])('should say what %s is where the reader meets it', async (_term, sentence) => {
    expect(await nativeRecipe()).toHaveTextContent(sentence);
  });

  test('should say what dragleave is where the lazy pace meets it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=dragAndDrop&pace=lazy')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'build the native drag sort yourself'})).toHaveTextContent('and dragleave, the event for the pointer leaving an item, forgets it.');
  });

  test('should drop the tables tab’s survey and inner half', async () => {
    expect(await nativeRecipe()).not.toHaveTextContent(/survey|inner half/);
  });

  test('should draw where a swap counts', async () => {
    expect(within(await nativeRecipe()).getByRole('figure', {name: /^Where a swap counts\./})).toBeInTheDocument();
  });

  test('should name MDN as Mozilla’s web reference', async () => {
    await nativeRecipe();

    expect(screen.getByText(/The links go to MDN, Mozilla’s web reference, if you want more\./)).toBeInTheDocument();
  });
});
