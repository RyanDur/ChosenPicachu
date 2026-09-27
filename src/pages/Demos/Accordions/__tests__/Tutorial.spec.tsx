import {render, screen, within} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';

describe('the accordions tutorial', () => {
  test('tells the lineage as named disclosures, in the order the web learned them', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const builds = await screen.findByRole('region', {name: 'build the accordions yourself'});

    expect(within(builds).getAllByRole('group').map(story => within(story).getByRole('heading').textContent)).toEqual([
      'The reader can open and close any part without script',
      'The reader can keep one part open at a time',
      'The reader can open one part at a time on the platform’s own disclosure',
      'The reader can watch a part slide open to its own height',
      'The reader’s browser slides the part open where it can, and opens it at once where it cannot'
    ]);
  });
});
