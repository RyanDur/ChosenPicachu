import {TestApp} from '@test-support/TestApp';
import {render, screen, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';

describe('the home page', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.home}/>);
  });

  test('the page opens on the thesis', () => {
    expect(screen.getByText(/three languages working in concert/)).toBeVisible();
    expect(screen.getByText(/That argument is this whole site/)).toBeVisible();
  });

  test('the record says why the languages arrived', () => {
    const record = within(screen.getByRole('region', {name: 'How the web got its languages'}));
    expect(record.getByText(/a web of nodes in which the user can browse at will/)).toBeVisible();
    expect(record.getByText(/Tim Berners-Lee and Robert Cailliau/)).toBeVisible();
    expect(record.getByText(/Someone needed something/)).toBeVisible();
    expect(screen.getByText(/one sentence said thirteen ways/)).toBeVisible();
  });

  test('the timeline walks thirteen beats of the same need', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByRole('listitem')).toHaveLength(13);
    ['1989', '1990', '1995', '1996', '2003', '2004', '2005', '2013', '2014', '2016'].forEach(year =>
      expect(timeline.getAllByText(year).length).toBeGreaterThan(0));
    [/Someone needs something/, /Researchers need to collaborate/, /Authors need control of the look/, /Author and reader need a referee/, /Pages need to respond/, /The need outruns the standards/, /The browsers need to agree/, /The separation needs proof/, /The standard needs the real world/, /The page needs to update in place/, /Someone needs components/, /The philosophy needs writing down/, /The document needs to come first/]
      .forEach(beat => expect(timeline.getByRole('heading', {name: beat})).toBeVisible());
  });

  test('the page offers three doors, each named by its responsibility', () => {
    ['Structure', 'Presentation', 'Dynamic Interaction'].forEach(door =>
      expect(screen.getByRole('heading', {name: door, level: 2})).toBeVisible());
    expect(screen.getByText(/identifies the meaning, purpose, and structure/)).toBeVisible();
    expect(screen.getByText(/separation of HTML from CSS/)).toBeVisible();
    expect(screen.getByText(/a much livelier Web/)).toBeVisible();
  });

  test('every beat opens into its fuller story, closed until asked', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByText('the fuller story')).toHaveLength(13);
    const folds = timeline.getAllByRole('group');
    expect(folds.filter(fold => fold.hasAttribute('open'))).toHaveLength(0);
    [/Viola/, /Mocha/, /ham is to hamster/, /MULTICOL/, /Wired News/, /React in 2013/, /CSS-in-JS/, /Next\.js/, /island of behavior/, /WorldWideWeb/, /Self-ish/, /eczema/, /aural/, /namespaces/, /ill-fated ES4/, /Chedeau/, /Sylor-Miller/, /you’re screwed/, /40% helvetica/, /Fahrner/, /Enquire/, /dictatorship/, /WHATWG/, /Living Standard/, /real-world web developers/]
      .forEach(depth => expect(timeline.getAllByText(depth).length).toBeGreaterThan(0));
    expect(timeline.getByRole('link', {name: 'the essay', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('adaptivepath'));
    folds.forEach(story => {
      expect(within(story).getAllByRole('paragraph').length).toBeGreaterThanOrEqual(3);
    });
  });

  test("the beats' stories share one fold, so opening one closes the last", () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    timeline.getAllByRole('group').forEach(story => expect(story).toHaveAttribute('name', 'record'));
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
    expect(within(bibliography).getByRole('group', {hidden: true})).not.toHaveAttribute('open');
    const works = within(bibliography).getAllByRole('listitem', {hidden: true});
    expect(works.length).toBeGreaterThanOrEqual(25);
    works.forEach(work => expect(within(work).getAllByRole('link', {hidden: true}).length).toBeGreaterThan(0));
    const cited = within(bibliography).getAllByRole('link', {hidden: true}).map(link => link.getAttribute('href') ?? '');
    expect(cited.some(href => href.includes('w3.org/Style/LieBos2e'))).toBe(true);
    expect(cited.some(href => href.includes('web.archive.org'))).toBe(true);
    expect(cited.some(href => href.includes('w3.org/History/1989'))).toBe(true);
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
