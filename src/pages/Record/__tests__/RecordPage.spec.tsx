import {TestApp} from '@__test_support/TestApp';
import {itemHeadedBy} from '@__test_support/headed-item';
import {render, screen, waitFor, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';

describe('the record', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test('should open on its title, then tell the record, then walk into the demos, then collect the research', () => {
    const title = screen.getByRole('heading', {name: 'The record', level: 1});
    const record = screen.getByRole('heading', {name: 'How the web got its languages', level: 2});
    const research = screen.getByRole('heading', {name: 'The research', level: 2});
    const demos = screen.getByRole('link', {name: /Start where the demos start/});

    expect(title.compareDocumentPosition(record) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(record.compareDocumentPosition(demos) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(demos.compareDocumentPosition(research) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(demos).toHaveAttribute('href', expect.stringContaining(Paths.demos));
  });

  test('should say, after the record, that the history above is the argument for keeping the seam visible', () => {
    const record = screen.getByRole('region', {name: 'How the web got its languages'});
    const seam = screen.getByText(/The projection is the difference/);

    expect(record.compareDocumentPosition(seam)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(seam).toHaveTextContent('The projection is the difference, and the history above is the argument for keeping the seam visible.');
  });

  test('the record says why the languages arrived', () => {
    const record = within(screen.getByRole('region', {name: 'How the web got its languages'}));
    expect(record.getByText(/a web of nodes in which the user can browse at will/)).toBeVisible();
    expect(record.getByText(/Tim Berners-Lee and Robert Cailliau/)).toBeVisible();
    expect(record.getByText(/Someone needed something/)).toBeVisible();
    expect(screen.getByText(/one sentence said fifteen ways/)).toBeVisible();
  });

  test('the timeline walks fifteen beats of the same need', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByRole('listitem')).toHaveLength(15);
    ['1989', '1990', '1991', '1995', '1996', '2003', '2004', '2005', '2013', '2014', '2016'].forEach(year =>
      expect(timeline.getAllByText(year).length).toBeGreaterThan(0));
    [/Someone needs something/, /Researchers need to collaborate/, /The web needs the public/, /Authors need control of the look/, /Author and reader need a referee/, /Pages need to respond/, /The browsers’ tags need a standard/, /The need outruns the standards/, /The browsers need to agree/, /The separation needs proof/, /The standard needs the real world/, /The page needs to update in place/, /Someone needs components/, /The philosophy needs writing down/, /The document needs to come first/]
      .forEach(beat => expect(timeline.getByRole('heading', {name: beat})).toBeVisible());
  });

  test('every beat opens into its fuller story, closed until asked', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByText('the fuller story')).toHaveLength(15);
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

  test.each([
    ['The web needs the public', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt', '“Collaborators welcome!”'],
    ['The browsers’ tags need a standard', 'https://www.rfc-editor.org/rfc/rfc1866', '“to distinguish it from the previous informal specifications”']
  ])('should tell %s, its fuller story quoting its source by a link', (title, source, quotation) => {
    const moment = itemHeadedBy('the timeline', title);

    expect(within(within(moment).getByRole('group')).getByRole('link', {name: quotation, hidden: true})).toHaveAttribute('href', source);
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

  test('should quote the CSS working group where the record tells of CSS3’s modules', () => {
    expect(screen.getByText(/module system, begun in 1999/)).toHaveTextContent('module system, begun in 1999 so the language could advance a piece at a time instead of as “a single monolithic specification”.');
    expect(screen.getByRole('link', {name: '“a single monolithic specification”'}))
      .toHaveAttribute('href', 'https://www.w3.org/TR/css-2023/');
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
});

describe('arriving at a moment on the record', () => {
  test('should take the keyboard to the moment the address names, so the next Tab starts there', async () => {
    render(<TestApp at={`${Paths.record}#the-document-needs-to-come-first`}/>);

    await screen.findByRole('heading', {name: 'The document needs to come first'});

    await waitFor(() => expect(itemHeadedBy('the timeline', 'The document needs to come first')).toHaveFocus());
  });

  test('should take the keyboard to a moment whose title carries an apostrophe', async () => {
    render(<TestApp at={`${Paths.record}#the-browsers-tags-need-a-standard`}/>);

    await screen.findByRole('heading', {name: 'The browsers’ tags need a standard'});

    await waitFor(() => expect(itemHeadedBy('the timeline', 'The browsers’ tags need a standard')).toHaveFocus());
  });
});
