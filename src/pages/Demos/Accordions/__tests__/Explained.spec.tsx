import {render, screen, within} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';

const parts = ['How we used to build a fold', 'What the platform gives now', 'The two together', 'How every fold moves'];

describe('the accordions tab', () => {
  test('should tell the old way, then the platform, then the two together, then how every fold moves', async () => {
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

describe('the accordions explanation', () => {
  test.each([
    [parts[0], /Neither build has any script/],
    [parts[1], /There is no script here either/]
  ])('should say under "%s" that its builds have no script', async (part, says) => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(within(explained).getByText(says)).toBeInTheDocument();
  });
});

describe('how every fold moves', () => {
  test('should show the one block that opens every fold at once for a reader who asks for less motion', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: parts[3]});
    const shown = within(explained).getAllByRole('code').map(code => code.textContent ?? '').join('\n');

    expect(shown).toContain('@media (prefers-reduced-motion: reduce)');
    expect(shown).toContain('::details-content');
    expect(shown).toContain('::view-transition-group(*)');
  });
});

describe('the accordions diagrams', () => {
  test.each([
    [parts[0], ['One job, two ways', 'Off screen, not gone', 'The sheet reads the box', 'Two borders, turned', 'Focus on the box, drawn on the bar', 'The guess', 'One name, one choice']],
    [parts[1], ['Three pieces become two', 'Sized to the text, no guess']],
    [parts[2], ['A row that grows to its content', 'The padding inside the clip', 'The text rides the row’s edge']]
  ])('should draw under "%s" each mechanism in order, named by its title and one sentence', async (part, titles) => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(titles.map(title => within(explained).getByRole('figure', {name: new RegExp(`^${title}\\. \\S.*\\.$`)})))
      .toEqual(within(explained).getAllByRole('figure'));
  });

  test('should set out what each element promises, row by row, as a table', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: parts[2]});
    const promises = within(explained).getByRole('table', {name: 'What each element promises'});

    expect(within(promises).getByRole('row', {name: 'checkbox yes no'})).toBeInTheDocument();
    expect(within(promises).getByRole('row', {name: 'radio no yes'})).toBeInTheDocument();
    expect(within(promises).getByRole('row', {name: 'details with a name yes yes'})).toBeInTheDocument();
  });
});
