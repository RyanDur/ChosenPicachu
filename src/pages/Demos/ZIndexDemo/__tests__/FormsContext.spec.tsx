import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {theTrap, wearsChooser} from '@pages/Demos/ZIndexDemo/__test_support';

const heading = 'What else forms a stacking context';

const formedOncePressedWearing = async (worn: string): Promise<HTMLElement> => {
  render(<TestApp at={demosAt('z-index')}/>);
  const chooser = await wearsChooser.find();
  await wearsChooser.putOn(chooser, worn);
  await wearsChooser.pressSortBy(chooser);
  return wearsChooser.formed(chooser);
};

describe('the part on what else forms a stacking context', () => {
  test('should offer, in order, the seven things card one can wear, with nothing chosen at first', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const chooser = await wearsChooser.find();

    expect(wearsChooser.wearsOffered(chooser)).toEqual([
      'nothing', 'position: relative', 'outline', 'z-index: 1', 'opacity: 0.9', 'transform: rotate(-1deg)', 'isolation: isolate'
    ]);
    expect(wearsChooser.wear(chooser, 'nothing')).toBeChecked();
  });

  test('should say nothing until Sort by is pressed', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const chooser = await wearsChooser.find();

    expect(wearsChooser.formed(chooser)).toBeEmptyDOMElement();
  });

  test('should say the list opened over card two once card one wears nothing and Sort by is pressed', async () => {
    expect(await formedOncePressedWearing('nothing')).toHaveTextContent('The list opened over card two. Card one wears nothing, so it forms no stacking context.');
  });

  test('should say the list opened over card two once card one wears position: relative and Sort by is pressed', async () => {
    expect(await formedOncePressedWearing('position: relative')).toHaveTextContent('The list opened over card two. position: relative alone forms no stacking context.');
  });

  test('should say the list opened over card two once card one wears an outline and Sort by is pressed', async () => {
    expect(await formedOncePressedWearing('outline')).toHaveTextContent('The list opened over card two. An outline forms no stacking context.');
  });

  test('should say the list opened under card two once card one wears z-index: 1 and Sort by is pressed', async () => {
    expect(await formedOncePressedWearing('z-index: 1')).toHaveTextContent('The list opened under card two. z-index: 1 formed a stacking context, so the 9999 counts only inside card one.');
  });

  test('should say the list opened under card two once card one wears opacity: 0.9 and Sort by is pressed', async () => {
    expect(await formedOncePressedWearing('opacity: 0.9')).toHaveTextContent('The list opened under card two. opacity: 0.9 formed a stacking context.');
  });

  test('should say the list opened under card two once card one wears a transform and Sort by is pressed', async () => {
    expect(await formedOncePressedWearing('transform: rotate(-1deg)')).toHaveTextContent('The list opened under card two. The transform formed a stacking context.');
  });

  test('should say the list opened under card two once card one wears isolation: isolate and Sort by is pressed', async () => {
    expect(await formedOncePressedWearing('isolation: isolate')).toHaveTextContent('The list opened under card two. isolation: isolate formed a stacking context.');
  });

  test('should go quiet when another choice is made after Sort by was pressed', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const chooser = await wearsChooser.find();
    await wearsChooser.pressSortBy(chooser);
    await wearsChooser.closeTheList();

    await wearsChooser.putOn(chooser, 'isolation: isolate');

    expect(wearsChooser.formed(chooser)).toBeEmptyDOMElement();
  });

  test('should write the choice into the address, and bring it back from there', async () => {
    const {unmount} = render(<TestApp at={demosAt('z-index')}/>);
    await wearsChooser.putOn(await wearsChooser.find(), 'transform: rotate(-1deg)');
    expect(demoPage.urlSearch()).toHaveTextContent('wears=transform');
    unmount();

    render(<TestApp at={demosAt('z-index', '?wears=transform')}/>);

    expect(wearsChooser.wear(await wearsChooser.find(), 'transform: rotate(-1deg)')).toBeChecked();
  });

  test('should leave the menu part’s own checkbox as it was', async () => {
    render(<TestApp at={demosAt('z-index', '?wears=opacity')}/>);

    expect(theTrap.cardOneHasZIndexBox(await theTrap.find())).toBeChecked();
  });

  test('should open each property’s run on its page at MDN', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const part = await explanation.part(heading);

    expect(explanation.firstLinkIn(explanation.runTelling(part, /^is not enough on its own, and neither is absolute/))).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/position');
    expect(explanation.firstLinkIn(explanation.runTelling(part, /^is paint\. An outline, a border/))).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/outline');
    expect(explanation.firstLinkIn(explanation.runTelling(part, /^forms a context on a positioned element\. It forms one on a grid item too, which card one is here/))).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/z-index');
    expect(explanation.firstLinkIn(explanation.runTelling(part, /^, like any opacity below 1, forms a context/))).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/opacity');
    expect(explanation.firstLinkIn(explanation.runTelling(part, /^forms a context, as any transform does/))).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/transform');
    expect(explanation.firstLinkIn(explanation.runTelling(part, /^forms a context and does nothing more\. Use it to keep/))).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/isolation');
  });

  test('should link anchor positioning to MDN', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const part = await explanation.part(heading);

    expect(explanation.linkNamed(explanation.runTelling(part, /^The list is placed by/), 'anchor positioning')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning');
  });

  test('should open its run on MDN’s whole list', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const part = await explanation.part(heading);

    expect(explanation.linkNamed(part, 'the whole list'))
      .toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context');
  });
});
