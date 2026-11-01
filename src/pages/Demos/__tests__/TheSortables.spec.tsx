import {outOfReadingOrder} from '@__test_support/reading-order';
import {TestApp} from '@__test_support/TestApp';
import {paragraphReading} from '@__test_support/paragraph';
import {Paths} from '@pages/Paths';
import {itemHeadedBy} from '@__test_support/headed-item';
import {demoPage, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {render, waitFor} from '@testing-library/react';
import {listeningFeed} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {dragSortTab, listControls, sortableList} from '@pages/Demos/DragAndDrop/__test_support';

const nativeRecipe = async (): Promise<HTMLElement> => {
  const feed = await listeningFeed();
  render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);
  await feedIsSubscribed(feed);
  return await dragSortTab.recipe();
};

describe('the sortable list demo', () => {
  test('a finger pressed on a grip readies its item to be dragged', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const first = sortableList.itemsIn(await sortableList.arrived())[0];
    expect(first).toHaveAttribute('draggable', 'false');

    await sortableList.fingerDown('A');

    expect(first).toHaveAttribute('draggable', 'true');
  });

  test('a finger pressed and taken over by the browser leaves its item at rest', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const first = sortableList.itemsIn(await sortableList.arrived())[0];

    await sortableList.fingerDown('A');
    sortableList.browserTakesOver('A');

    expect(first).toHaveAttribute('draggable', 'false');
  });

  test('a finger pressed and lifted without a drag leaves a kept item at rest', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', '?origin=keep')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const first = sortableList.itemsIn(await sortableList.arrived())[0];

    await sortableList.fingerTap('A');

    expect(first).toHaveAttribute('draggable', 'false');
  });

  test('the list controls are headed at level four', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await listControls.heading()).toBeInTheDocument();
  });

  test('a finger pressed and lifted without a drag leaves its item at rest', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const first = sortableList.itemsIn(await sortableList.arrived())[0];

    await sortableList.fingerTap('A');

    expect(first).toHaveAttribute('draggable', 'false');
  });

  test('the open cards travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop', '?native=sort')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await dragSortTab.recipe();
    expect(recipeFolds.story(recipe, 'The user can arrange the list by hand')).toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The user can arrange the list from the keyboard')).not.toHaveAttribute('open');
  });

  test('the list starts eager, hiding and animated, and says so', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    expect(sortableList.seats()).toEqual(['A', 'B', 'C']);
    expect(listControls.option('Eager')).toBeChecked();
    expect(listControls.option('Hide')).toBeChecked();
    expect(listControls.option('Animate')).toBeChecked();
    expect(demoPage.words('<EagerHideAnimatedList/>')).toBeVisible();
  });

  test('letting go of the grip does not end a drag under way', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await sortableList.arrived();

    await sortableList.lift('A');
    sortableList.browserTakesOver('A');
    sortableList.dragOver('C', 10);

    expect(sortableList.seats()).toEqual(['B', 'C', 'A']);
  });

  test('an eager drag commits on the crossing', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    await sortableList.lift('A');
    sortableList.dragOver('C', 10);

    expect(sortableList.seats()).toEqual(['B', 'C', 'A']);
  });

  const lazyListWithALifted = async (): Promise<void> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await sortableList.arrived();
    await listControls.choose('Lazy');
    await sortableList.lift('A');
    sortableList.dragOver('C', 10);
  };

  test('a lazy drag holds its shape while it crosses', async () => {
    await lazyListWithALifted();

    expect(sortableList.seats()).toEqual(['A', 'B', 'C']);
  });

  test('a lazy drag settles on release', async () => {
    await lazyListWithALifted();

    sortableList.release('A');

    await waitFor(() => expect(sortableList.seats()).toEqual(['B', 'C', 'A']));
  });

  test('the dials travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop', '?pace=lazy&origin=keep&motion=static')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    expect(listControls.option('Lazy')).toBeChecked();
    expect(listControls.option('Keep')).toBeChecked();
    expect(listControls.option('Static')).toBeChecked();
    expect(demoPage.words('<LazyKeepStaticList/>')).toBeVisible();
  });

  test('an arrow key walks an item past its neighbor, and back', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    await sortableList.moveByKey('A', '{ArrowRight}');

    expect(sortableList.seats()).toEqual(['B', 'A', 'C']);

    await sortableList.moveByKey('A', '{ArrowLeft}');
    expect(sortableList.seats()).toEqual(['A', 'B', 'C']);
  });

  test('both parties slide toward their new seats', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    await sortableList.moveByKey('A', '{ArrowRight}');

    expect(sortableList.seatOf('A')).toHaveStyle({'--toward': '-1'});
    expect(sortableList.seatOf('B')).toHaveStyle({'--toward': '1'});
  });

  test('an arrow walk says the move', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    await sortableList.moveByKey('A', '{ArrowRight}');

    expect(sortableList.moveReport()).toHaveTextContent('A moved to 2 of 3');
  });

  test('an eager crossing says the move', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    await sortableList.lift('A');
    sortableList.dragOver('C', 10);

    expect(sortableList.moveReport()).toHaveTextContent('A moved to 3 of 3');
  });

  test('a lazy release says the move', async () => {
    await lazyListWithALifted();

    sortableList.release('A');

    await waitFor(() => expect(sortableList.moveReport()).toHaveTextContent('A moved to 3 of 3'));
  });

  test('the recipe opens on the need with both stories listed', async () => {
    const recipe = await nativeRecipe();

    expect(recipe).toBeVisible();
    expect(demoPage.heading('let’s build this feature')).toBeVisible();
    expect(demoPage.everyWords(/the order is mine/).length).toBeGreaterThan(0);
    expect(recipeFolds.story(recipe, 'The user can arrange the list by hand')).toBeInTheDocument();
    expect(recipeFolds.story(recipe, 'The user can arrange the list from the keyboard')).toBeInTheDocument();
    expect(recipe).toHaveTextContent(/The order changes as you drag/);
  });

  test('the recipe’s clues name their rows and columns', async () => {
    await nativeRecipe();

    const clues = dragSortTab.tableIn(demoPage.part('Start with the need, and let it pick the element'), 'the clues');
    expect(clues.columns).toHaveLength(2);
    expect(clues.rows).toHaveLength(4);
  });

  test('should open the first step on the need, and say the clues point at the element', async () => {
    await nativeRecipe();

    expect(explanation.saying(demoPage.part('Start with the need, and let it pick the element'), /^Before any code/))
      .toHaveTextContent('Before any code, and before any story, someone needs something. Listen for what they say, name each clue, and the clues point at the element to build it with.');
  });

  test('the recipe walks the stations from need to design to slices', async () => {
    const recipe = await nativeRecipe();

    expect(demoPage.heading('Start with the need, and let it pick the element')).toBeVisible();
    expect(demoPage.rowHeader(/pick it up and put it there/)).toBeVisible();
    expect(demoPage.heading('Sketch a design from the need')).toBeVisible();
    expect(demoPage.aside('what a design cannot tell you')).toBeVisible();
    expect(demoPage.heading('The user can keep the list in the order they mean')).toBeVisible();
    expect(demoPage.link('user story'))
      .toHaveAttribute('href', expect.stringContaining('initialcapacity.io/insights/user-story'));
    expect(demoPage.heading('Layer on functionality, in the order it was asked for')).toBeVisible();
    expect(demoPage.words(/What you see above is my interpretation of that/)).toBeVisible();
    expect(recipe).toHaveTextContent(/Arm the drag from its grip/);
    expect(recipe).toHaveTextContent(/Accept the drop, or the platform takes it back/);
    expect(recipe).toHaveTextContent(/Commit inside the crossing/);
    expect(recipe).toHaveTextContent(/Fade the lifted card almost away/);
    expect(recipe).toHaveTextContent(/Slide the crossed item into place/);
    expect(recipe).toHaveTextContent(/Arrows go straight to the order/);
    expect(explanation.linkNamed(recipe, 'dataTransfer'))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/DataTransfer'));
  });

  test('the slices point at their station', async () => {
    await nativeRecipe();

    expect(demoPage.heading('Slice the design into stories')).toBeVisible();
    ['The user can arrange the list by hand', 'The user can arrange the list from the keyboard']
      .forEach(slice => expect(demoPage.slice(slice)).toHaveTextContent('station 4'));
    expect(demoPage.sliceLinks())
      .toEqual(['#station-4', '#station-4']);
    expect(demoPage.stationsHolding('Layer on functionality, in the order it was asked for')).toContain('station-4');
  });

  test('opening the by-hand story points at the tables demo', async () => {
    const recipe = await nativeRecipe();

    await dragSortTab.pressWords(recipe, /The user can arrange the list by hand/);

    expect(recipeFolds.story(recipe, 'The user can arrange the list by hand')).toHaveAttribute('open');
    const steps = recipeFolds.steps(recipeFolds.story(recipe, 'The user can arrange the list by hand'));
    expect(explanation.linkNamed(steps[steps.length - 1], /Tables demo/))
      .toHaveAttribute('href', '/demos/tables/');
  });

  const byHandStoryDialledLazyKeep = async (): Promise<HTMLElement> => {
    const recipe = await nativeRecipe();
    await dragSortTab.pressWords(recipe, /The user can arrange the list by hand/);
    await dragSortTab.chooseIn(recipe, 'Lazy');
    await dragSortTab.chooseIn(recipe, 'Keep');
    return recipe;
  };

  test('the recipe teaches whatever the dials are set to', async () => {
    const recipe = await byHandStoryDialledLazyKeep();

    expect(recipe).toHaveTextContent(/Stash the landing, settle after the drag/);
    expect(recipe).toHaveTextContent(/Leave the lifted card where it was/);
    expect(recipe).toHaveTextContent(/Glide the settle one tick after the release/);
    expect(recipe).not.toHaveTextContent(/Commit inside the crossing/);
  });

  test("turning a dial in the recipe turns the list's own controls", async () => {
    await byHandStoryDialledLazyKeep();

    expect(listControls.option('Lazy')).toBeChecked();
    expect(listControls.option('Keep')).toBeChecked();
  });
});

