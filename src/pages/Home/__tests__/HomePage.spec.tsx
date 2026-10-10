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

  test('the structure door tells how I organize structure', () => {
    const door = within(screen.getByRole('region', {name: 'Structure'}));

    expect(door.getByText('how I organize it')).toBeVisible();
    expect(door.getByRole('link', {name: 'search', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByRole('link', {name: 'output', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/invisible to a screen reader/)).toBeInTheDocument();
    expect(door.getByText(/nothing to navigate by/)).toBeInTheDocument();
    expect(door.getByRole('link', {name: /No ARIA is better than bad ARIA/, hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/reading the markup with the styles off/)).toBeInTheDocument();
  });

  test('the presentation door tells how I organize presentation', () => {
    const door = within(screen.getByRole('region', {name: 'Presentation'}));

    expect(door.getByText('how I organize it')).toBeVisible();
    expect(door.getByRole('link', {name: 'custom property', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/Tag selectors are for resets only/)).toBeInTheDocument();
    expect(door.getByText(/reads like a sentence/)).toBeInTheDocument();
    expect(door.getByText(/a bag of overrides/)).toBeInTheDocument();
    expect(door.getByText(/spoken but unseen/)).toBeInTheDocument();
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
    expect(door.getByText(/events in, state change, projection out/)).toBeInTheDocument();
    expect(door.getByText(/Not every event starts at the pointer/)).toBeInTheDocument();
    expect(door.getByText(/swap the framework, or drop it entirely/)).toBeInTheDocument();
    expect(door.getByText(/reading the state cold/)).toBeInTheDocument();
  });

  test('should hold the opening, the three doors and a door to the record, in that order, and nothing else', () => {
    const sections = within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent);

    expect(screen.getByText(/^A webpage is three languages working in concert/)).toBeVisible();
    expect(sections).toEqual(['Structure', 'Presentation', 'Dynamic Interaction', 'The record']);
    expect(screen.queryByRole('heading', {name: 'How the web got its languages'})).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: 'The research'})).not.toBeInTheDocument();
  });

  test('should lead to the record through a door of its own', () => {
    const door = screen.getByRole('region', {name: 'The record'});

    expect(within(door).getByText('How the web got the three languages: thirteen moments from 1989 on, each with its fuller story and its sources.')).toBeVisible();
    expect(within(door).getByRole('link', {name: 'read the record'})).toHaveAttribute('href', Paths.record);
  });
});
