import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {bookMap, demosAt} from '@pages/Demos/__test_support';
import {untilTheTablesTabRenders} from '@pages/Demos/Tables/__test_support';

const tablesMap = bookMap('the tables map', untilTheTablesTabRenders);

const vanilla = '?world=vanilla';
const everyPart = [
  ['1. Start with the need, and let it pick the element', demosAt('tables/the-need-and-its-clues', vanilla)],
  ['2. Sketch a design from the need', demosAt('tables/the-sketch', vanilla)],
  ['3. Slice the design into stories', demosAt('tables/the-slices', vanilla)],
  ['4. Build the still table', demosAt('tables/the-still-table', vanilla)],
  ['5. Make the table live', demosAt('tables/the-live-table-and-the-store', vanilla)],
  ['6. Drag sort', demosAt('tables/sort', vanilla)],
  ['7. Sort menu', demosAt('tables/menu', vanilla)],
  ['8. Drag resize', demosAt('tables/resize', vanilla)]
];

describe('the tables map', () => {
  test('should say on the tables tab how long the parts take together', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesMap.says()).toHaveTextContent(/about 53 minutes/);
  });

  test('should give only the size on the tables tab, where the stations already list the parts', async () => {
    render(<TestApp at={demosAt('tables', vanilla)}/>);

    await tablesMap.says();

    expect(tablesMap.listed()).not.toBeInTheDocument();
  });

  test('should mark the part the reader is on, and lead to every part', async () => {
    render(<TestApp at={demosAt('tables/the-slices', vanilla)}/>);

    expect(await tablesMap.signposts()).toEqual(everyPart);
    expect(await tablesMap.current()).toHaveTextContent('3. Slice the design into stories');
  });

  test('should mark a tutorial as the part the reader is on', async () => {
    render(<TestApp at={demosAt('tables/menu', vanilla)}/>);

    expect(await tablesMap.signposts()).toEqual(everyPart);
    expect(await tablesMap.current()).toHaveTextContent('7. Sort menu');
  });
});