describe('arriving at a station', () => {
  test('should take the keyboard to the station the address names', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={`${demosAt('drag-and-drop')}#station-4`} feed={feed}/>);
    await feedIsSubscribed(feed);

    await demoPage.findHeading('Layer on functionality, in the order it was asked for');

    await waitFor(() => expect(itemHeadedBy('the stations', 'Layer on functionality, in the order it was asked for')).toHaveFocus());
  });
});

describe('the native drag sort tutorial’s words', () => {
  test('should put the crossing’s drawing after the code that measures it', async () => {
    const story = await recipeFolds.press(await nativeRecipe(), 'The user can arrange the list by hand');
    const step = recipeFolds.stepHeaded(story, 'A swap counts once the pointer is a quarter of the way into a neighbor');
    const [measures] = explanation.samplesIn(step);

    expect(outOfReadingOrder([explanation.saying(step, /^Nothing has to be measured ahead of time/), measures, explanation.drawingsIn(step)[0]])).toEqual([]);
  });

  test('should head its steps with what happens, not with aloft or the road', async () => {
    const story = await recipeFolds.press(await nativeRecipe(), 'The user can arrange the list by hand');

    expect(recipeFolds.stepTitles(story)).toEqual([
      'Arm the drag from its grip',
      'Keep which item is held in state, not in the drag’s payload',
      'Accept the drop, or the platform takes it back',
      'A swap counts once the pointer is a quarter of the way into a neighbor',
      'Commit inside the crossing',
      'Fade the lifted card almost away',
      'Slide the crossed item into place',
      'What drag and drop cannot give you'
    ]);
  });

  test('should arm the drag in one run and walk dragstart in the next', async () => {
    const story = await recipeFolds.press(await nativeRecipe(), 'The user can arrange the list by hand');
    const arm = recipeFolds.steps(story)[0];

    expect(explanation.paragraphsIn(arm).map(told => told.replace(/\s+/g, ' '))).toEqual(expect.arrayContaining([
      'draggable is an attribute, a setting written on the element, and the grip turns it on. An event is the browser telling the page that something happened. The z-index tab says more. On pointerdown, the event for a mouse button, a pen or a finger pressing down, the grip sets a flag, and the card renders draggable for that gesture only.',
      'Then the browser fires dragstart, the event for a drag beginning, and its handler sets effectAllowed to move: this drag moves the card, it does not copy or link it.'
    ]));
  });

  test('should say the card’s look in a paragraph of its own after the dragstart run, saying what an li and a shared class are', async () => {
    const story = await recipeFolds.press(await nativeRecipe(), 'The user can arrange the list by hand');
    const arm = recipeFolds.steps(story)[0];
    const paragraphs = explanation.paragraphsIn(arm).map(told => told.replace(/\s+/g, ' '));

    expect(paragraphs.findIndex(told => told.startsWith('The li, the list item that is the card'))).toBe(paragraphs.findIndex(told => told.startsWith('Then the browser fires dragstart')) + 1);
    expect(paragraphs).toContain('The li, the list item that is the card, also wears four shared classes, looks that live in the site’s shared sheet and that an element wears by name: soft-cornered, field, hairline-outline and handle-raised. They are the card’s look, not its drag.');
  });

  test('should leave the quarter out of the lazy pace, where nothing moves until the release', async () => {
    const recipe = await nativeRecipe();
    await recipeFolds.press(recipe, 'The user can arrange the list by hand');
    await dragSortTab.chooseIn(recipe, 'Lazy');
    const story = recipeFolds.story(recipe, 'The user can arrange the list by hand');

    expect(recipeFolds.stepTitles(story)).toEqual([
      'Arm the drag from its grip',
      'Keep which item is held in state, not in the drag’s payload',
      'Accept the drop, or the platform takes it back',
      'Stash the landing, settle after the drag',
      'Fade the lifted card almost away',
      'Glide the settle one tick after the release',
      'What drag and drop cannot give you'
    ]);
    expect(explanation.drawnIn(story, /^Where a swap counts\./)).not.toBeInTheDocument();
    expect(story).toHaveTextContent('Nothing moves until the release.');
  });

  test.each([
    ['an attribute and an event', 'draggable is an attribute, a setting written on the element, and the grip turns it on. An event is the browser telling the page that something happened. The z-index tab says more. On pointerdown, the event for a mouse button, a pen or a finger pressing down,'],
    ['dragstart', 'dragstart, the event for a drag beginning, and its handler sets effectAllowed to move: this drag moves the card, it does not copy or link it'],
    ['dataTransfer and dragover', 'dataTransfer is the object a drag event carries its data in, the payload. It exists to carry data between windows, and mid-drag it is locked: a handler for dragover, the event the browser fires again and again on whatever the pointer is over,'],
    ['what the browser keeps drawing', 'You cannot change how the browser draws its drag image, its cursor or its cancel.'],
    ['state', 'Keep it in state instead, the values React holds between one drawing of the page and the next. The z-index tab says what state is. The lift records which item is held, which the code calls aloft;'],
    ['preventDefault', 'One call accepts the drop: the dragover handler calls preventDefault, the method that tells the browser not to do what it would by default. The default is to refuse the drop, so preventing it accepts the drop, and nothing else stops the cancel.'],
    ['dropEffect and effectAllowed', 'The item’s dragover handler also sets dropEffect, a property of dataTransfer. It is optional and only picks the cursor, and its value has to be one of the effects effectAllowed permits, which dragstart sets to say what effects a drag allows, here move.'],
    ['drop', 'The drop handler, for the event of a release over a target, calls preventDefault too. The browser’s default for a dropped link, file or address is to open it as a page; this list drags none of those, so the call changes nothing today and keeps the list safe the day a payload is added.'],
    ['a bounding box', 'the neighbor’s bounding box, the rectangle the browser reports for an element’s place and size, is the space to cross.'],
    ['where a crossing counts', 'counts only once the pointer is past the neighbor’s outer quarter.'],
    ['the drag image', 'Mark a card draggable and the browser does the rest. It draws the drag image, a picture of the card that follows the pointer; it sets the cursor;'],
    ['the cancel', 'and it plays the cancel, the animation that carries the card back when no target accepts the drop.'],
    ['a view transition and its capture', 'A view transition, the browser’s way of animating a page from one state to the next by taking a picture of both, cannot run during the drag: its capture, that picture,']
  ])('should say what %s is where the reader meets it', async (_term, sentence) => {
    expect(await nativeRecipe()).toHaveTextContent(sentence);
  });

  test.each([
    'pace=eager&origin=keep&motion=animated', 'pace=eager&origin=keep&motion=static',
    'pace=eager&origin=hide&motion=animated', 'pace=eager&origin=hide&motion=static',
    'pace=lazy&origin=keep&motion=animated', 'pace=lazy&origin=keep&motion=static',
    'pace=lazy&origin=hide&motion=animated', 'pace=lazy&origin=hide&motion=static'
  ])('should show the item’s dragover setting dropEffect beside the run that names it, with %s', async choices => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', `?${choices}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await dragSortTab.recipe();

    expect(explanation.everyCodeBeside(recipe, /The item’s dragover handler also sets/).join()).toMatch(/onDragOver=\{event => \{[^]*event\.dataTransfer\.dropEffect = 'move';/);
  });

  test('should say what the list’s dragleave handler does where the lazy pace meets it, with the handler beside it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', '?pace=lazy')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const recipe = await dragSortTab.recipe();
    expect(recipe).toHaveTextContent('and the list’s dragleave handler, which runs when the pointer leaves an item or the list, clears it.');
    expect(explanation.everyCodeBeside(recipe, /^Each dragover stores/).join()).toMatch(/onDragLeave=\{\(\) => setLanding\(nothing\(\)\)}/);
  });

  test('should say what a tick is where the lazy glide meets it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', '?pace=lazy')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await dragSortTab.recipe()).toHaveTextContent('run the settle a tick after the release, a setTimeout with no delay, which runs once the drag has ended.');
  });

  test('should say what a view transition is where the lazy glide meets it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', '?pace=lazy')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await dragSortTab.recipe()).toHaveTextContent('which suits a view transition. A view transition is the browser’s way of animating a page from one state to the next by taking a picture of both; its capture, that picture, swallows the drag’s events if it is taken while the drag is still running,');
  });

  test('should drop the tables tab’s survey and inner half', async () => {
    expect(await nativeRecipe()).not.toHaveTextContent(/survey|inner half/);
  });

  test('should draw where a swap counts', async () => {
    expect(explanation.drawingNamed(await nativeRecipe(), /^Where a swap counts\./)).toBeInTheDocument();
  });

  test('should name MDN as Mozilla’s web reference', async () => {
    await nativeRecipe();

    expect(demoPage.words(/The links go to MDN, Mozilla’s web reference, if you want more\./)).toBeInTheDocument();
  });
});

