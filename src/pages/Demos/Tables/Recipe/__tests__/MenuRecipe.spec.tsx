import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage} from '@pages/Demos/__test_support';
import {tablesTab} from '@pages/Demos/Tables/__test_support';
import {MenuRecipe} from '../MenuRecipe';

describe('the sort menu recipe', () => {
  test('the menu story stands in the html world', async () => {
    render(<TestApp at="/?world=vanilla"><MenuRecipe/></TestApp>);

    expect(await demoPage.findTitle('The trader can sort the windows by any measure, or take the order back')).toBeInTheDocument();
  });

  test('should link position-area to MDN', async () => {
    render(<TestApp at="/"><MenuRecipe/></TestApp>);

    expect((await tablesTab.linksIn('sort menu', 'position-area'))[0]).toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/CSS/position-area'));
  });
});
