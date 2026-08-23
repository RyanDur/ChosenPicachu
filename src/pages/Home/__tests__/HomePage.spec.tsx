import {screen, within} from '@testing-library/react';
import {renderWithMemoryRouter} from '@test-support';
import {Home} from '@pages/Home';
import {Paths} from '@pages/Paths';

describe('the home page', () => {
  beforeEach(() => renderWithMemoryRouter(Home, {path: Paths.home}));

  test('the web opens on its founding need', () => {
    expect(screen.getAllByText(/a web of nodes in which the user can browse at will/)[0]).toBeVisible();
    expect(screen.getAllByText(/Tim Berners-Lee and Robert Cailliau/)[0]).toBeVisible();
    expect(screen.getByText(/three languages working in concert/)).toBeVisible();
    expect(screen.getByText(/The history below is the evidence/)).toBeVisible();
  });

  test('the timeline walks the drift and the correction', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByRole('listitem')).toHaveLength(14);
    ['1989', '1990', '1995', '1996', '2003', '2004', '2005', '2013', '2014', '2016', 'Today'].forEach(year =>
      expect(timeline.getAllByText(year).length).toBeGreaterThan(0));
    [/Someone needs something/, /Presentation leaves home/, /The cascade settles it/, /The languages blur/, /The garden proves it/, /says it out loud/, /becomes an application/, /The blur returns/, /The document comes back/, /take the pen/, /carries it on/]
      .forEach(beat => expect(timeline.getByRole('heading', {name: beat})).toBeVisible());
  });

  test('three doors, each named by its responsibility', () => {
    ['Structure', 'Presentation', 'Dynamic Interaction'].forEach(door =>
      expect(screen.getByRole('heading', {name: door, level: 2})).toBeVisible());
    expect(screen.getByText(/identifies the meaning, purpose, and structure/)).toBeVisible();
    expect(screen.getByText(/separation of HTML from CSS/)).toBeVisible();
    expect(screen.getByText(/a much livelier Web/)).toBeVisible();
  });

  test('every beat opens into its fuller story, closed until asked', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByText('the fuller story')).toHaveLength(14);
    expect(document.querySelectorAll('.timeline details[open]')).toHaveLength(0);
    [/Viola/, /Mocha/, /ham is to hamster/, /MULTICOL/, /Wired News/, /React in 2013/, /CSS-in-JS/, /Next\.js/, /island of behavior/, /the projection is the difference/, /WorldWideWeb/, /Self-ish/, /eczema/, /aural/, /namespaces/, /ill-fated ES4/, /Chedeau/, /Sylor-Miller/, /you’re screwed/, /40% helvetica/, /Fahrner/, /Enquire/, /dictatorship/, /WHATWG/, /Living Standard/, /real-world web developers/]
      .forEach(depth => expect(timeline.getAllByText(depth).length).toBeGreaterThan(0));
    expect(timeline.getByRole('link', {name: 'the essay', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('adaptivepath'));
    document.querySelectorAll('.timeline .fuller-story').forEach(story =>
      expect(story.querySelectorAll('.paragraph').length).toBeGreaterThanOrEqual(3));
  });

  test('the history cites its sources', () => {
    expect(screen.getByRole('link', {name: /proposing the WorldWideWeb/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/History'));
    expect(screen.getByRole('link', {name: /drafted Cascading HTML Style Sheets/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/People/howcome'));
    expect(screen.getByRole('link', {name: /never become a page-description language/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/Style/LieBos2e'));
    expect(screen.getByRole('link', {name: /the Acid Test/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/Style/CSS/Test'));
    expect(screen.getByRole('link', {name: /one HTML document/}))
      .toHaveAttribute('href', expect.stringContaining('csszengarden.com'));
    expect(screen.getByRole('link', {name: /wrote the interpreter in about ten days/}))
      .toHaveAttribute('href', expect.stringContaining('auth0.com'));
    expect(screen.getByRole('link', {name: /reducing the overlap/}))
      .toHaveAttribute('href', expect.stringContaining('html.com/html5'));
  });

  test('the research stands collected, closed until asked', () => {
    const bibliography = screen.getByRole('region', {name: 'bibliography'});

    expect(within(bibliography).getByRole('heading', {name: 'The research'})).toBeVisible();
    expect(bibliography.querySelector('details[open]')).toBeNull();
    const works = bibliography.querySelectorAll('.work');
    expect(works.length).toBeGreaterThanOrEqual(25);
    works.forEach(work => expect(work.querySelector('a.signpost')).not.toBeNull());
    expect(bibliography.querySelector('a[href*="w3.org/Style/LieBos2e"]')).not.toBeNull();
    expect(bibliography.querySelector('a[href*="web.archive.org"]')).not.toBeNull();
    expect(bibliography.querySelector('a[href*="w3.org/History/1989"]')).not.toBeNull();
  });

  test('each door and the closing walk into the demos', () => {
    const doorways = screen.getAllByRole('link', {name: 'the demos'});
    expect(doorways).toHaveLength(3);
    doorways.forEach(doorway =>
      expect(doorway).toHaveAttribute('href', expect.stringContaining(Paths.demos)));
    expect(screen.getByRole('link', {name: /Start where the demos start/}))
      .toHaveAttribute('href', expect.stringContaining(Paths.demos));
  });
});
