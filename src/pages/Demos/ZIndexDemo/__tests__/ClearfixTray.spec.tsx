import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {clearfixTray, positionExhibit} from '@pages/Demos/ZIndexDemo/__test_support';

const howPosition = 'z-index/how-position-places-a-box';
const title = 'How position places a box';

describe('the clearfix tray, in where Second goes', () => {
  test('should mark in the CSS the rule each step adds', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&clearfix=the-clearfix')}/>);
    await explanation.part(title);

    await clearfixTray.stepsTo('4 · What we have now');

    expect(clearfixTray.markedRules()).toEqual(['.parent {', 'display: flow-root;', '}']);
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
