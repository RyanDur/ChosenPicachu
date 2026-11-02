import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {theTrap, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

describe('the menu built the new way', () => {
  test('should sit in card one, beside Sort by', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const trap = await theTrap.find();

    const cardOne = theTrap.cardOne(trap);

    expect(theTrap.controlIn(cardOne, 'Sort by, in the top layer')).toBeInTheDocument();
  });
});

describe('why the popover wins', () => {
  test('should link to Why 9999 still loses', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part('Why the popover wins');

    expect(explanation.linkNamed(part, 'Why 9999 still loses')).toHaveAttribute('href', zIndexTab.fragmentOf('Why 9999 still loses'));
  });

  test('should link the run on the menu’s placement to card one’s list in What else forms a stacking context', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part('Why the popover wins');
    const run = explanation.saying(part, /The menu’s own style sheet places it/);

    expect(explanation.linkNamed(run, 'What else forms a stacking context')).toHaveAttribute('href', zIndexTab.fragmentOf('What else forms a stacking context'));
  });
});
