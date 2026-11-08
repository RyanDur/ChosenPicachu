import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@frame/navigation';
import {itemHeadedBy} from '@__test_support/headed-item';
import {demoPage, demosAt, demoTabs, feedIsSubscribed} from '@pages/Demos/__test_support';
import {render, waitFor, within} from '@testing-library/react';
import {listeningFeed} from '@pages/Demos/__test_support/feed';
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

  test('should read the motion dial, animated, in plain words', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', '?motion=animated')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await sortableList.arrived();

    expect(listControls.reading('motion')).toHaveTextContent('When one item passes another, the crossed item slides to its new place; a lazy list’s reorder on release glides once the drag has ended.');
  });

  test('should read the motion dial, static, in plain words', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('drag-and-drop', '?motion=static')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await sortableList.arrived();

    expect(listControls.reading('motion')).toHaveTextContent('Reorders apply in a single frame; items cut to their new places.');
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
    expect(demoPage.says('<EagerHideAnimatedList/>')).toBeVisible();
  });

  test('the dials travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop', '?pace=lazy&origin=keep&motion=static')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    expect(listControls.option('Lazy')).toBeChecked();
    expect(listControls.option('Keep')).toBeChecked();
    expect(listControls.option('Static')).toBeChecked();
    expect(demoPage.says('<LazyKeepStaticList/>')).toBeVisible();
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

  test('an arrow walk says the move', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('drag-and-drop')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await sortableList.arrived();
    await sortableList.moveByKey('A', '{ArrowRight}');

    expect(sortableList.moveReport()).toHaveTextContent('A moved to 2 of 3');
  });

  test('should open the recipe with both stories listed', async () => {
    const recipe = await nativeRecipe();

    expect(recipe).toBeVisible();
    expect(demoPage.title('let’s build this feature')).toBeVisible();
    expect(recipeFolds.story(recipe, 'The user can arrange the list by hand')).toBeInTheDocument();
    expect(recipeFolds.story(recipe, 'The user can arrange the list from the keyboard')).toBeInTheDocument();
  });

  test('the recipe’s clues name their rows and columns', async () => {
    await nativeRecipe();

    const clues = dragSortTab.cluesIn(demoPage.part('Start with the need, and let it pick the element'));
    expect(clues.columns).toHaveLength(2);
    expect(clues.rows).toHaveLength(4);
  });

  test('should head the stations from need to design to layers, linking the user story and dataTransfer', async () => {
    const recipe = await nativeRecipe();

    expect(demoPage.title('Start with the need, and let it pick the element')).toBeVisible();
    expect(demoPage.row(/pick it up and put it there/)).toBeVisible();
    expect(demoPage.title('Sketch a design from the need')).toBeVisible();
    expect(demoPage.unanswered('what a design cannot tell you')).toBeVisible();
    expect(demoPage.title('The user can keep the list in the order they mean')).toBeVisible();
    expect(demoPage.signpost('user story'))
      .toHaveAttribute('href', expect.stringContaining('initialcapacity.io/insights/user-story'));
    expect(demoPage.title('Layer on functionality, in the order it was asked for')).toBeVisible();
    expect(explanation.linkNamed(recipe, 'dataTransfer'))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/DataTransfer'));
  });

  test('the slices point at their station', async () => {
    await nativeRecipe();

    expect(demoPage.title('Slice the design into stories')).toBeVisible();
    expect(demoPage.sliceLinks())
      .toEqual(['#station-4', '#station-4']);
    expect(demoPage.sliceLinksLandingNowhere()).toEqual([]);
  });

  test('opening the by-hand story points at the tables demo', async () => {
    const recipe = await nativeRecipe();

    await dragSortTab.press(recipe, /The user can arrange the list by hand/);

    expect(recipeFolds.story(recipe, 'The user can arrange the list by hand')).toHaveAttribute('open');
    const steps = recipeFolds.steps(recipeFolds.story(recipe, 'The user can arrange the list by hand'));
    expect(explanation.linkNamed(steps[steps.length - 1], /Tables demo/))
      .toHaveAttribute('href', '/demos/tables/');
  });

  const byHandStoryDialledLazyKeep = async (): Promise<HTMLElement> => {
    const recipe = await nativeRecipe();
    await dragSortTab.press(recipe, /The user can arrange the list by hand/);
    await dragSortTab.chooseIn(recipe, 'Lazy');
    await dragSortTab.chooseIn(recipe, 'Keep');
    return recipe;
  };

  test('the recipe teaches whatever the dials are set to', async () => {
    const recipe = await byHandStoryDialledLazyKeep();

    expect(recipeFolds.stepTitled(recipe, 'Stash the landing, settle after the drag')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Leave the lifted card where it was')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Slide every moved item home on release')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Commit inside the crossing')).not.toBeInTheDocument();
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

    await demoPage.findTitle('Layer on functionality, in the order it was asked for');

    await waitFor(() => expect(itemHeadedBy('the stations', 'Layer on functionality, in the order it was asked for')).toHaveFocus());
  });
});

describe('the native drag sort tutorial’s steps', () => {
  test('should head the by-hand story’s steps in order', async () => {
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

  test('should leave the quarter out of the lazy pace’s step headings', async () => {
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
      'Slide every moved item home on release',
      'What drag and drop cannot give you'
    ]);
  });
});

describe('the drag sort tab’s introduction', () => {
  test('should say what it assumes from earlier tabs, linking each tab it names', async () => {
    render(<TestApp at={demosAt('drag-and-drop')}/>);

    expect(await demoTabs.assumedLinks('Drag sort')).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`]
    ]);
  });
});

describe('the links to other tabs', () => {
  test('should link the custom property in the slide step to the accordions tab', async () => {
    const story = await recipeFolds.press(await nativeRecipe(), 'The user can arrange the list by hand');

    const slideStep = recipeFolds.stepHeaded(story, 'Slide the crossed item into place');

    expect(within(slideStep).getByRole('link', {name: 'accordions tab'})).toHaveAttribute('href', `${Paths.demos}accordions/`);
  });

  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={demosAt('drag-and-drop')}/>);

    const tab = await demoTabs.arrivedOn('Drag sort');

    expect(demoPage.linksToTabsIn(tab)).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['dials', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['Tables demo', `${Paths.demos}tables/`]
    ]);
  });
});
