import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage} from '@pages/Demos/__test_support';
import {tablesTab} from '@pages/Demos/Tables/__test_support';
import {Tutorials} from '../Tutorials';

describe('the table tutorials', () => {
  test('the recipe’s tables name their rows and columns', async () => {
    render(<TestApp at="/"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    const features = tablesTab().table('the features');
    expect(features.columns).toHaveLength(4);
    expect(features.rows).toHaveLength(4);
  });

  test('should head the features with both their axes', async () => {
    render(<TestApp at="/"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    expect(tablesTab().columnHeader('by keyboard')).toBeVisible();
    expect(demoPage.row('Widen a column')).toBeVisible();
  });

});
