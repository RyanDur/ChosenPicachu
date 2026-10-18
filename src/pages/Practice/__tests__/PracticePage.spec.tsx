import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {itemHeadedBy} from '@__test_support/headed-item';

const practice = (): HTMLElement => screen.getByRole('region', {name: 'how I organize it'});

const tabs = (): HTMLElement => screen.getByRole('navigation', {name: 'practice'});

const practices = [
  ['Structure', 'structure', /^I start from what the content is and pick the element for it/, /^The test is to read the page with the styles turned off/],
  ['Presentation', 'presentation', /^I write CSS in two kinds of sheet/, /^The test is to read a class list on its own/],
  ['Dynamic', 'dynamic', /^Behaviour splits into what is true and what happened/, /^The test is to read the state on its own/]
] as const;

describe('the practice page', () => {
  test('should open on Structure when no tab is named', async () => {
    render(<TestApp at={Paths.practice}/>);

    expect(await screen.findByRole('heading', {name: 'Practice Structure', level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: 'Structure', current: 'page'})).toBeInTheDocument();
  });

  test('should open a link saved under the old tab name, dynamic-interaction, on the Dynamic tab', async () => {
    render(<TestApp at={`${Paths.practice}?tab=dynamic-interaction`}/>);

    expect(await screen.findByRole('heading', {name: 'Practice Dynamic', level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: 'Dynamic', current: 'page'})).toBeInTheDocument();
  });

  test.each(['constructor', 'toString', '__proto__'])('should open on Structure when the address names %s, a word every object answers to', async word => {
    render(<TestApp at={`${Paths.practice}?tab=${word}`}/>);

    expect(await screen.findByRole('heading', {name: 'Practice Structure', level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: 'Structure', current: 'page'})).toBeInTheDocument();
  });

  test('should open on Structure, marked as the current tab, when the address names a tab the page does not have', async () => {
    render(<TestApp at={`${Paths.practice}?tab=behaviour`}/>);

    expect(await screen.findByRole('heading', {name: 'Practice Structure', level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: 'Structure', current: 'page'})).toBeInTheDocument();
  });

  test('should say above the tabs what each one holds', async () => {
    render(<TestApp at={Paths.practice}/>);
    const opener = await screen.findByText(/^Each tab below is one of the three concerns/);

    expect(opener).toHaveTextContent(
      'Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moments in the record that taught them, and the test that tells me a rule holds. The demos show the rules at work.');
    expect(opener.compareDocumentPosition(tabs()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test.each(practices)('should open the %s tab from its address, reading how I organize it from its first rule to its test', async (concern, param, firstRule, theTest) => {
    render(<TestApp at={`${Paths.practice}?tab=${param}`}/>);

    expect(await screen.findByRole('heading', {name: `Practice ${concern}`, level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: concern, current: 'page'})).toBeInTheDocument();
    expect(within(practice()).getByText(firstRule)).toBeInTheDocument();
    expect(within(practice()).getByText(theTest)).toBeInTheDocument();
  });

  test.each([
    ['Presentation', 'Structure', Paths.practice, /^I write CSS in two kinds of sheet/],
    ['Dynamic', 'Presentation', `${Paths.practice}?tab=presentation`, /^Behaviour splits into what is true and what happened/],
    ['Structure', 'Dynamic', `${Paths.practice}?tab=dynamic`, /^I start from what the content is and pick the element for it/]
  ])('should read %s’s practice when the reader picks its tab from %s', async (concern, _from, at, firstRule) => {
    render(<TestApp at={at}/>);

    await userEvent.click(within(tabs()).getByRole('link', {name: concern}));

    expect(await screen.findByRole('heading', {name: `Practice ${concern}`, level: 1})).toBeInTheDocument();
    expect(within(practice()).getByText(firstRule)).toBeInTheDocument();
  });

  test('the structure tab tells how I organize structure', async () => {
    render(<TestApp at={Paths.practice}/>);
    const concern = within(await screen.findByRole('region', {name: 'how I organize it'}));

    expect(concern.getByText('how I organize it')).toBeVisible();
    expect(concern.getByRole('link', {name: 'search'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(concern.getByRole('link', {name: 'output'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(concern.getByText(/^I start from what the content is and pick the element for it/))
      .toHaveTextContent(/Semantic markup is the first objective listed in the 2014 moment\./);
    expect(concern.getByText(/^The skeleton comes first/))
      .toHaveTextContent(/The landmark elements, header, main, footer and nav, come from the standard the browser makers began writing themselves in the 2004 moment\./);
    expect(concern.getByText(/^The elements mean something beyond how they look/))
      .toHaveTextContent(/The 2013 moment records what that rebuilding cost: links became components and the back button became state\./);
    expect(concern.getByText(/^A div is for when I want an element that says nothing/))
      .toHaveTextContent(/“of last resort, for when no other element is suitable”\. WebAIM’s survey found 71\.6 percent of screen reader users move through a long page by its headings, and a page built of divs gives them nothing to move by\./);
    expect(concern.getByText(/^A div is for when I want an element that says nothing/))
      .toHaveTextContent(/The standard that calls a div a last resort is the one the browser makers wrote themselves, from the 2004 moment on\./);
    expect(concern.getByRole('link', {name: /No ARIA is better than bad ARIA/}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(concern.getByText(/The test is to read the page with the styles turned off/)).toBeInTheDocument();
  });

  test('the presentation tab tells how I organize presentation', async () => {
    render(<TestApp at={`${Paths.practice}?tab=presentation`}/>);
    const concern = within(await screen.findByRole('region', {name: 'how I organize it'}));

    expect(concern.getByText('how I organize it')).toBeVisible();
    expect(concern.getByRole('link', {name: 'custom properties'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(concern.getByText(/Element selectors appear only in the reset\. There is no utility scale: lifted says why a style is there, and mt-4 says only what it does\. Markup full of utilities is the look written back into the structure\./)).toBeInTheDocument();
    expect(concern.getByText(/Carried and settling use the same rules for a column and a row; only the lengths handed in differ\. Shoved has a rule per direction: two across for columns, two down for rows\./)).toBeInTheDocument();
    expect(concern.getByText(/^Constants live in the stylesheet/))
      .toHaveTextContent(/Only values the code works out at runtime are written inline, mostly as custom properties the sheet already reads: a measured height, a position after a drag, the direction of a slide\./);
    expect(concern.getByText(/^Constants live in the stylesheet/))
      .toHaveTextContent(/Custom properties are the 2013 moment’s lesson: theme variables started in script and now live in CSS\./);
    expect(concern.getByText(/^The test is to read a class list on its own/))
      .toHaveTextContent(/This test guards isolation, the last of the seven problems in Chedeau’s talk; the concert quotes his list\.$/);
    expect(concern.getByText(/Element selectors appear only in the reset/))
      .toHaveTextContent(/The separation is the 1994 draft’s, and the Zen Garden in the 2003 moment shows what it is for\./);
    expect(concern.getByText(/reads like a sentence/)).toBeInTheDocument();
    expect(concern.getByText(/a pile of overrides/)).toBeInTheDocument();
    expect(concern.getByText(/I can move a checkbox off screen, where a screen reader still reads it and no one sees it\. Its label then carries the design, and the checked state changes it\./)).toBeInTheDocument();
    expect(concern.getByRole('link', {name: 'prefers-reduced-motion'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(concern.getByRole('link', {name: 'appearance: base-select'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
  });

  test('the dynamic tab tells how I organize behaviour', async () => {
    render(<TestApp at={`${Paths.practice}?tab=dynamic`}/>);
    const concern = within(await screen.findByRole('region', {name: 'how I organize it'}));

    expect(concern.getByText('how I organize it')).toBeVisible();
    expect(concern.getByRole('link', {name: /operable through a keyboard interface/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org'));
    expect(concern.getByText(/so I name them in the past tense: lifted, dropped, chosen\./)).toBeInTheDocument();
    expect(concern.getByText(/I keep the state in one place, and replacing it is the only way anything on screen changes\./)).toBeInTheDocument();
    expect(concern.getByText(/^Behaviour splits into what is true and what happened/))
      .toHaveTextContent(/AngularJS, in the 2010 moment, bound model and view both ways\. I keep one direction\./);
    expect(concern.getByText(/^Not every event starts at the pointer/))
      .toHaveTextContent(/The 2005 moment is where that pattern got its name, Ajax, and became ordinary\./);
    expect(concern.getByText(/so I test them on their own with no page involved\./)).toBeInTheDocument();
    expect(concern.getByText(/The page announces each change too: a sighted reader watches the order change, and a screen reader user hears the same change read out\./)).toBeInTheDocument();
    expect(concern.getByText(/Change the framework, or remove it, and only the shell changes/)).toBeInTheDocument();
    expect(concern.getByText(/The test is to read the state on its own/)).toBeInTheDocument();
  });

  test.each([
    ['Structure', Paths.practice, [['2014', `${Paths.record}#the-rules-need-writing-down`], ['2004', `${Paths.record}#the-standard-needs-the-real-world`], ['2013', `${Paths.record}#someone-needs-components`], ['2004', `${Paths.record}#the-standard-needs-the-real-world`], ['2016', `${Paths.record}#the-document-needs-to-come-first`]]],
    ['Presentation', `${Paths.practice}?tab=presentation`, [['1994', `${Paths.record}#authors-need-control-of-the-look`], ['2003', `${Paths.record}#the-separation-needs-proof`], ['1996', `${Paths.record}#the-pages-need-to-look-the-same`], ['2013', `${Paths.record}#someone-needs-components`]]],
    ['Dynamic', `${Paths.practice}?tab=dynamic`, [['2010', `${Paths.record}#the-application-needs-a-frame`], ['2005', `${Paths.record}#the-page-needs-to-update-in-place`], ['2010', `${Paths.record}#the-application-needs-a-frame`], ['2013', `${Paths.record}#someone-needs-components`], ['2016', `${Paths.record}#the-document-needs-to-come-first`]]]
  ] as const)('should rest %s’s practice on its own moments, each citation naming the year of the moment it opens', async (concern, at, meant) => {
    render(<TestApp at={at}/>);
    await screen.findByRole('heading', {name: `Practice ${concern}`, level: 1});

    const cited = within(practice()).getAllByRole('link')
      .filter(link => (link.getAttribute('href') ?? '').startsWith(Paths.record))
      .map(link => [/\d{4}/.exec(link.textContent ?? '')?.[0], link.getAttribute('href')]);

    expect(cited).toEqual(meant);
  });

  test('should land a moment link on its moment in the record, with focus there', async () => {
    render(<TestApp at={Paths.practice}/>);

    await userEvent.click(within(await screen.findByRole('region', {name: 'how I organize it'})).getAllByRole('link', {name: '2016 moment'})[0]);

    await waitFor(() => expect(itemHeadedBy('the timeline', 'The document needs to come first')).toHaveFocus());
  });
});
