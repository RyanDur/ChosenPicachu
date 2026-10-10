import {TestApp} from '@__test_support/TestApp';
import {render, screen, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';

describe('the home page', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.home}/>);
  });

  test('should open on the thesis in one paragraph, and say what the site holds in the next', () => {
    expect(screen.getByText(/^A webpage is three languages working in concert/)).toHaveTextContent('A webpage is three languages working in concert. HTML says what things are, CSS says how they show, and JavaScript says how they respond. They were designed apart, on purpose, and when one could not yet do a job another covered for it until the standard caught up, as HTML’s own principles ask: “consider adopting it rather than forbidding it or inventing something new”.');
    expect(screen.getByText(/^That argument is this whole site/)).toHaveTextContent('That argument is this whole site: a door per language, the record of how the web got them, and the demos where I work the practice.');
  });

  test('should carry one quotation in the opening, linked to HTML’s design principles', () => {
    const thesis = within(screen.getByText(/^A webpage is three languages working in concert/));

    expect(thesis.getAllByRole('link')).toHaveLength(1);
    expect(thesis.getByRole('link', {name: '“consider adopting it rather than forbidding it or inventing something new”'}))
      .toHaveAttribute('href', 'https://www.w3.org/TR/html-design-principles/');
  });

  test('the page offers three doors, each named by its responsibility', () => {
    ['Structure', 'Presentation', 'Dynamic Interaction'].forEach(door =>
      expect(screen.getByRole('heading', {name: door, level: 2})).toBeVisible());
    expect(screen.getByText(/identifies the meaning, purpose, and structure/)).toBeVisible();
    expect(screen.getByText(/separation of HTML from CSS/)).toBeVisible();
    expect(screen.getByText(/a much livelier Web/)).toBeVisible();
  });

  test.each([
    ['Structure', 'HTML says what each thing on the page is: a heading, a list, a button, a form. Choose the element that means what the content is, and add the look and the behaviour on top of it.'],
    ['Presentation', 'CSS says how things look. Shared looks get shared class names, each component’s layout lives in its own sheet, and nothing is styled to say what the HTML already says.'],
    ['Dynamic Interaction', 'JavaScript says how things respond. The state is what is true right now, an event is what just happened, and the page is drawn from the two.']
  ])('should open the %s door with a plain line on what its language does', (door, line) => {
    expect(within(screen.getByRole('region', {name: door})).getByText(line.slice(0, 20), {exact: false})).toHaveTextContent(line);
  });

  test('the structure door tells how I organize structure', () => {
    const door = within(screen.getByRole('region', {name: 'Structure'}));

    expect(door.getByText('how I organize it')).toBeVisible();
    expect(door.getByRole('link', {name: 'search', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByRole('link', {name: 'output', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/a page built of divs gives them nothing to move by/)).toBeInTheDocument();
    expect(door.getByRole('link', {name: /No ARIA is better than bad ARIA/, hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/The test is to read the page with the styles turned off/)).toBeInTheDocument();
  });

  test('the presentation door tells how I organize presentation', () => {
    const door = within(screen.getByRole('region', {name: 'Presentation'}));

    expect(door.getByText('how I organize it')).toBeVisible();
    expect(door.getByRole('link', {name: 'custom property', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/Element selectors are used only in the reset/)).toBeInTheDocument();
    expect(door.getByText(/reads like a sentence/)).toBeInTheDocument();
    expect(door.getByText(/a pile of overrides/)).toBeInTheDocument();
    expect(door.getByText(/still read by a screen reader but unseen/)).toBeInTheDocument();
    expect(door.getByRole('link', {name: 'prefers-reduced-motion', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByRole('link', {name: 'appearance: base-select', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
  });

  test('the dynamic interaction door tells how I organize behaviour', () => {
    const door = within(screen.getByRole('region', {name: 'Dynamic Interaction'}));

    expect(door.getByText('how I organize it')).toBeVisible();
    expect(door.getByRole('link', {name: /operable through a keyboard interface/, hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('w3.org'));
    expect(door.getByText(/replacing it is the only way anything on screen changes/)).toBeInTheDocument();
    expect(door.getByText(/Not every event starts at the pointer/)).toBeInTheDocument();
    expect(door.getByText(/Change the framework, or remove it, and only the shell changes/)).toBeInTheDocument();
    expect(door.getByText(/The test is to read the state on its own/)).toBeInTheDocument();
  });

  test('should hold the opening, the three doors and a door to the record, in that order, and nothing else', () => {
    const sections = within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent);

    expect(screen.getByText(/^A webpage is three languages working in concert/)).toBeVisible();
    expect(sections).toEqual(['Structure', 'Presentation', 'Dynamic Interaction', 'The record']);
  });

  test('should list the record\'s thirteen moments in its door, year and title, in the record\'s order', () => {
    const moments = within(screen.getByRole('list', {name: 'the moments'})).getAllByRole('link');

    expect(moments.map(moment => moment.textContent)).toEqual([
      '1989 Someone needs something',
      '1990 Researchers need to collaborate',
      '1994 Authors need control of the look',
      '1994 Author and reader need a referee',
      '1995 Pages need to respond',
      '1996 The need outruns the standards',
      '1998 The browsers need to agree',
      '2003 The separation needs proof',
      '2004 The standard needs the real world',
      '2005 The page needs to update in place',
      '2013 Someone needs components',
      '2014 The philosophy needs writing down',
      '2016 The document needs to come first'
    ]);
  });

  test('should send the first moment and the second of 1994\'s two straight to their own places on the record\'s page', () => {
    const moments = within(screen.getByRole('list', {name: 'the moments'}));

    expect(moments.getByRole('link', {name: '1989 Someone needs something'})).toHaveAttribute('href', `${Paths.record}#someone-needs-something`);
    expect(moments.getByRole('link', {name: '1994 Author and reader need a referee'})).toHaveAttribute('href', `${Paths.record}#author-and-reader-need-a-referee`);
  });

  test('should lead to the record through a door of its own', () => {
    const door = screen.getByRole('region', {name: 'The record'});

    expect(within(door).getByText('How the web got the three languages: thirteen moments from 1989 on, each with its fuller story and its sources.')).toBeVisible();
    expect(within(door).getByRole('link', {name: 'read the record'})).toHaveAttribute('href', Paths.record);
  });
});
