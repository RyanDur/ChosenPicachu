import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
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

  test('should lead from each tutorial the features name to its page', async () => {
    render(<TestApp at="/"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    expect(tablesTab().featureLinks()).toEqual([
      ['Drag sort', demosAt('tables/sort')],
      ['Sort menu', demosAt('tables/menu')],
      ['Drag resize', demosAt('tables/resize')]
    ]);
  });

  test('should take the keyboard to the features when the address names them', async () => {
    render(<TestApp at="/#features-asked-for"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    await waitFor(() => expect(tablesTab().features()).toHaveFocus());
  });
});
