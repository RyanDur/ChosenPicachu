import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage} from '@pages/Demos/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {FlowTableRecipe} from '../FlowTableRecipe';
import {StillTableRecipe} from '../StillTableRecipe';

describe('the still and living table recipes', () => {
  test('should hold their stories in the still table and the living table', async () => {
    render(<TestApp at="/"><StillTableRecipe/><FlowTableRecipe/></TestApp>);

    const still = demoPage.part('the still table');
    expect(still).toBeVisible();
    expect(recipeFolds.story(still, 'The trader can read the market in a table')).toBeInTheDocument();
    const living = demoPage.part('the living table');
    expect(living).toBeVisible();
    expect(recipeFolds.story(living, 'The trader can watch the market live, one lookback beside another')).toBeInTheDocument();
    expect(recipeFolds.story(living, 'The page is a store, and so is the table')).toBeInTheDocument();
  });

  test('the tutorial stands unchanged in the html world', async () => {
    render(<TestApp at="/?world=vanilla"><FlowTableRecipe/></TestApp>);

    expect(await demoPage.findTitle('The trader can watch the market live, one lookback beside another')).toBeInTheDocument();
  });
});
