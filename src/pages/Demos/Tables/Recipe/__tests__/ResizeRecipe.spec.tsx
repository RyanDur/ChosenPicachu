import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage} from '@pages/Demos/__test_support';
import {tablesTab} from '@pages/Demos/Tables/__test_support';
import {ResizeRecipe} from '../ResizeRecipe';

describe('the drag resize recipe', () => {
  test('should link the resize step’s :has() to MDN', async () => {
    render(<TestApp at="/"><ResizeRecipe/></TestApp>);

    expect(await tablesTab.linkIn('drag resize', ':has()')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has');
  });

  test('the resize story stands in the html world', async () => {
    render(<TestApp at="/?world=vanilla"><ResizeRecipe/></TestApp>);

    expect(await demoPage.findTitle('The trader can widen a column')).toBeInTheDocument();
  });
});
