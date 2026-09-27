import {render, screen, within} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';

describe('the accordions tab', () => {
  test.each([
    ['How we used to build a fold', ['Accordion using checkboxes', 'Accordion using a radio group']],
    ['What the platform gives now', ['Exclusive accordion using details elements']],
    ['The two together', ['Exclusive accordion using checkboxes', 'Exclusive accordion using radio group']]
  ])('should explain "%s" beside the builds it is about', async (part, builds) => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(within(explained).getAllByRole('heading', {level: 4}).map(build => build.textContent)).toEqual(builds);
  });
});
