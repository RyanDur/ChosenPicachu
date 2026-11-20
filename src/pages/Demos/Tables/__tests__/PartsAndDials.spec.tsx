import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt, partsIndex} from '@pages/Demos/__test_support';
import {aggregations, tablesTab} from '@pages/Demos/Tables/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {titleAbove} from '@__test_support/title-above';

const sortMenu = 'tables/menu';
const theSlices = 'tables/the-slices';
const everyPart = (build: string) => [
  demosAt('tables/the-need-and-its-clues', build),
  demosAt('tables/the-sketch', build),
  demosAt('tables/the-slices', build),
  demosAt('tables/the-still-table', build),
  demosAt('tables/the-live-table-and-the-store', build),
  demosAt('tables/sort', build),
  demosAt('tables/menu', build),
  demosAt('tables/resize', build)
];
const howLong = /about 53 minutes/;

describe('the tables panel', () => {
  test('should say on the tables tab how long the parts take together', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await demoPage.panel('parts and dials')).toHaveTextContent(howLong);
  });

  test('should say beside a part how long the parts take together', async () => {
    render(<TestApp at={demosAt(theSlices)}/>);

    const page = await tablesTab().partPage('Slice the design into stories');

    expect(await tablesTab().sizeIn(page)).toHaveTextContent(howLong);
  });

  test('should hold the eight parts beside a tutorial, as the tab does', async () => {
    render(<TestApp at={demosAt(sortMenu)}/>);

    const index = await partsIndex.find();

    expect(partsIndex.titlesIn(index)).toEqual(['Start with the need, and let it pick the element',
      'Sketch a design from the need', 'Slice the design into stories', 'Build the still table',
      'Make the table live', 'Drag sort', 'Sort menu', 'Drag resize']);
  });

  test('should mark the tutorial the reader is on as the current page', async () => {
    render(<TestApp at={demosAt(sortMenu)}/>);

    const index = await partsIndex.find();

    expect(partsIndex.currentIn(index)).toHaveAccessibleName('Sort menu');
  });

  test('should mark the part the reader is on as the current page', async () => {
    render(<TestApp at={demosAt(theSlices)}/>);

    const index = await partsIndex.find();

    expect(partsIndex.currentIn(index)).toHaveAccessibleName('Slice the design into stories');
  });

  test('should lead beside a part to every part, with the build carried', async () => {
    render(<TestApp at={demosAt(theSlices, '?world=vanilla')}/>);

    const index = await partsIndex.find();

    expect(partsIndex.addressesIn(index)).toEqual(everyPart('?world=vanilla'));
  });

  test('should carry the build a reader chooses in it beside a tutorial to every part', async () => {
    render(<TestApp at={demosAt(sortMenu)}/>);

    await tablesTab().pick('Vanilla');

    expect(partsIndex.addressesIn(await partsIndex.find())).toEqual(everyPart('?world=vanilla'));
  });

  test('should list the parts once beside a tutorial', async () => {
    render(<TestApp at={demosAt(sortMenu)}/>);

    await partsIndex.find();

    expect(demoPage.entriesLinking(/Drag resize$/)).toHaveLength(1);
  });

  test('should sit inside a part’s page, which holds its own title', async () => {
    render(<TestApp at={demosAt(theSlices)}/>);

    const page = await tablesTab().partPage('Slice the design into stories');

    expect(tablesTab().titlesIn(page)).toEqual(['Slice the design into stories']);
  });

  test('should sit inside a tutorial’s page, which holds its own title', async () => {
    render(<TestApp at={demosAt(sortMenu)}/>);

    const page = await tablesTab().tutorialPage('Sort menu');

    expect(tablesTab().titlesIn(page)).toEqual(['Sort menu']);
  });

  test('should come after a part’s title and before its live table', async () => {
    render(<TestApp at={demosAt(theSlices)}/>);

    const [title] = tablesTab().titles('Slice the design into stories', 2);
    const index = await partsIndex.find();
    const liveTable = await aggregations.arrived();

    expect(outOfReadingOrder([title, index, liveTable])).toEqual([]);
  });

  test('should come after a tutorial’s title and before its live table', async () => {
    render(<TestApp at={demosAt(sortMenu)}/>);

    const index = await partsIndex.find();
    const [title] = tablesTab().titles('Sort menu', 2);
    const liveTable = await aggregations.arrived();

    expect(outOfReadingOrder([title, index, liveTable])).toEqual([]);
  });

  test('should leave a part’s live table under the part’s own title, not under the parts', async () => {
    render(<TestApp at={demosAt(theSlices)}/>);

    expect(titleAbove(await aggregations.arrived())).toBe('Slice the design into stories');
  });
});
