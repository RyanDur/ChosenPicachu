import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {stackingPile} from '@pages/Demos/ZIndexDemo/__test_support';

describe('the stacking pile', () => {
  test('should name the pile by its caption, inside the part that asks why Third is on top', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part('Why Third is on top');

    expect(explanation.drawingNamed(part, 'The pile. Raise a card over the others with the pills above it.')).toBeInTheDocument();
  });

  test('should say what a class is where the tab first names one', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part('Why Third is on top');

    expect(explanation.saying(part, /^Choose a card with the pills/)).toHaveTextContent('Choose a card with the pills above the pile, and the page adds the class raised to it. A class is a name a rule picks out, as the accordions tab says. A rule is a selector, which names the elements it applies to, and the properties it sets on them. The stylesheet gives raised a z-index of 1.');
  });

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

  test('should show the pile’s list and its positioning beside the drawing of the pile from the side', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const tab = await demoTabs.arrivedOn('Z-index');

    expect(explanation.everyCodeBesideDrawing(tab, /The pile from the side/).join()).toMatch(/First[^]*Second[^]*Third[^]*\.layer \{[^]*position: relative[^]*\.closed \{[^]*position: absolute/);
  });

  test('should show the rule that raises a card beside the drawing of one card lifted', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const tab = await demoTabs.arrivedOn('Z-index');

    expect(explanation.everyCodeBesideDrawing(tab, /One number lifts one card/).join()).toMatch(/\.raised \{[^]*z-index: 1/);
  });
});
