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
    expect(screen.getByText(/The history below is the iteration/)).toBeVisible();
  });

  test('the timeline walks the iteration', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByRole('listitem')).toHaveLength(13);
    ['1989', '1990', '1995', '1996', '2003', '2004', '2005', '2013', '2014', '2016'].forEach(year =>
      expect(timeline.getAllByText(year).length).toBeGreaterThan(0));
    [/Someone needs something/, /Researchers need to collaborate/, /Authors need control of the look/, /Author and reader need a referee/, /Pages need to respond/, /The need outruns the standards/, /The browsers need to agree/, /The separation needs proof/, /The standard needs the real world/, /The page needs to update in place/, /Someone needs components/, /The philosophy needs writing down/, /The document needs to come first/]
      .forEach(beat => expect(timeline.getByRole('heading', {name: beat})).toBeVisible());
    expect(screen.getByText(/one sentence said thirteen ways/)).toBeVisible();
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

    expect(timeline.getAllByText('the fuller story')).toHaveLength(13);
    expect(document.querySelectorAll('.timeline details[open]')).toHaveLength(0);
    [/Viola/, /Mocha/, /ham is to hamster/, /MULTICOL/, /Wired News/, /React in 2013/, /CSS-in-JS/, /Next\.js/, /island of behavior/, /WorldWideWeb/, /Self-ish/, /eczema/, /aural/, /namespaces/, /ill-fated ES4/, /Chedeau/, /Sylor-Miller/, /you’re screwed/, /40% helvetica/, /Fahrner/, /Enquire/, /dictatorship/, /WHATWG/, /Living Standard/, /real-world web developers/]
      .forEach(depth => expect(timeline.getAllByText(depth).length).toBeGreaterThan(0));
    expect(timeline.getByRole('link', {name: 'the essay', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('adaptivepath'));
    document.querySelectorAll('.timeline .fuller-story').forEach(story => {
      expect(story).toHaveAttribute('name', 'record');
      expect(story.querySelectorAll('.paragraph').length).toBeGreaterThanOrEqual(3);
    });
  });

  test('the structure door folds open how I organize it, ungrouped', () => {
    const door = within(screen.getByRole('region', {name: 'Structure'}));

    const fold = door.getByRole('group', {hidden: true});
    expect(fold).not.toHaveAttribute('name');
    expect(door.getByText('how I organize it')).toBeVisible();
    expect(door.getByRole('link', {name: 'search', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByRole('link', {name: 'output', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/invisible to a screen reader/)).toBeInTheDocument();
    expect(door.getByText(/nothing to navigate by/)).toBeInTheDocument();
    expect(door.getByRole('link', {name: /No ARIA is better than bad ARIA/, hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/reading it with the styles off/)).toBeInTheDocument();
  });

  test('the presentation door folds open how I organize it, ungrouped', () => {
    const door = within(screen.getByRole('region', {name: 'Presentation'}));

    const fold = door.getByRole('group', {hidden: true});
    expect(fold).not.toHaveAttribute('name');
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
    const bibliography = screen.getByRole('region', {name: 'The research'});

    expect(within(bibliography).getByRole('heading', {name: 'The research'})).toBeVisible();
    expect(bibliography.querySelector('details[open]')).toBeNull();
    const works = bibliography.querySelectorAll('.work');
    expect(works.length).toBeGreaterThanOrEqual(25);
    works.forEach(work => expect(work.querySelector('a.signpost')).not.toBeNull());
    expect(bibliography.querySelector('a[href*="w3.org/Style/LieBos2e"]')).not.toBeNull();
    expect(bibliography.querySelector('a[href*="web.archive.org"]')).not.toBeNull();
    expect(bibliography.querySelector('a[href*="w3.org/History/1989"]')).not.toBeNull();
  });

  test('the doors define before the history argues, and the closing walks in', () => {
    const doors = screen.getByRole('heading', {name: 'Structure', level: 2});
    const record = screen.getByRole('heading', {name: 'How the web got its languages'});
    expect(doors.compareDocumentPosition(record) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText(/The projection is the difference/)).toBeVisible();
    expect(screen.getByRole('link', {name: /Start where the demos start/}))
      .toHaveAttribute('href', expect.stringContaining(Paths.demos));
  });
});
