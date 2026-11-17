import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {tablesTab} from '@pages/Demos/Tables/__test_support';
import {MenuRecipe} from '../MenuRecipe';

describe('the sort menu recipe', () => {
  test('the menu story stands in the html world', async () => {
    render(<TestApp at="/?world=vanilla"><MenuRecipe/></TestApp>);

    expect(await demoPage.findTitle('The trader can sort the lookbacks by any measure, or take the order back')).toBeInTheDocument();
  });

  test('should link the z-index tab where the popover comes back, and again where a component does', async () => {
    render(<TestApp at="/"><MenuRecipe/></TestApp>);

    expect(demoPage.linksToTabsIn(await tablesTab().recipe('sort menu'))).toEqual([
      ['z-index tab', demosAt('z-index')],
      ['z-index tab', demosAt('z-index')]
    ]);
  });

  test('should link position-area to MDN', async () => {
    render(<TestApp at="/"><MenuRecipe/></TestApp>);

    expect((await tablesTab().linksIn('sort menu', 'position-area'))[0]).toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/CSS/position-area'));
  });
});
