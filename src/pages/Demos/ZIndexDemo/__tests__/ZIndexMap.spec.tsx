import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {bookMap, demosAt} from '@pages/Demos/__test_support';

const zIndexMap = bookMap('the z-index map');

const raised = '?raised=second';
const everyPart = [
  ['1. Why Third is on top', demosAt('z-index/why-third-is-on-top', raised)],
  ['2. Why 9999 still loses', demosAt('z-index/why-9999-still-loses', raised)],
  ['3. What else forms a stacking context', demosAt('z-index/what-else-forms-a-stacking-context', raised)],
  ['4. Why the popover wins', demosAt('z-index/why-the-popover-wins', raised)],
  ['5. Why a fixed banner still loses', demosAt('z-index/why-a-fixed-banner-still-loses', raised)],
  ['6. Let’s build this feature', demosAt('z-index/lets-build-this-feature', raised)]
];

describe('the z-index map', () => {
  test('should say on the z-index tab how long the parts take together', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await zIndexMap.says()).toHaveTextContent(/about 24 minutes/);
  });

  test('should give only the size on the z-index tab, where the listings already name the parts', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await zIndexMap.says();

    expect(zIndexMap.listed()).not.toBeInTheDocument();
  });

  test('should say on a part’s page how long the parts take together', async () => {
    render(<TestApp at={demosAt('z-index/why-the-popover-wins')}/>);

    expect(await zIndexMap.saysInside()).toHaveTextContent(/about 24 minutes/);
  });

  test('should lead from a part’s page to every part, with the reader’s choices carried', async () => {
    render(<TestApp at={demosAt('z-index/why-the-popover-wins', raised)}/>);

    expect(await zIndexMap.signposts()).toEqual(everyPart);
  });

  test('should mark the part the reader is on', async () => {
    render(<TestApp at={demosAt('z-index/why-the-popover-wins', raised)}/>);

    expect(await zIndexMap.current()).toHaveTextContent('4. Why the popover wins');
  });
});