describe('the drag sort tab’s own words', () => {
  test.each([
    'Once the need is heard and the design has answered shape, I split the work into stories. Each is a user story, a discrete piece of value from the user’s side of the screen, and a promise of a conversation rather than a specification. The whole of it reads as one:',
    'I cut it into two thin stories, the same reorder each time. One moves the order by pointer, on the platform’s own drag and drop. The other moves the order directly, from the keyboard. Both are cards in the last station, and each opens into its build.',
    'The grip is a real button, so focus reaches it with no extra code. Its keydown handler turns a left or right arrow into a move of one place and reports the new order up to the list, with no drag involved. While the item is still sliding, the handler ignores the keys.'
  ])('should say, whatever the dials, words and links together: %s', async sentence => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await demoTabs.arrivedOn('Drag sort')).toHaveTextContent(sentence);
  });

  test.each([
    ['origin=hide', 'One card rides the pointer, so you see one card, not two.'],
    ['pace=eager', 'You want the order to move as you drag; waiting for the drop hides the result until it is too late to change your mind.'],
    ['pace=eager', 'The state updates during the drag, the markup renders from it, and React moves the li with the same key to its new place while the browser still shows the drag image under the pointer.'],
    ['pace=lazy', 'You want the list to hold still while the platform drags. The drop lands while the'],
    ['pace=lazy', 'is still alive, so the reorder has to wait for the session to end.'],
    ['pace=lazy', 'Each dragover stores the'],
    ['pace=lazy', 'The commit runs from dragend, the event that ends the session, because the browser is still playing the end of its own drag until then.'],
    ['pace=lazy&origin=keep', 'Do nothing. This is the keep list, so its Item is the plain card. The browser already drew the drag image, so for the length of the drag there are two of the card, one in place and one dimmed under the pointer. KeepItem has no hiding code.'],
    ['pace=lazy&origin=keep&motion=static', 'This is the static list, and it has no motion code. The handler sets the order and React draws it on the next frame; a keyboard move sets the order the same way.']
  ])('should say, with %s, words and links together: %s', async (choices, sentence) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', `?${choices}`)} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await demoTabs.arrivedOn('Drag sort')).toHaveTextContent(sentence);
  });
});

