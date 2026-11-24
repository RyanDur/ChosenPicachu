import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {clearfixTray, positionExhibit} from '@pages/Demos/ZIndexDemo/__test_support';

const howPosition = 'z-index/how-position-places-a-box';
const title = 'How position places a box';

describe('the clearfix tray, in where Second goes', () => {
  test('should be offered while Second is absolute', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('absolute');

    expect(clearfixTray.opener()).toBeInTheDocument();
  });

  test('should not be offered while Second is at any other position', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute')}/>);
    await explanation.part(title);

    await positionExhibit.choose('relative');

    expect(clearfixTray.opener()).not.toBeInTheDocument();
  });

  test('should open in the flow, where the parent wraps First and Second', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute')}/>);
    await explanation.part(title);

    await clearfixTray.opens();

    expect(clearfixTray.whatTheParentDid()).toHaveTextContent(/^The parent wraps First and Second\.$/);
  });

  test('should collapse the parent once its boxes float', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&clearfix=in-the-flow')}/>);
    await explanation.part(title);

    await clearfixTray.stepsTo('2 · Float');

    expect(clearfixTray.whatTheParentDid()).toHaveTextContent(
      /^The parent collapses to a line\. First and Second hang outside it, and the rest of the page slides up under them\.$/);
  });

  test('should hold the floats again with the clearfix', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&clearfix=float')}/>);
    await explanation.part(title);

    await clearfixTray.stepsTo('3 · The clearfix');

    expect(clearfixTray.whatTheParentDid()).toHaveTextContent(
      /^The parent holds its floats again, with one more rule and an unseen box\.$/);
  });

  test('should still hold the floats with what we have now', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&clearfix=the-clearfix')}/>);
    await explanation.part(title);

    await clearfixTray.stepsTo('4 · What we have now');

    expect(clearfixTray.whatTheParentDid()).toHaveTextContent(/^The parent holds its floats, with one declaration\.$/);
  });

  test('should mark in the CSS the rule each step adds', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&clearfix=the-clearfix')}/>);
    await explanation.part(title);

    await clearfixTray.stepsTo('4 · What we have now');

    expect(clearfixTray.markedRules()).toEqual(['.parent {', 'display: flow-root;', '}']);
  });

  test('should offer to close it, with the same control, while it is open', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute')}/>);
    await explanation.part(title);

    await clearfixTray.opens();

    expect(await clearfixTray.shownCloser()).toBeInTheDocument();
  });

  test('should offer to show it again once closed', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&clearfix=float')}/>);
    await explanation.part(title);

    await clearfixTray.closes();

    expect(await clearfixTray.shownOpener()).toBeInTheDocument();
  });

  test('should open at the step a copied address names', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&clearfix=the-clearfix')}/>);
    await explanation.part(title);

    expect(clearfixTray.step('3 · The clearfix')).toBeChecked();
  });

  test('should be as the reader left it when Second comes back to absolute', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&clearfix=float')}/>);
    await explanation.part(title);
    await positionExhibit.choose('static');

    await positionExhibit.choose('absolute');

    expect(clearfixTray.step('2 · Float')).toBeChecked();
  });
});
