import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {stackingPile} from '@pages/Demos/ZIndexDemo/__test_support';

const partOne = 'z-index/why-third-is-on-top';

describe('part one’s stacking pile', () => {
  test('should be heard by its name alone, its kind written for the eye', async () => {
    render(<TestApp at={demosAt(partOne)}/>);

    const pile = await demoPage.findExhibit('The pile');

    expect(demoPage.kindHeardIn(pile, 'Exhibit')).toBe(false);
  });

  test('should open with no card raised', async () => {
    render(<TestApp at={demosAt(partOne)}/>);

    const raised = await stackingPile.findCardRaised();

    expect(stackingPile.card(raised, 'None')).toBeChecked();
  });

  test('should check the card chosen, and write it into the address', async () => {
    render(<TestApp at={demosAt(partOne)}/>);
    const raised = await stackingPile.findCardRaised();

    await stackingPile.raise(raised, 'Second');

    expect(stackingPile.card(raised, 'Second')).toBeChecked();
    expect(demoPage.urlSearch()).toHaveTextContent('raised=second');
  });

  test('should open with the card the address names raised', async () => {
    render(<TestApp at={demosAt(partOne, '?raised=third')}/>);

    const raised = await stackingPile.findCardRaised();

    expect(stackingPile.card(raised, 'Third')).toBeChecked();
  });
});
