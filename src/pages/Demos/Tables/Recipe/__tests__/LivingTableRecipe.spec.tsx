import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {FlowTableRecipe} from '../FlowTableRecipe';

describe('the living table recipe', () => {
  test('should hold its stories in the living table', async () => {
    render(<TestApp at="/"><FlowTableRecipe/></TestApp>);

    const living = demoPage.part('the living table');
    expect(living).toBeVisible();
    expect(recipeFolds.story(living, 'The trader can watch the market live, one lookback beside another')).toBeInTheDocument();
    expect(recipeFolds.story(living, 'The page is a store, and so is the table')).toBeInTheDocument();
  });

  test('should link the charts tab where the stream of trades comes back', async () => {
    render(<TestApp at="/"><FlowTableRecipe/></TestApp>);
    await demoPage.findTitle('The trader can watch the market live, one lookback beside another');

    expect(demoPage.linksToTabsIn(demoPage.part('the living table'))).toEqual([['charts tab', demosAt('charts')]]);
  });

  test('the tutorial stands unchanged in the html world', async () => {
    render(<TestApp at="/?world=vanilla"><FlowTableRecipe/></TestApp>);

    expect(await demoPage.findTitle('The trader can watch the market live, one lookback beside another')).toBeInTheDocument();
  });
});