describe('the names the code uses', () => {
  test.each([
    {name: 'pushed', choices: '', run: /^The swap happens at once/},
    {name: 'effectAllowed', choices: '', run: /^Then the browser fires/},
    {name: 'KeepItem', choices: 'pace=lazy&origin=keep', run: /^Do nothing\. This is the keep list/},
    {name: 'Item', choices: 'pace=lazy&origin=keep', run: /^Do nothing\. This is the keep list/},
    {name: 'draggable', choices: '', run: /is an attribute, a setting written on the element/},
    {name: 'soft-cornered', choices: '', run: /^The li, the list item that is the card/},
    {name: 'field', choices: '', run: /^The li, the list item that is the card/},
    {name: 'hairline-outline', choices: '', run: /^The li, the list item that is the card/},
    {name: 'handle-raised', choices: '', run: /^The li, the list item that is the card/},
    {name: '--toward', choices: '', run: /^The direction is data/},
    {name: 'var()', choices: '', run: /^The direction is data/}
  ])('should set $name as code where its run names it', async ({name, choices, run}) => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', `?${choices}`)} feed={feed}/>);
    await feedIsSubscribed(feed);

    const told = explanation.saying(await demoTabs.arrivedOn('Drag sort'), run);

    expect(explanation.codeShown(told)).toContain(name);
  });
});

