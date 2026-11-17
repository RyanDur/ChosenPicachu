import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {tablesMap, tablesTab} from '@pages/Demos/Tables/__test_support';

const vanilla = '?world=vanilla';
const everyPart = (current?: string) => [
  ['1. Start with the need, and let it pick the element', demosAt('tables/the-need-and-its-clues', vanilla)],
  ['2. Sketch a design from the need', demosAt('tables/the-sketch', vanilla)],
  ['3. Slice the design into stories', demosAt('tables/the-slices', vanilla)],
  ['4. Build the still table', demosAt('tables/the-still-table', `${vanilla}&living=still`)],
  ['5. Make the table live', demosAt('tables/the-live-table-and-the-store', `${vanilla}&living=flow%2Cstore`)],
  ['6. Drag sort', demosAt('tables/sort', vanilla)],
  ['7. Sort menu', demosAt('tables/menu', vanilla)],
  ['8. Drag resize', demosAt('tables/resize', vanilla)]
].map(([name, address]) => [name, name === current ? null : address]);

describe('the tables map', () => {
  test('should say on the tables tab how many parts there are, the tutorials among them, and how long they take together', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesMap.says()).toHaveTextContent(/^Eight parts, about 53 minutes: five that build the live table, then three tutorials/);
  });

  test('should give only the size on the tables tab, where the stations already list the parts', async () => {
    render(<TestApp at={demosAt('tables', vanilla)}/>);

    await tablesMap.says();

    expect(tablesMap.listed()).not.toBeInTheDocument();
  });

  test('should mark the part the reader is on, and lead to every other part', async () => {
    render(<TestApp at={demosAt('tables/the-slices', vanilla)}/>);

    expect(await tablesMap.entries()).toEqual(everyPart('3. Slice the design into stories'));
    expect(await tablesMap.current()).toHaveTextContent('3. Slice the design into stories');
  });

  test('should mark a tutorial as the part the reader is on', async () => {
    render(<TestApp at={demosAt('tables/menu', vanilla)}/>);

    expect(await tablesMap.entries()).toEqual(everyPart('7. Sort menu'));
    expect(await tablesMap.current()).toHaveTextContent('7. Sort menu');
  });

  test('should say on the tables tab how long each tutorial takes to read', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().tutorialReadingTimeOf('Sort menu')).toHaveTextContent(/^7 minutes to read$/);
  });
});
