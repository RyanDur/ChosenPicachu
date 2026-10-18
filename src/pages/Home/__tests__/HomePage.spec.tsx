import {itemHeadedBy} from '@__test_support/headed-item';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';

describe('the home page', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.home}/>);
  });

  test('should open on the thesis, then say who the site is for, then what the doors, the record and the demos give', () => {
    expect(screen.getByText(/^A webpage is three languages working in concert/)).toHaveTextContent('A webpage is three languages working in concert. HTML says what things are, CSS says how they show, and JavaScript says how they respond. They were designed apart, on purpose. When one could not yet do a job, another covered for it until the standard caught up, which is what HTML’s own principles ask: “consider adopting it rather than forbidding it or inventing something new”.');
    expect(screen.getByText(/^This site is for the developer/)).toHaveTextContent('This site is for the developer who has hit a bug on a page and wants to know what the platform meant. Many of us write one of the three languages well and the other two by habit, and the bug lives where the habit and the platform disagree. The habit is a div where a button was meant, a class that names a margin instead of the reason for it, a script that rebuilds what the browser already does: scrolling, focus, the back button. Each one works on the day it is written. The fix, when it stops working, is rarely more code. It is finding which language the job belonged to, and letting that language do it.');
    expect(screen.getByText(/^Each language has a door below/)).toHaveTextContent('Each language has a door below: what it is for, how I organize it, and the moments in the record where the web learned it. The record tells how the web got the three languages, in twenty moments and a closing essay. The demos are where I work the practice: five features built from this site’s own code and explained beside it. Two set the trick we used before the platform could do the job beside what it gives now, and the other three show what the platform does with no library at all.');
    expect(outOfReadingOrder([
      screen.getByText(/^A webpage is three languages working in concert/),
      screen.getByText(/^This site is for the developer/),
      screen.getByText(/^Each language has a door below/)
    ])).toEqual([]);
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
    expect(door.getByRole('link', {name: 'search'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByRole('link', {name: 'output'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/^I start from what the content is and pick the element for it/))
      .toHaveTextContent(/Semantic markup is the first objective listed in the 2014 moment\./);
    expect(door.getByText(/^The skeleton comes first/))
      .toHaveTextContent(/The landmark elements, header, main, footer and nav, come from the standard the browser makers began writing themselves in the 2004 moment\./);
    expect(door.getByText(/^The elements mean something beyond how they look/))
      .toHaveTextContent(/The 2013 moment records what that rebuilding cost: links became components and the back button became state\./);
    expect(door.getByText(/^A div is for when I want an element that says nothing/))
      .toHaveTextContent(/“of last resort, for when no other element is suitable”\. WebAIM’s survey found 71\.6 percent of screen reader users move through a long page by its headings, and a page built of divs gives them nothing to move by\./);
    expect(door.getByText(/^A div is for when I want an element that says nothing/))
      .toHaveTextContent(/The standard that calls a div a last resort is the one the browser makers wrote themselves, from the 2004 moment on\./);
    expect(door.getByRole('link', {name: /No ARIA is better than bad ARIA/}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/The test is to read the page with the styles turned off/)).toBeInTheDocument();
  });

  test('the presentation door tells how I organize presentation', () => {
    const door = within(screen.getByRole('region', {name: 'Presentation'}));

    expect(door.getByText('how I organize it')).toBeVisible();
    expect(door.getByRole('link', {name: 'custom properties'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByText(/Element selectors appear only in the reset\. There is no utility scale: lifted says why a style is there, and mt-4 says only what it does\. Markup full of utilities is the look written back into the structure\./)).toBeInTheDocument();
    expect(door.getByText(/Carried and settling use the same rules for a column and a row; only the lengths handed in differ\. Shoved has a rule per direction: two across for columns, two down for rows\./)).toBeInTheDocument();
    expect(door.getByText(/^Constants live in the stylesheet/))
      .toHaveTextContent(/Only values the code works out at runtime are written inline, mostly as custom properties the sheet already reads: a measured height, a position after a drag, the direction of a slide\./);
    expect(door.getByText(/^Constants live in the stylesheet/))
      .toHaveTextContent(/Custom properties are the 2013 moment’s lesson: theme variables started in script and now live in CSS\./);
    expect(door.getByText(/^The test is to read a class list on its own/))
      .toHaveTextContent(/Isolation, the last of the seven problems Chedeau’s talk lists \(the 2013 moment links the talk\), is what this test guards against\./);
    expect(door.getByText(/reads like a sentence/)).toBeInTheDocument();
    expect(door.getByText(/a pile of overrides/)).toBeInTheDocument();
    expect(door.getByText(/I can move a checkbox off screen, where a screen reader still reads it and no one sees it\. Its label then carries the design, and the checked state changes it\./)).toBeInTheDocument();
    expect(door.getByRole('link', {name: 'prefers-reduced-motion'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(door.getByRole('link', {name: 'appearance: base-select'}))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
  });

  test('the dynamic interaction door tells how I organize behaviour', () => {
    const door = within(screen.getByRole('region', {name: 'Dynamic Interaction'}));

    expect(door.getByText('how I organize it')).toBeVisible();
    expect(door.getByRole('link', {name: /operable through a keyboard interface/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org'));
    expect(door.getByText(/so I name them in the past tense: lifted, dropped, chosen\./)).toBeInTheDocument();
    expect(door.getByText(/I keep the state in one place, and replacing it is the only way anything on screen changes\./)).toBeInTheDocument();
    expect(door.getByText(/^Behaviour splits into what is true and what happened/))
      .toHaveTextContent(/AngularJS, in the 2010 moment, bound model and view both ways\. I keep one direction\./);
    expect(door.getByText(/^Not every event starts at the pointer/))
      .toHaveTextContent(/The 2005 moment is where that pattern got its name, Ajax, and became ordinary\./);
    expect(door.getByText(/so I test them on their own with no page involved\./)).toBeInTheDocument();
    expect(door.getByText(/The page announces each change too: a sighted reader watches the order change, and a screen reader user hears the same change read out\./)).toBeInTheDocument();
    expect(door.getByText(/Change the framework, or remove it, and only the shell changes/)).toBeInTheDocument();
    expect(door.getByText(/The test is to read the state on its own/)).toBeInTheDocument();
  });

  test('should hold the opening and the three languages, one after another, and nothing else', () => {
    const sections = within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent);

    expect(screen.getByText(/^A webpage is three languages working in concert/)).toBeVisible();
    expect(sections).toEqual(['Structure', 'Presentation', 'Dynamic Interaction']);
  });

  test.each([
    ['Structure', [
      '1989 CERN needs to share what it knows',
      '1990 The information needs one interface',
      '1991 The web needs collaborators',
      '1995 The browsers’ tags need a standard',
      '1996 The pages need to look the same',
      '2004 The standard needs the real world',
      '2013 Someone needs components',
      '2014 The rules need writing down',
      '2016 The document needs to come first'
    ]],
    ['Presentation', [
      '1994 Authors need control of the look',
      '1996 The pages need to look the same',
      '1996 The style sheet needs a standard',
      '1998 The browsers need to agree',
      '2002 Someone needs to go first',
      '2003 The separation needs proof',
      '2011 The specification needs its tests',
      '2013 Someone needs components'
    ]],
    ['Dynamic Interaction', [
      '1995 Pages need to respond',
      '1997 The language needs a standard',
      '2005 The page needs to update in place',
      '2009 The standard needs to move again',
      '2010 The application needs a frame',
      '2013 Someone needs components',
      '2016 The document needs to come first'
    ]]
  ] as const)('should list %s\'s moments from the record, in the record\'s order', (section, lines) => {
    const moments = within(screen.getByRole('list', {name: `${section}, from the record`})).getAllByRole('link');

    expect(moments.map(moment => moment.textContent)).toEqual(lines);
  });

  test('should send a moment\'s line straight to that moment on the record', () => {
    const presentation = within(screen.getByRole('list', {name: 'Presentation, from the record'}));

    expect(presentation.getByRole('link', {name: '1994 Authors need control of the look'})).toHaveAttribute('href', `${Paths.record}#authors-need-control-of-the-look`);
    expect(within(screen.getByRole('list', {name: 'Structure, from the record'})).getByRole('link', {name: '1995 The browsers’ tags need a standard'}))
      .toHaveAttribute('href', `${Paths.record}#the-browsers-tags-need-a-standard`);
  });

  test.each(['Structure', 'Presentation', 'Dynamic Interaction'])('should set %s\'s moments between its paragraph and how I organize it, and end them with the whole record', section => {
    const door = screen.getByRole('region', {name: section});
    const list = within(door).getByRole('list', {name: `${section}, from the record`});
    const wholeRecord = within(door).getByRole('link', {name: 'the whole record'});

    expect(within(door).getByRole('heading', {level: 3, name: 'from the record'})).toBeVisible();
    expect(wholeRecord).toHaveAttribute('href', Paths.record);
    expect(outOfReadingOrder([
      within(door).getByText(/^(HTML|CSS|JavaScript) says/),
      list,
      wholeRecord,
      within(door).getByRole('heading', {level: 3, name: 'how I organize it'})
    ])).toEqual([]);
  });

  test.each(['Structure', 'Presentation', 'Dynamic Interaction'])('should name %s\'s moments and its practice as regions of their own, the practice open', section => {
    const evidence = screen.getByRole('region', {name: `${section} from the record`});
    const practice = screen.getByRole('region', {name: `${section} how I organize it`});

    expect(within(evidence).getByRole('list', {name: `${section}, from the record`})).toBeVisible();
    within(practice).getAllByRole('paragraph').forEach(paragraph => expect(paragraph).toBeVisible());
  });

  test.each([
    ['Structure', ['2014 The rules need writing down', '2004 The standard needs the real world', '2013 Someone needs components', '2004 The standard needs the real world', '2016 The document needs to come first']],
    ['Presentation', ['1994 Authors need control of the look', '2003 The separation needs proof', '1996 The pages need to look the same', '2013 Someone needs components', '2013 Someone needs components']],
    ['Dynamic Interaction', ['2010 The application needs a frame', '2005 The page needs to update in place', '2010 The application needs a frame', '2013 Someone needs components', '2016 The document needs to come first']]
  ])('should rest %s\'s practice on its own moments, each citation naming the year of the moment it opens', (section, meant) => {
    const listed = within(screen.getByRole('list', {name: `${section}, from the record`}));
    const cited = within(screen.getByRole('region', {name: `${section} how I organize it`})).getAllByRole('link')
      .filter(link => (link.getAttribute('href') ?? '').startsWith(Paths.record))
      .map(link => [/\d{4}/.exec(link.textContent ?? '')?.[0], link.getAttribute('href')]);

    expect(cited).toEqual(meant.map(moment => [moment.slice(0, 4), listed.getByRole('link', {name: moment}).getAttribute('href')]));
  });
});

describe('a moment named in how I organize it', () => {
  test('should land the reader on that moment on the record, with focus there', async () => {
    render(<TestApp at={Paths.home}/>);

    await userEvent.click(within(screen.getByRole('region', {name: 'Structure how I organize it'})).getAllByRole('link', {name: '2016 moment'})[0]);

    await waitFor(() => expect(itemHeadedBy('the timeline', 'The document needs to come first')).toHaveFocus());
  });
});