describe('the drag sort tab’s introduction', () => {
  const paragraphs = [
    'A sortable list is a list the reader reorders by picking an item up and putting it down somewhere else.',
    'This tab assumes the details element, a class and a dial from the accordions tab, and React, its state and an event, which the z-index tab explains. The rest is new here.',
    'The browser has shipped its own drag and drop for twenty years, and most of us have reached for a library anyway, because the native drag looked wrong, dropped in the wrong place, or could not be done with a keyboard.',
    'The order belongs to the user, and the list is the element built for it. So I use the browser’s own drag, and write script only for what the platform does not yet do: making room as you hover, or holding still until the drop; showing the item where it came from, or hiding it; sliding the neighbors, or not.',
    'Each of those is a dial, a control that sets how a build behaves, in the last part of the tutorial below, and the exhibit above the dials changes to match. The accordions tab says what a dial is.',
    'By the end you can build a sortable list on the browser’s own drag and drop, choose each of those three behaviors and say what it costs, and give a keyboard user the same list, since the keyboard has the same moves as the pointer. The exhibit below is three items; drag one by its grip, or focus the grip and use the left and right arrows.'
  ];

  test('should tell, after what it assumes from earlier tabs, what the list is, the bug, the page’s view and what a reader can do after, before the exhibit', async () => {
    render(<TestApp at={demosAt('drag-and-drop')}/>);

    const tab = await demoTabs.arrivedOn('Drag sort');

    expect(outOfReadingOrder([...paragraphs.map(paragraphReading), demoTabs.gripIn(tab, 'A')])).toEqual([]);
  });

  test('should say what it assumes from earlier tabs, linking each tab it names', async () => {
    render(<TestApp at={demosAt('drag-and-drop')}/>);

    expect(await demoTabs.assumedLinks('Drag sort')).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`]
    ]);
  });
});

describe('the drag sort tab’s audited words', () => {
  const tabAt = async (choices: string): Promise<void> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', `?${choices}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
  };

  test('should caption the sketch with why the grip’s arrows are left and right', async () => {
    await tabAt('');

    expect(await demoPage.findWords(/^The design answers shape/)).toHaveTextContent('The exhibit lays the list across the page, so the grip’s arrows are left and right.');
  });

  test('should read the clue for a direct pick-up as working by pointer or by key, on the drag the platform ships', async () => {
    await tabAt('');

    expect(await demoPage.findWords(/^Direct manipulation/)).toHaveTextContent('Direct manipulation, by pointer or by key. The platform ships the drag.');
  });

  test.each([
    ['motion=animated', 'When one item passes another, the crossed item slides to its new place; a lazy list’s reorder on release glides once the drag has ended.'],
    ['motion=static', 'Reorders apply in a single frame; items cut to their new places.']
  ])('should read the motion dial, with %s, in plain words', async (choice, reading) => {
    await tabAt(choice);

    expect(await demoPage.findWords(reading)).toBeInTheDocument();
  });

  test.each([
    ['pace=eager&motion=animated', 'The order changes as you drag, so the item’s old place stays reachable until you let go.', 'And the crossed card slides into place, so you can follow the swap instead of seeing a jump.'],
    ['pace=lazy&motion=animated', 'The order does not change until you drop, so only the destination matters.', 'And the whole reorder on release glides once, so you see each card travel to its new place.'],
    ['pace=lazy&motion=static', 'The order does not change until you drop, so only the destination matters.', 'And the reorder on release lands instantly, so nothing competes with the browser’s drag.'],
    ['pace=eager&motion=static', 'The order changes as you drag, so the item’s old place stays reachable until you let go.', 'And the reorder lands instantly, so nothing competes with the browser’s drag.']
  ])('should promise, with %s, what the order does', async (choices, pace, motion) => {
    await tabAt(choices);
    const recipe = await dragSortTab.recipe();

    expect(recipe).toHaveTextContent(pace);
    expect(recipe).toHaveTextContent(motion);
  });

  test('should say, once, that drag and drop has no keyboard events, and that a keyboard user needs the same reorders', async () => {
    const recipe = await nativeRecipe();

    expect(explanation.everySaying(recipe, /Drag and drop has no keyboard events/)).toHaveLength(1);
    expect(recipe).toHaveTextContent('Drag and drop has no keyboard events, and it does not matter: dragging was never the goal, the order changing is.');
    expect(recipe).toHaveTextContent('A keyboard user needs the same reorders, and drag and drop cannot give them.');
  });

  test('should teach the keyframe animation at the slide, then say what --toward is', async () => {
    const recipe = await nativeRecipe();

    const sliding = explanation.runTelling(recipe, /^The swap happens at once/);

    expect(explanation.paragraphsIn(sliding).slice(1)).toEqual([
      'The swap happens at once. The crossed item gets the class pushed. Its slide is a keyframe animation, one whose start is written in an @keyframes rule. Its from, the keyframe’s starting state, is one place over. So the browser draws the item where it used to be and slides it to its new place.',
      'The direction is data: --toward, a custom property, a value given a name once and read back with var(), flips the sign of one keyframe instead of naming two.'
    ]);
  });

  test('should say, beside the fade step’s CSS, why the card fades and is not hidden', async () => {
    const recipe = await nativeRecipe();

    expect(explanation.everyCodeBeside(recipe, /^So the card does not disappear/).join()).toMatch(/\/\* opacity, not visibility: a card hidden by visibility is out of view, and so is the drag’s source \*\//);
  });

  test('should say, beside crossingOver, that the handler ignores crossings over a sliding item', async () => {
    const recipe = await nativeRecipe();

    expect(explanation.runTelling(recipe, /^Commit the reorder inside the dragover/)).toHaveTextContent('While an item is still sliding, the handler ignores crossings over it.');
    expect(explanation.everyCodeBeside(recipe, /^Commit the reorder inside the dragover/).join()).toMatch(/export const crossingOver/);
  });

});

describe('the links to other tabs', () => {
  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={demosAt('drag-and-drop')}/>);

    const tab = await demoTabs.arrivedOn('Drag sort');

    expect(demoPage.linksToTabsIn(tab)).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['dials', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['Tables demo', `${Paths.demos}tables/`]
    ]);
  });
});
