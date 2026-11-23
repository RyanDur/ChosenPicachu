import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import names from '@navigation/names.json';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {demosAt, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const titles = ['Why Third is on top', 'How position places a box', 'Why 9999 still loses',
  'What else forms a stacking context', 'Why the popover wins', 'Why a fixed banner still loses',
  'Let’s build this feature'];

describe('the z-index parts list', () => {
  test('should list the seven parts in order, why Third is on top first', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const index = await partsIndex.find();

    expect(partsIndex.titlesIn(index)).toEqual(titles);
  });

  test('should come after the size line, and before the opening and the pile', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const index = await partsIndex.list();

    expect(outOfReadingOrder([await zIndexTab.size(), index, await zIndexTab.opening(), await zIndexTab.pile()]))
      .toEqual([]);
  });

  test('should give let’s build this feature its minutes, as 10 min', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const entry = partsIndex.entryOf(await partsIndex.find(), 'Let’s build this feature');

    expect(explanation.saying(entry, '10 min')).toBeInTheDocument();
  });

  test('should say under why the popover wins what its part is about', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const entry = partsIndex.entryOf(await partsIndex.find(), 'Why the popover wins');

    expect(explanation.saying(entry, names['z-index']['why-the-popover-wins'].description)).toBeInTheDocument();
  });
});
