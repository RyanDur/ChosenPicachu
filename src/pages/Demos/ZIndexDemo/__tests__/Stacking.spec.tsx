import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {stackingPile} from '@pages/Demos/ZIndexDemo/__test_support';

describe('the stacking pile', () => {
  test('should open with no card raised', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const raised = await stackingPile.findCardRaised();

    expect(stackingPile.card(raised, 'None')).toBeChecked();
  });

  test('should check the card chosen, and write it into the address', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const raised = await stackingPile.findCardRaised();

    await stackingPile.raise(raised, 'Second');

    expect(stackingPile.card(raised, 'Second')).toBeChecked();
    expect(demoPage.urlSearch()).toHaveTextContent('raised=second');
  });

  test('should open with the card the address names raised', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=third')}/>);

    const raised = await stackingPile.findCardRaised();

    expect(stackingPile.card(raised, 'Third')).toBeChecked();
  });
});
