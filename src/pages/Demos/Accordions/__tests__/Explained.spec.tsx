import {render, screen, within} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';

const parts = ['How we used to build a fold', 'What the platform gives now', 'The two together'];

describe('the accordions tab', () => {
  test('should tell the old way, then the platform, then the two together', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});

    expect(within(tab).getAllByRole('heading', {level: 3}).map(part => part.textContent)).toEqual(parts);
  });

  test.each([
    [parts[0], ['Accordion using checkboxes', 'Accordion using a radio group']],
    [parts[1], ['Exclusive accordion using details elements']],
    [parts[2], ['Exclusive accordion using checkboxes', 'Exclusive accordion using radio group']]
  ])('should show under "%s" the builds it is about', async (part, builds) => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(within(explained).getAllByRole('heading', {level: 4}).map(build => build.textContent)).toEqual(builds);
  });
});
