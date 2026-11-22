import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {theTrap} from '@pages/Demos/ZIndexDemo/__test_support';

describe('the menu built the new way', () => {
  test('should sit in card one, beside Sort by', async () => {
    render(<TestApp at={demosAt('z-index/why-the-popover-wins')}/>);
    const trap = await theTrap.find();

    const cardOne = theTrap.cardOne(trap);

    expect(theTrap.controlIn(cardOne, 'Sort by, in the top layer')).toBeInTheDocument();
  });
});

describe('why the popover wins', () => {
  test('should link the run on the menu’s placement to card one’s list in What else forms a stacking context', async () => {
    render(<TestApp at={demosAt('z-index/why-the-popover-wins')}/>);

    const part = await explanation.part('Why the popover wins');
    const run = explanation.saying(part, /The menu’s own style sheet places it/);

    expect(explanation.linkNamed(run, 'What else forms a stacking context')).toHaveAttribute('href', demosAt('z-index/what-else-forms-a-stacking-context'));
  });
});

describe('why the popover wins, on a term part one defines', () => {
  test('should link rule, at its first use, to part one’s page with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index/why-the-popover-wins', '?raised=second')}/>);

    const popover = await explanation.part('Why the popover wins');

    expect(explanation.linkNamed(popover, 'rule')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });
});
