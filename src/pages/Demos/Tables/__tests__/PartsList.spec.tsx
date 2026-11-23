import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {titleAbove} from '@__test_support/title-above';
import {demoPage, demosAt, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {aggregations, tablesTab} from '@pages/Demos/Tables/__test_support';
import {tableTutorials} from '@pages/Demos/Tables/tutorial-pages';

describe('the tables parts list', () => {
  test('should list the five parts that build the live table, each a link to its page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().partsIn('Build the live table')).toEqual([
      ['Start with the need, and let it pick the element', demosAt('tables/the-need-and-its-clues')],
      ['Sketch a design from the need', demosAt('tables/the-sketch')],
      ['Slice the design into stories', demosAt('tables/the-slices')],
      ['Build the still table', demosAt('tables/the-still-table')],
      ['Make the table live', demosAt('tables/the-live-table-and-the-store')]
    ]);
  });

  test('should list the three parts that add what the trader asked for, each a link to its page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().partsIn('Add what the trader asked for')).toEqual([
      ['Drag sort', demosAt('tables/sort')],
      ['Sort menu', demosAt('tables/menu')],
      ['Drag resize', demosAt('tables/resize')]
    ]);
  });

  test('should come after the size line, and before the opening, the dial, the live table and let’s build this feature', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    const index = await partsIndex.list();

    expect(outOfReadingOrder([await tablesTab().size(), index, await tablesTab().opening(),
      await tablesTab().worldDial(), aggregations.card(), await demoPage.findTitle('let’s build this feature')]))
      .toEqual([]);
  });

  test('should leave the live table’s exhibit under the tab’s own title, not under the parts', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await partsIndex.find();

    expect(titleAbove(await aggregations.findExhibitTitle())).toBe('Demos Tables');
  });

  test('should say under the sort menu what its part is about', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    const entry = partsIndex.entryOf(await partsIndex.find(), 'Sort menu');

    expect(explanation.saying(entry, tableTutorials.saysOf('menu'))).toBeInTheDocument();
  });
});
