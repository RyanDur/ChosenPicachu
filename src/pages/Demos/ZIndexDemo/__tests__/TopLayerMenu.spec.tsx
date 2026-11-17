import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {theTrap, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

describe('the menu built the new way', () => {
  test('should sit in card one, beside Sort by', async () => {
    render(<TestApp at={demosAt('z-index/why-9999-still-loses')}/>);
    const trap = await theTrap.find();

    const cardOne = theTrap.cardOne(trap);

    expect(theTrap.controlIn(cardOne, 'Sort by, in the top layer')).toBeInTheDocument();
  });
});

describe('why the popover wins', () => {
  test('should link Why 9999 still loses to its page, where its menus are, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const part = await explanation.part('Why the popover wins');
    const run = explanation.saying(part, /^The top-layer Sort by/);

    expect(explanation.linkNamed(run, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });

  test('should link the trap the toggle lets speak to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const part = await explanation.part('Why the popover wins');
    const run = explanation.saying(part, /^Script adds two things/);

    expect(explanation.linkNamed(run, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });

  test('should link the run on the menu’s placement to card one’s list in What else forms a stacking context', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part('Why the popover wins');
    const run = explanation.saying(part, /The menu’s own style sheet places it/);

    expect(explanation.linkNamed(run, 'What else forms a stacking context')).toHaveAttribute('href', zIndexTab.fragmentOf('What else forms a stacking context'));
  });

  test('should link the run on the top layer to the page whose cards it means, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const part = await explanation.part('Why the popover wins');
    const run = explanation.saying(part, /^The top layer is not inside any stacking context/);

    expect(explanation.linkNamed(run, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });
});

describe('why the popover wins, on a term part one defines', () => {
  test('should link rule, at its first use, to part one’s page with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const popover = await explanation.part('Why the popover wins');

    expect(explanation.linkNamed(popover, 'rule')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });
});
