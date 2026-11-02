import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {theTrap, wearsChooser} from '@pages/Demos/ZIndexDemo/__test_support';

const heading = 'What else forms a stacking context';

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
    render(<TestApp at={demosAt('z-index')}/>);
    const chooser = await wearsChooser.find();
    await wearsChooser.putOn(chooser, 'nothing');

    await wearsChooser.pressSortBy(chooser);

    expect(wearsChooser.formed(chooser)).toHaveTextContent('The list opened over card two. Card one wears nothing, so it forms no stacking context.');
  });

  test('should say the list opened over card two once card one wears position: relative and Sort by is pressed', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const chooser = await wearsChooser.find();
    await wearsChooser.putOn(chooser, 'position: relative');

    await wearsChooser.pressSortBy(chooser);

    expect(wearsChooser.formed(chooser)).toHaveTextContent('The list opened over card two. position: relative alone forms no stacking context.');
  });

  test('should say the list opened over card two once card one wears an outline and Sort by is pressed', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const chooser = await wearsChooser.find();
    await wearsChooser.putOn(chooser, 'outline');

    await wearsChooser.pressSortBy(chooser);

    expect(wearsChooser.formed(chooser)).toHaveTextContent('The list opened over card two. An outline forms no stacking context.');
  });

  test('should say the list opened under card two once card one wears z-index: 1 and Sort by is pressed', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const chooser = await wearsChooser.find();
    await wearsChooser.putOn(chooser, 'z-index: 1');

    await wearsChooser.pressSortBy(chooser);

    expect(wearsChooser.formed(chooser)).toHaveTextContent('The list opened under card two. z-index: 1 formed a stacking context, so the 9999 counts only inside card one.');
  });

  test('should say the list opened under card two once card one wears opacity: 0.9 and Sort by is pressed', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const chooser = await wearsChooser.find();
    await wearsChooser.putOn(chooser, 'opacity: 0.9');

    await wearsChooser.pressSortBy(chooser);

    expect(wearsChooser.formed(chooser)).toHaveTextContent('The list opened under card two. opacity: 0.9 formed a stacking context.');
  });

  test('should say the list opened under card two once card one wears a transform and Sort by is pressed', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const chooser = await wearsChooser.find();
    await wearsChooser.putOn(chooser, 'transform: rotate(-1deg)');

    await wearsChooser.pressSortBy(chooser);

    expect(wearsChooser.formed(chooser)).toHaveTextContent('The list opened under card two. The transform formed a stacking context.');
  });

  test('should say the list opened under card two once card one wears isolation: isolate and Sort by is pressed', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const chooser = await wearsChooser.find();
    await wearsChooser.putOn(chooser, 'isolation: isolate');

    await wearsChooser.pressSortBy(chooser);

    expect(wearsChooser.formed(chooser)).toHaveTextContent('The list opened under card two. isolation: isolate formed a stacking context.');
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

  test('should send position: relative to its page at MDN', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part(heading);

    expect(explanation.linkNamed(part, 'position: relative')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/position');
  });

  test('should send outline to its page at MDN', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part(heading);

    expect(explanation.linkNamed(part, 'outline')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/outline');
  });

  test('should send z-index: 1 to its page at MDN', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part(heading);

    expect(explanation.linkNamed(part, 'z-index: 1')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/z-index');
  });

  test('should send opacity: 0.9 to its page at MDN', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part(heading);

    expect(explanation.linkNamed(part, 'opacity: 0.9')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/opacity');
  });

  test('should send transform: rotate(-1deg) to its page at MDN', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part(heading);

    expect(explanation.linkNamed(part, 'transform: rotate(-1deg)')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/transform');
  });

  test('should send isolation: isolate to its page at MDN', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await explanation.part(heading);

    expect(explanation.linkNamed(part, 'isolation: isolate')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/isolation');
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
