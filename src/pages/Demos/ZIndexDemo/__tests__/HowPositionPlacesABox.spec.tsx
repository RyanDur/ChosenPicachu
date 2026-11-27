import {render} from '@testing-library/react';
import {Paths} from '@navigation';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, pageFoot} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {positionExhibit, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const howPosition = 'z-index/how-position-places-a-box';
const title = 'How position places a box';

describe('how position places a box, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 2 of 7');
  });

  test('should lead back to part one’s page and on to part three’s page, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(howPosition, '?raised=second')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 1. Why Third is on top', demosAt('z-index/why-third-is-on-top', '?raised=second')],
      ['Next: 3. Why 9999 still loses', demosAt('z-index/why-9999-still-loses', '?raised=second')]
    ]);
  });

  test('should link why Third is on top, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(howPosition, '?raised=second')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(explanation.opener(part), 'Why Third is on top')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });

  test('should link stacking context, at its first use, to the tab’s page, which defines it', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'stacking context')).toHaveAttribute('href', `${Paths.demos}z-index/`);
  });

  test('should link positioned, with Second absolute, to the page for why Third is on top with the raised card and Second’s position carried', async () => {
    render(<TestApp at={demosAt(howPosition, '?raised=second')}/>);
    const part = await explanation.part(title);

    await positionExhibit.choose('absolute');

    expect(explanation.linkNamed(part, 'positioned'))
      .toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second&second-position=absolute'));
  });

  test('should link flow, where a static Second is placed in it, to the page for why Third is on top with the raised card carried', async () => {
    render(<TestApp at={demosAt(howPosition, '?raised=second')}/>);
    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'flow')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });

  test('should offer the parent’s position while Second is absolute', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('absolute');

    expect(positionExhibit.parentPills()).toBeInTheDocument();
  });

  test('should take the parent’s position away once Second is no longer absolute', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);
    await positionExhibit.choose('absolute');

    await positionExhibit.choose('fixed');

    expect(positionExhibit.queryParentPills()).not.toBeInTheDocument();
  });

  test('should open with the positions a shared address names already chosen', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=absolute&parent-position=not-positioned')}/>);

    await explanation.part(title);

    expect(positionExhibit.pill('absolute')).toBeChecked();
    expect(positionExhibit.parentPill('not positioned')).toBeChecked();
  });

  test('should open with Second static when the address names a position there is not', async () => {
    render(<TestApp at={demosAt(howPosition, '?second-position=sideways')}/>);

    await explanation.part(title);

    expect(positionExhibit.pill('static')).toBeChecked();
  });

  test('should show a relative Second’s own rule in the CSS', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('relative');

    expect(positionExhibit.samples().css).toContain('position: relative;');
  });

  test('should show a fixed Second inside the transformed little view its CSS names', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('fixed');

    expect(positionExhibit.samples()).toEqual({
      html: expect.stringContaining('<section class="little-view transformed">'),
      css: expect.stringContaining('.little-view.transformed {')
    });
  });

  test('should say a static Second is measured from nowhere', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);
    await positionExhibit.choose('relative');

    await positionExhibit.choose('static');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('nowhere');
  });

  test('should say a relative Second is measured from its own place in the flow', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('relative');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('the box’s own place in the flow');
  });

  test('should say an absolute Second with a positioned parent is measured from the parent’s corner', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('absolute');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('the parent’s corner');
  });

  test('should say an absolute Second with no positioned parent is measured from the little page’s corner', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);
    await positionExhibit.choose('absolute');

    await positionExhibit.chooseParent('not positioned');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('the little page’s corner');
  });

  test('should say a fixed Second is measured from the corner of the window’s view', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('fixed');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('the corner of the window’s view, under its bar');
  });

  test('should say a sticky Second is measured from the top edge of the box that scrolls', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('sticky');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('the top edge of the box that scrolls');
  });

  test('should say a static Second sits between First and Third', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);
    await positionExhibit.choose('relative');

    await positionExhibit.choose('static');

    expect(positionExhibit.whereSecondWent()).toHaveTextContent('Second sits between First and Third. The 16px and 24px do nothing.');
  });

  test('should say a relative Second moves and leaves its old place open', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('relative');

    expect(positionExhibit.whereSecondWent()).toHaveTextContent('Second moves 16px down and 24px right. Its old place stays open, and Third does not move.');
  });

  test('should say an absolute Second with a positioned parent leaves the flow for the parent’s corner', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('absolute');

    expect(positionExhibit.whereSecondWent()).toHaveTextContent('Second leaves the flow, and Third moves up into its place. Second sits 16px down and 24px in from the parent’s corner, drawn over First. It scrolls with the page.');
  });

  test('should say an absolute Second with no positioned parent goes to the page’s corner', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);
    await positionExhibit.choose('absolute');

    await positionExhibit.chooseParent('not positioned');

    expect(positionExhibit.whereSecondWent()).toHaveTextContent('Second sits 16px down and 24px in from the page’s corner, over the top of the page and outside its parent. It still scrolls with the page.');
  });

  test('should say a fixed Second stays put in the window', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('fixed');

    expect(positionExhibit.whereSecondWent()).toHaveTextContent('Second leaves the flow and stays put in the window while the page scrolls under it.');
  });

  test('should say a sticky Second stays at the top until its parent leaves', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('sticky');

    expect(positionExhibit.whereSecondWent()).toHaveTextContent('Second scrolls with the page, then stays at the top while the rest of its parent scrolls under it. It leaves when its parent does.');
  });
});
