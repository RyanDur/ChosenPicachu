import {render} from '@testing-library/react';
import {appAddress} from '@__test_support/address';
import {site} from '@pages/__test_support';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {britishSpellingsOnThePage} from '@__test_support/spelling';

const appContinuum = 'https://www.appcontinuum.io/';
const utilityFirst = 'https://v3.tailwindcss.com/docs/utility-first';

const practices = [
  ['Structure', 'structure', /^I start from what the content is and pick the element for it/, /^The test is to read the page with the styles turned off/],
  ['Presentation', 'presentation', /^I write CSS in two kinds of sheet/, /^The test is to read a class list on its own/],
  ['Behavior', 'behavior', /^Behavior splits into what is true and what happened/, /^The test is to read the state on its own/]
] as const;

describe('the practice page', () => {
  test.each(practices)('should spell the %s tab\'s prose the American way', async (concern, tab) => {
    render(<TestApp at={practiceAt(tab)}/>);
    await practicePage.arrivedOn(concern);

    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should open on Structure, at its own address, when no tab is named', async () => {
    render(<TestApp at={Paths.practice}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test.each(['structure', 'presentation', 'behavior'])('should send a link saved as ?tab=%s to that tab\'s own address', async tab => {
    render(<TestApp at={`${Paths.practice}?tab=${tab}`}/>);

    expect(await appAddress.movedOnFrom(`${Paths.practice}?tab=${tab}`)).toBe(practiceAt(tab));
  });

  test('should be no such room at a tab the page does not have', async () => {
    render(<TestApp at={practiceAt('interaction')}/>);

    expect(await site.pageTitled()).toHaveTextContent('No such room');
  });

  test('should link each tab to its own address', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.tabAddresses()).toEqual(['structure', 'presentation', 'behavior'].map(practiceAt));
  });

  test.each(['dynamic', 'dynamic-interaction'])('should open a link saved under the old tab name, %s, on the Behavior tab', async former => {
    render(<TestApp at={`${Paths.practice}?tab=${former}`}/>);

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
    expect(appAddress.shown()).toBe(practiceAt('behavior'));
  });

  test.each(['constructor', 'toString', '__proto__'])('should open on Structure when the address names %s, a word every object answers to', async word => {
    render(<TestApp at={`${Paths.practice}?tab=${word}`}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should open on Structure, marked as the current tab, when an old address names a tab the page does not have', async () => {
    render(<TestApp at={`${Paths.practice}?tab=interaction`}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should say above the tabs what each one holds, and that one principle runs through all three', async () => {
    render(<TestApp at={Paths.practice}/>);
    const opener = await practicePage.opener();

    expect(opener).toHaveTextContent(
      'Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moments in the Record that taught them, and the test that tells me a rule holds. The demos show the rules at work. One principle runs through all three, and it is worth saying once before the tabs apply it.');
    expect(practicePage.comesBeforeTheTabs(opener)).toBe(true);
  });

  test('should say the principle before the tabs: the code says what it means, for the reader who was not there', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();
    const principle = practicePage.openingParagraph(/^Code is read more often than it is written/);

    expect(principle).toHaveTextContent(
      'Code is read more often than it is written, and the reader is usually someone who was not there, including me a year on. So I organize for the reader: the code says what it means. An element says what the thing is, and when no element does, I make one and name it for the one behavior it adds. A class says what the element is, what it needs, or what is true right now, and the number lives in the sheet under a name. An event says what happened, in the past tense; a type says what is true and refuses what cannot be; a condition reads as a sentence, has, not, empty, the same words the sheet uses in :has(), :not() and :is(). Files sit by feature too, the way the App Continuum lays them out, so a change to the gallery is in the gallery; its authors put it plainly: “Naming, organizing, and reducing circular dependencies are the three most important things you’ll ever do as a programmer”.');
    expect(practicePage.comesBeforeTheTabs(principle)).toBe(true);
  });

  test('should give Tailwind’s case in its own words before answering it, before the tabs', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();
    const trade = practicePage.openingParagraph(/^Tailwind makes the other case/);

    expect(trade).toHaveTextContent(
      'Tailwind makes the other case, and it is worth reading in its own words: “You aren’t wasting energy inventing class names”. A name is a cost, so stop paying it, and the CSS stops growing and changes feel safer because a class is local. I think the energy is not wasted; it is the writer paying once what every reader would otherwise pay each time. Tailwind names its own cost, “managing commonly repeated utility combinations”, and that cost is the name not given, coming due later. Where I agree with Tailwind is real (compose a look from shared pieces, constrain the values, no abstraction before the second use; the Presentation tab says where). Where I part is the name. shadow-md p-4 flex tells a reader who knows the system what the element looks like; lifted padded rounded-corners tells any reader what it needs, and the next reader is who the name is for.');
    expect(practicePage.comesBeforeTheTabs(trade)).toBe(true);
  });

  test('should set the two class lists Tailwind’s case is answered with as code', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();

    expect(practicePage.codeIn(/^Tailwind makes the other case/)).toEqual(['shadow-md p-4 flex', 'lifted padded rounded-corners']);
  });

  test('should link the App Continuum, and each quotation from it, to the Continuum', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();

    expect(practicePage.linksIn(/^Code is read more often than it is written/)).toEqual([
      ['the App Continuum', appContinuum],
      ['“Naming, organizing, and reducing circular dependencies are the three most important things you’ll ever do as a programmer”', appContinuum]
    ]);
  });

  test('should link each quotation from Tailwind to its Utility-First Fundamentals', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();

    expect(practicePage.linksIn(/^Tailwind makes the other case/)).toEqual([
      ['“You aren’t wasting energy inventing class names”', utilityFirst],
      ['“managing commonly repeated utility combinations”', utilityFirst]
    ]);
  });

  test.each(practices)('should open the %s tab from its address, reading how I organize it from its first rule to its test', async (concern, param, firstRule, theTest) => {
    render(<TestApp at={practiceAt(param)}/>);

    expect(await practicePage.arrivedOn(concern)).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe(concern);
    expect(practicePage.paragraph(firstRule)).toBeInTheDocument();
    expect(practicePage.paragraph(theTest)).toBeInTheDocument();
  });

  test.each([
    ['Presentation', 'Structure', practiceAt('structure'), /^I write CSS in two kinds of sheet/],
    ['Behavior', 'Presentation', practiceAt('presentation'), /^Behavior splits into what is true and what happened/],
    ['Structure', 'Behavior', practiceAt('behavior'), /^I start from what the content is and pick the element for it/]
  ])('should read %s’s practice when the reader picks its tab from %s', async (concern, _from, at, firstRule) => {
    render(<TestApp at={at}/>);

    await practicePage.pickTab(concern);

    expect(await practicePage.arrivedOn(concern)).toBeInTheDocument();
    expect(practicePage.paragraph(firstRule)).toBeInTheDocument();
  });

  test('the structure tab tells how I organize structure', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.heading()).toBeVisible();
    expect(practicePage.link('search'))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(practicePage.link('output'))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(practicePage.paragraph(/^I start from what the content is and pick the element for it/))
      .toHaveTextContent(/Semantic markup is the first objective listed in the 2014 moment\./);
    expect(practicePage.paragraph(/^The skeleton comes first/))
      .toHaveTextContent(/The landmark elements, header, main, footer and nav, come from the standard the browser makers began writing themselves in the 2004 moment\./);
    expect(practicePage.paragraph(/^The elements mean something beyond how they look/))
      .toHaveTextContent(/The 2013 moment records what that rebuilding cost: links became components and the back button became state\./);
    expect(practicePage.paragraph(/^A div is for when I want an element that says nothing/))
      .toHaveTextContent(/“of last resort, for when no other element is suitable”\. WebAIM’s survey found 71\.6 percent of screen reader users move through a long page by its headings, and a page built of divs gives them nothing to move by\./);
    expect(practicePage.paragraph(/^A div is for when I want an element that says nothing/))
      .toHaveTextContent(/The standard that calls a div a last resort is the one the browser makers wrote themselves, from the 2004 moment on\./);
    expect(practicePage.link(/No ARIA is better than bad ARIA/))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(practicePage.paragraph(/The test is to read the page with the styles turned off/)).toBeInTheDocument();
  });

  test('the presentation tab tells how I organize presentation', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.heading()).toBeVisible();
    expect(practicePage.link('custom properties'))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(practicePage.paragraph(/Element selectors appear only in the reset\. There is no utility scale: lifted says why a style is there, and mt-4 says only what it does\. Markup full of utilities is the look written back into the structure\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/Carried and settling use the same rules for a column and a row; only the lengths handed in differ\. Shoved has a rule per direction: two across for columns, two down for rows\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/^Constants live in the stylesheet/))
      .toHaveTextContent(/Only values the code works out at runtime are written inline, mostly as custom properties the sheet already reads: a measured height, a position after a drag, the direction of a slide\./);
    expect(practicePage.paragraph(/^Constants live in the stylesheet/))
      .toHaveTextContent(/Custom properties are the 2013 moment’s lesson: theme variables started in script and now live in CSS\./);
    expect(practicePage.paragraph(/^The test is to read a class list on its own/))
      .toHaveTextContent(/This test guards isolation, the last of the seven problems in Chedeau’s talk; the concert quotes his list\.$/);
    expect(practicePage.paragraph(/Element selectors appear only in the reset/))
      .toHaveTextContent(/The separation is the 1994 draft’s, and the Zen Garden in the 2003 moment shows what it is for\./);
    expect(practicePage.paragraph(/reads like a sentence/)).toBeInTheDocument();
    expect(practicePage.paragraph(/a pile of overrides/)).toBeInTheDocument();
    expect(practicePage.paragraph(/I can move a checkbox off screen, where a screen reader still reads it and no one sees it\. Its label then carries the design, and the checked state changes it\./)).toBeInTheDocument();
    expect(practicePage.link('prefers-reduced-motion'))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(practicePage.link('appearance: base-select'))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
  });

  test('should tell how I organize behavior on the Behavior tab', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.heading()).toBeVisible();
    expect(practicePage.link(/operable through a keyboard interface/))
      .toHaveAttribute('href', expect.stringContaining('w3.org'));
    expect(practicePage.paragraph(/so I name them in the past tense: lifted, dropped, chosen\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/I keep the state in one place, and replacing it is the only way anything on screen changes\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/^Behavior splits into what is true and what happened/))
      .toHaveTextContent(/AngularJS, in the 2010 moment, bound model and view both ways\. I keep one direction\./);
    expect(practicePage.paragraph(/^Not every event starts at the pointer/))
      .toHaveTextContent(/The 2005 moment is where that pattern got its name, Ajax, and became ordinary\./);
    expect(practicePage.paragraph(/so I test them on their own with no page involved\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/The page announces each change too: a sighted reader watches the order change, and a screen reader user hears the same change read out\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/Change the framework, or remove it, and only the shell changes/)).toBeInTheDocument();
    expect(practicePage.paragraph(/The test is to read the state on its own/)).toBeInTheDocument();
  });

  test.each([
    ['Structure', Paths.practice, [['2014', `${Paths.record}#the-rules-need-writing-down`], ['2004', `${Paths.record}#the-standard-needs-the-real-world`], ['2013', `${Paths.record}#someone-needs-components`], ['2004', `${Paths.record}#the-standard-needs-the-real-world`], ['2016', `${Paths.record}#the-document-needs-to-come-first`]]],
    ['Presentation', practiceAt('presentation'), [['1994', `${Paths.record}#authors-need-control-of-the-look`], ['2003', `${Paths.record}#the-separation-needs-proof`], ['1996', `${Paths.record}#the-pages-need-to-look-the-same`], ['2013', `${Paths.record}#someone-needs-components`]]],
    ['Behavior', practiceAt('behavior'), [['2010', `${Paths.record}#the-application-needs-a-frame`], ['2005', `${Paths.record}#the-page-needs-to-update-in-place`], ['2010', `${Paths.record}#the-application-needs-a-frame`], ['2013', `${Paths.record}#someone-needs-components`], ['2016', `${Paths.record}#the-document-needs-to-come-first`]]]
  ] as const)('should rest %s’s practice on its own moments, each citation naming the year of the moment it opens', async (concern, at, meant) => {
    render(<TestApp at={at}/>);
    await practicePage.arrivedOn(concern);

    expect(practicePage.citations()).toEqual(meant);
  });
});
