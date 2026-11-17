import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {exhibit, oldWayMenu, theTrap, wayLabeled, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const under = 'The list opened under card two. Its 9999 counts only inside card one.';
const over = 'The list opened over card two. Card one has no z-index now, so the 9999 is compared with card two’s 1.';

describe('the menu built the old way', () => {
  test('should open from a press, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const sortBy = await oldWayMenu.findButton();
    expect(sortBy).toHaveAttribute('aria-expanded', 'false');

    await oldWayMenu.open();

    expect(sortBy).toHaveAttribute('aria-expanded', 'true');
    expect(oldWayMenu.choices()).toEqual(['name', 'date', 'size']);
    expect(oldWayMenu.choice('name')).toHaveFocus();
  });

  test('should move through its choices by arrow, Home and End, and wrap at either end', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.focusButton();

    await oldWayMenu.openWithEnter();
    await oldWayMenu.next();
    expect(oldWayMenu.choice('date')).toHaveFocus();
    await oldWayMenu.last();
    expect(oldWayMenu.choice('size')).toHaveFocus();
    await oldWayMenu.next();
    expect(oldWayMenu.choice('name')).toHaveFocus();
    await oldWayMenu.previous();
    expect(oldWayMenu.choice('size')).toHaveFocus();
    await oldWayMenu.first();
    expect(oldWayMenu.choice('name')).toHaveFocus();
  });

  test('should take the choice pressed, close, and give focus back to its button', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.focusButton();

    await oldWayMenu.openWithEnter();
    await oldWayMenu.next();
    await oldWayMenu.takeByKeyboard();

    expect(oldWayMenu.queryMenu()).not.toBeInTheDocument();
    expect(oldWayMenu.button('Sort by: date, the old way')).toHaveFocus();
  });

  test('should mark the choice taken as current when it opens again', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.open();
    await oldWayMenu.choose('date');

    await oldWayMenu.open('Sort by: date, the old way');

    expect(oldWayMenu.currentChoice()).toHaveTextContent('date');
  });

  test('should close on Escape, and give focus back to its button', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.open();

    await oldWayMenu.close();

    expect(oldWayMenu.queryMenu()).not.toBeInTheDocument();
    expect(oldWayMenu.button()).toHaveFocus();
  });

  test('should open from ArrowDown on its button, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.focusButton();

    await oldWayMenu.openWithArrowDown();

    expect(oldWayMenu.choice('name')).toHaveFocus();
  });

  test('should close when focus leaves it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.open();

    await oldWayMenu.tabAway();

    expect(oldWayMenu.queryMenu()).not.toBeInTheDocument();
  });
});

describe('the card that traps the menu', () => {
  test('should give its steps before any control', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const trap = await theTrap.find();

    expect(exhibit.controlsBeforeTheSteps(trap, theTrap.controls(trap))).toEqual([]);
  });

  test('should show Sort by on both buttons, under the way each is built, and name each by its words then its way', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const trap = await theTrap.find();

    const oldWay = theTrap.controlIn(trap, 'Sort by, the old way');
    const topLayer = theTrap.controlIn(trap, 'Sort by, in the top layer');

    expect(wayLabeled(trap, 'The old way')).toContainElement(oldWay);
    expect(wayLabeled(trap, 'The old way')).not.toContainElement(topLayer);
    expect(wayLabeled(trap, 'The top layer')).toContainElement(topLayer);
    expect(oldWay).toHaveTextContent(/^Sort by$/);
    expect(topLayer).toHaveTextContent(/^Sort by$/);
  });

  test('should name a button by the choice it shows, then its way', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.open();

    await oldWayMenu.choose('date');

    expect(oldWayMenu.button('Sort by: date, the old way')).toHaveTextContent(/^Sort by: date$/);
  });

  test('should say nothing before the first press', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await oldWayMenu.findWhereItOpened()).toBeEmptyDOMElement();
  });

  test('should take back what it said when the box changes, since the next press answers', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.open();
    await oldWayMenu.close();

    await theTrap.toggleCardOne();

    expect(oldWayMenu.whereItOpened()).toBeEmptyDOMElement();
  });

  test('should say the list opened under card two when card one has its z-index', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await oldWayMenu.open();

    expect(oldWayMenu.whereItOpened()).toHaveTextContent(under);
  });

  test('should say where the list opened when ArrowDown opens it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldWayMenu.focusButton();

    await oldWayMenu.openWithArrowDown();

    expect(oldWayMenu.whereItOpened()).toHaveTextContent(under);
  });

  test('should say the list opened over card two once the box is unchecked, and write it into the address', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await theTrap.toggleCardOne();

    await oldWayMenu.open();

    expect(oldWayMenu.whereItOpened()).toHaveTextContent(over);
    expect(appAddress.search()).toHaveTextContent('card-one=free');
  });

  test('should say the list opened under card two again once the box is checked again', async () => {
    render(<TestApp at={demosAt('z-index', '?card-one=free')}/>);
    await oldWayMenu.open();
    await oldWayMenu.close();

    await theTrap.toggleCardOne();
    await oldWayMenu.open();

    expect(oldWayMenu.whereItOpened()).toHaveTextContent(under);
  });

  test('should open freed when the address says so', async () => {
    render(<TestApp at={demosAt('z-index', '?card-one=free')}/>);

    expect(theTrap.cardOneHasZIndexBox(await theTrap.find())).not.toBeChecked();
  });
});

describe('why 9999 still loses', () => {
  test('should link where it says the cards are compared to What else forms a stacking context', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part('Why 9999 still loses');

    expect(explanation.linkNamed(explanation.runTelling(part, /The cards are compared in the nearest context/), 'What else forms a stacking context'))
      .toHaveAttribute('href', zIndexTab.fragmentOf('What else forms a stacking context'));
  });
});

describe('the terms part one defines, met again in why 9999 still loses', () => {
  test('should link positioned, at its first use, to part one’s page with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const stillLoses = await explanation.part('Why 9999 still loses');

    expect(explanation.linksBeside(stillLoses, /so it forms a stacking context/)).toEqual([
      ['positioned', demosAt('z-index/why-third-is-on-top', '?raised=second')]
    ]);
  });

  test('should link auto, at its first use, to part one’s page with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const stillLoses = await explanation.part('Why 9999 still loses');

    expect(explanation.linksBeside(stillLoses, /^With the box unchecked/)).toEqual([
      ['auto', demosAt('z-index/why-third-is-on-top', '?raised=second')]
    ]);
  });
});
