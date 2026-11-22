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

    expect(await pageFoot.leadsOn('the z-index parts')).toEqual([
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

  test('should link positioned, with Second absolute, to the page for why Third is on top with the raised card carried', async () => {
    render(<TestApp at={demosAt(howPosition, '?raised=second')}/>);
    const part = await explanation.part(title);

    await positionExhibit.choose('absolute');

    expect(explanation.linkNamed(part, 'positioned')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
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

  test('should say a static Second is measured from nowhere', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);
    await positionExhibit.choose('relative');

    await positionExhibit.choose('static');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('Measured from: nowhere');
  });

  test('should say a relative Second is measured from its own place in the flow', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('relative');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('Measured from: the box’s own place in the flow');
  });

  test('should say an absolute Second with a positioned parent is measured from the parent’s corner', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('absolute');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('Measured from: the parent’s corner');
  });

  test('should say an absolute Second with no positioned parent is measured from the little page’s corner', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);
    await positionExhibit.choose('absolute');

    await positionExhibit.chooseParent('not positioned');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('Measured from: the little page’s corner');
  });

  test('should say a fixed Second is measured from the view’s corner', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('fixed');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('Measured from: the view’s corner');
  });

  test('should say a sticky Second is measured from the top edge of the box that scrolls', async () => {
    render(<TestApp at={demosAt(howPosition)}/>);
    await explanation.part(title);

    await positionExhibit.choose('sticky');

    expect(positionExhibit.measuredFrom()).toHaveTextContent('Measured from: the top edge of the box that scrolls');
  });

});
