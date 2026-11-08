import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage} from '@pages/Demos/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {tableControls, tablesTab} from '@pages/Demos/Tables/__test_support';
import {Recipe} from '../Recipe';
import {FlowTableRecipe} from '../FlowTableRecipe';
import {TableControls} from '../../TableControls';

describe('the drag sort recipe', () => {
  test('should open the recipe with its stories closed', async () => {
    render(<TestApp at="/"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');

    expect(recipe).toBeVisible();
    expect(recipeFolds.story(recipe, 'The trader can sort by column')).not.toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).not.toHaveAttribute('open');
  });

  test('opening the sort by column story shows the drag build with its steps closed', async () => {
    render(<TestApp at="/"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');

    await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(recipeFolds.story(recipe, 'The trader can sort by column')).toHaveAttribute('open');
    expect(recipeFolds.reveals(recipe).length).toBeGreaterThan(0);
    expect(recipeFolds.opened(recipeFolds.reveals(recipe))).toHaveLength(0);
  });

  test('the drag build in plain HTML links its implementation to its file on GitHub', async () => {
    render(<TestApp at="/?world=vanilla"><Recipe/></TestApp>);
    await tablesTab().recipe('drag sort');

    expect((await tablesTab().linksIn('drag sort', 'the implementation'))[0]).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/blob/main/src/pages/Demos/Tables/Frame/builds/Eager.ts');
  });

  test('should link the drag build out to the drag sort list demo, its implementation and insertBefore', async () => {
    render(<TestApp at="/"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');

    await recipeFolds.press(recipe, 'The trader can sort by column');

    expect((await tablesTab().linksIn('drag sort', /Drag sort list demo/))[0]).toHaveAttribute('href', '/demos/drag-and-drop/');
    expect((await tablesTab().linksIn('drag sort', 'the implementation'))[0]).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/tree/main/src/pages/Demos/Tables/Builds/EagerTable');
    expect((await tablesTab().linksIn('drag sort', 'insertBefore'))[0]).toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore'));
  });

  test('the recipe teaches whatever the dials are set to', async () => {
    render(<TestApp at="/"><Recipe/><TableControls/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');
    await recipeFolds.press(recipe, 'The trader can sort by column');
    await recipeFolds.press(recipe, 'The trader can sort by row');

    await tablesTab().chooseInRecipe('drag sort', 'Lazy', 'Keep', 'Static');

    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');
    expect(recipeFolds.stepTitled(recipe, 'Hold still, dispatch on release')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Keep the origin in place and let only the order move')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Leave the motion out')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Commit inside the move')).not.toBeInTheDocument();
    expect(await tableControls.chosenDials()).toEqual(['Lazy', 'Keep', 'Static']);
  });

  test('with no dials in the address, the recipe teaches the build the table controls read out', async () => {
    render(<TestApp at="/"><Recipe/><TableControls/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');

    await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(recipeFolds.stepTitled(recipe, 'Commit inside the move')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Carry the real thing')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Let the column settle')).toBeInTheDocument();
    expect(await tableControls.readout('<EagerTable className="hide animated"/>')).toBeVisible();
  });

  test('the keyboard track teaches the same sort with the arrow keys', async () => {
    render(<TestApp at="/"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');
    await tablesTab().chooseInRecipe('drag sort', 'By keyboard');

    expect(recipeFolds.stepTitled(recipe, 'Give focus a place to land')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'The arrows give the direction')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Both parties slide')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Hold the pointer from the lift')).not.toBeInTheDocument();
    await recipeFolds.press(recipe, 'The trader can sort by column');
    expect(recipeFolds.stepTitled(recipe, 'Turn the arrows vertical')).toBeInTheDocument();
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toBeInTheDocument();
    expect(await tablesTab().radioIn('drag sort', 'Lazy')).not.toBeInTheDocument();
  });

  test('the keyboard track answers the motion dial', async () => {
    render(<TestApp at="/?track=keyboard"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');
    expect(recipeFolds.stepTitled(recipe, 'Both parties slide')).toBeInTheDocument();

    await tablesTab().chooseInRecipe('drag sort', 'Static');

    expect(recipeFolds.stepTitled(recipe, 'Cut on the keypress')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Both parties slide')).not.toBeInTheDocument();
  });

  test('switching back to the pointer track restores its road', async () => {
    render(<TestApp at="/?track=keyboard"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');

    await tablesTab().chooseInRecipe('drag sort', 'By pointer');

    expect(recipeFolds.stepTitled(recipe, 'Hold the pointer from the lift')).toBeInTheDocument();
  });

  test('the chosen track travels in the url', async () => {
    render(<TestApp at="/?track=keyboard"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');
    expect(recipeFolds.stepTitled(recipe, 'The arrows give the direction')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Hold the pointer from the lift')).not.toBeInTheDocument();
  });

  test('the open cards travel in the url', async () => {
    render(<TestApp at="/?sort=column"><Recipe/><FlowTableRecipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');
    expect(recipeFolds.story(recipe, 'The trader can sort by column')).toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).not.toHaveAttribute('open');
    const living = demoPage.part('the living table');
    expect(recipeFolds.story(living, 'The trader can watch the market live, one lookback beside another')).not.toHaveAttribute('open');
    expect(recipeFolds.story(living, 'The page is a store, and so is the table')).not.toHaveAttribute('open');
  });

  test('a story folds shut without folding the story beside it', async () => {
    render(<TestApp at="/?sort=column,row"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');

    const column = await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(column).not.toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');
    expect(demoPage.urlSearch()).toHaveTextContent('sort=row');
  });

  test('the address holds every story the trader opens', async () => {
    render(<TestApp at="/"><Recipe/></TestApp>);
    const recipe = await tablesTab().recipe('drag sort');

    const column = await recipeFolds.press(recipe, 'The trader can sort by column');
    const row = await recipeFolds.press(recipe, 'The trader can sort by row');

    expect(column).toHaveAttribute('open');
    expect(row).toHaveAttribute('open');
    expect(demoPage.urlSearch()).toHaveTextContent('sort=column%2Crow');
  });

  test('the sort tutorial stands on both tracks in the react world', async () => {
    render(<TestApp at="/?world=react"><Recipe/></TestApp>);

    expect(recipeFolds.story(await tablesTab().recipe('drag sort'), 'The trader can sort by column')).toBeInTheDocument();
    await tablesTab().pick('By keyboard');
    expect(await demoPage.findTitle('Give focus a place to land')).toBeInTheDocument();
  });

  test('the sort tutorial stands on both tracks in the vanilla world', async () => {
    render(<TestApp at="/?world=vanilla"><Recipe/></TestApp>);

    expect(recipeFolds.story(await tablesTab().recipe('drag sort'), 'The trader can sort by column')).toBeInTheDocument();
    await tablesTab().pick('By keyboard');
    expect(await demoPage.findTitle('Give focus a place to land')).toBeInTheDocument();
  });
});
