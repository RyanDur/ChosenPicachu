import {render} from '@testing-library/react';
import {appAddress} from '@__test_support/address';
import {site} from '@pages/__test_support';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {britishSpellingsOnThePage} from '@__test_support/spelling';
import {outOfReadingOrder} from '@__test_support/reading-order';

const appContinuum = 'https://www.appcontinuum.io/';

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

  test('should say what each tab holds, and that one principle runs through all three', async () => {
    render(<TestApp at={Paths.practice}/>);
    const opener = await practicePage.opener();

    expect(opener).toHaveTextContent(
      'Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moments in the Record that taught them, and the test that tells me a rule holds. The demos show the rules at work. One principle runs through all three, and it is worth saying once before the tabs apply it.');
  });

  test('should say the principle: the code says what it means, for the reader who was not there', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();
    const principle = practicePage.openingParagraph(/^Code is read more often than it is written/);

    expect(principle).toHaveTextContent(
      'Code is read more often than it is written, and the reader is usually someone who was not there, including me when I come back to it. So I organize for the reader: the code says what it means. An element says what the thing is. When no element does, I make one and name it for the one behavior it adds. A class says what the element is, what it needs, or what is true right now, and the sheet says what that means today. An event says what happened, in the past tense. A type says what is true and refuses what cannot be. A condition reads as a sentence, has, not, empty, the same words the sheet uses in :has(), :not() and :empty. Files sit by feature too, so a change to the gallery is in the gallery. The Application Continuum, a guide to organizing an application as it grows, lays files out that way. It ranks the work plainly: “Naming, organizing, and reducing circular dependencies are the three most important things you’ll ever do as a programmer”.');
  });

  test('should open on two paragraphs, what the tabs hold and the principle, and nothing more before the tabs', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();

    expect(practicePage.beforeTheTabs()).toEqual([
      expect.stringMatching(/^Each tab below is one of the three concerns/),
      expect.stringMatching(/^Code is read more often than it is written/)
    ]);
  });

  test('should link the Application Continuum, and the quotation from it, to the Continuum', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();

    expect(practicePage.linksIn(/^Code is read more often than it is written/)).toEqual([
      ['The Application Continuum', appContinuum],
      ['“Naming, organizing, and reducing circular dependencies are the three most important things you’ll ever do as a programmer”', appContinuum]
    ]);
  });

  test.each([
    ['Structure', 'structure', 'The element is the name. It tells the browser, a screen reader and the next developer at once what the thing is, so I choose it first and make a new one only for a behavior that has no element.'],
    ['Presentation', 'presentation', 'A class is a name for what the element is, what it needs or what is true right now; the value it stands for lives in the sheet, so the name still fits when the value changes.'],
    ['Behavior', 'behavior', 'An event is a name for what happened. The state’s type is a name for what is true, and it refuses what cannot be. So the code reads as sentences to the next reader, who was not there when it was written.']
  ] as const)('should follow the %s tab’s first paragraph with the principle applied to it', async (concern, param, applied) => {
    render(<TestApp at={practiceAt(param)}/>);
    await practicePage.arrivedOn(concern);

    expect(practicePage.paragraphs()[1]).toBe(applied);
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

  test('should tell presentation in its paragraphs, in order, from the two kinds of sheet to the test', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.paragraphs()).toEqual([
      'I write CSS in two kinds of sheet. A component’s sheet holds its structure, the grid and placement of that one component, named for it and kept beside it. The site’s shared sheets hold the looks every component draws on, as a vocabulary of small classes: lifted, padded, rounded-corners, muted-ink, attentive. A class like that is a utility: one look, under one name, that any element can wear. An element is dressed by naming its needs, and no new rule is written. Element selectors appear only in the reset. The separation is the 1994 draft’s.',
      'A class is a name for what the element is, what it needs or what is true right now; the value it stands for lives in the sheet, so the name still fits when the value changes.',
      'Utilities are where I agree with Adam Wathan, who made Tailwind: compose a look from a shared set of pieces rather than write it again, and choose every value from a constrained set, so the design stays consistent as the site grows. Where I part from Tailwind is what a utility is named for, and Tailwind states its side plainly: “You aren’t wasting energy inventing class names”. A name is a cost, so stop paying it, and the CSS stops growing. I think the energy is not wasted; it is the writer paying once what every reader would otherwise pay each time. Tailwind’s shadow-md and p-4 name the value, so a reader who knows the system sees what the element looks like, and a change of design is a change to every element. Mine name the need: lifted says why the style is there, and the sheet says what lifted means today, through a token, a named value such as --light-box-shadow that every rule reads instead of writing the number. Change the token and every lifted element follows; the markup never knew the number. That keeps the sheet restyleable, which is what the Zen Garden in the 2003 moment showed the separation is for, and it keeps the constraint where Wathan wants it, in one place.',
      'BEM, Yandex’s method, sits between the two. It divides a user interface into independent blocks, each with its own sheet, and names every part and every variant through its block: card__title, card_lifted in Yandex’s own spelling, card--lifted as most teams write it. I keep the block and its sheet, and the flat specificity that comes with one class per rule. What I give up is the scoping of looks. In BEM, lifted on a card and lifted on a menu are two modifiers and two rules, so nothing is shared by accident and the same look is written twice. Mine is one word any block can wear. BEM also has no separate idea of a state: --open and --large are both modifiers. I split them, because the platform already names most states, so :hover needs no class where card--hovered does. BEM takes the independent block and gives up sharing. Tailwind takes sharing and gives up restyling. I take both, and pay with a vocabulary that has to be kept, and a lint rule that holds it.',
      'A class list reads left to right: nouns, then needs, then states.',
      'The nouns say what the element is: cell and header-cell name a part of the table, and the table’s own sheet, kept beside it, says how that part is laid out. The needs say what the element asks of the design: muted-bar-below and focus-ringed are words from the shared sheets, each resolved through a token, so the sheet decides what a muted bar or a focus ring is today and every element that asks for one follows. The states say what is true right now. The platform already names most of them, such as :hover, :focus, invalid and checked, so the sheet uses those pseudo-classes and no class is written. I add a state name only where the platform has no word: carried for the column being dragged, settling for the one sliding back into place, shoved for a neighbor pushed aside. One sheet, the table’s, says what each does. Carried and settling use the same rules for a column and a row; only the lengths handed in differ. Shoved has a rule per direction: two across for columns, two down for rows.',
      'Presentation has duties of its own. Motion is a preference the reader can set, so the sheet checks prefers-reduced-motion before it animates. Grid and flex can change the order the eye sees without changing the order a keyboard moves through, so the HTML keeps the meaningful sequence and the sheet only changes the picture.',
      'Workarounds go away as the platform catches up. I can move a checkbox off screen, where a screen reader still reads it and no one sees it. Its label then carries the design, and the checked state changes it. Select options had no such way round, and now they need none: they can be styled with appearance: base-select in Chromium, and a browser without it will “fall back to a classic select experience”. That is the record’s pattern since the 1996 moment: a workaround, and then the platform.',
      'Constants live in the sheet, as tokens. Only values the code works out at runtime are written inline, mostly as custom properties the sheet already reads: a measured height, a position after a drag, the direction of a slide. Every size is a multiple of one base, and every color is a named token on the root. Custom properties are the 2013 moment’s lesson: theme variables started in script and now live in CSS.',
      'The test is to read a class list on its own. If it does not say what the element is and what it needs, in the names the design uses, the sheet has become a pile of overrides. This test guards isolation, the last of the seven problems in Chedeau’s talk; the concert quotes his list.'
    ]);
  });

  test('should send Wathan’s case, Tailwind’s own words and Yandex’s method to their sources', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.link('compose a look from a shared set of pieces rather than write it again')).toHaveAttribute('href', 'https://adamwathan.me/css-utility-classes-and-separation-of-concerns/');
    expect(practicePage.link('“You aren’t wasting energy inventing class names”')).toHaveAttribute('href', 'https://v3.tailwindcss.com/docs/utility-first');
    expect(practicePage.link('divides a user interface into independent blocks')).toHaveAttribute('href', 'https://yandex.com/dev/bem/index');
  });

  test('should keep its links to the platform’s own references', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(['pseudo-classes', 'prefers-reduced-motion', 'the meaningful sequence', 'appearance: base-select', '“fall back to a classic select experience”', 'custom properties']
      .map(name => practicePage.link(name).getAttribute('href'))).toEqual([
      'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes',
      'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion',
      'https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html',
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select',
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select',
      'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties'
    ]);
  });

  test('should show the column header’s markup after the sentence that reads a class list, before the bands are told', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const figure = practicePage.figure('The table’s column header, with its class attribute read left to right: nouns, then needs, then states.');

    expect(outOfReadingOrder([
      practicePage.paragraph(/^A class list reads left to right/),
      figure,
      practicePage.paragraph(/^The nouns say what the element is/)
    ])).toEqual([]);
  });

  test('should draw the column header’s whole class list, titled as read left to right, with nouns, needs and states under its runs', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const drawings = practicePage.drawingsIn('The table’s column header, with its class attribute read left to right: nouns, then needs, then states.', 'A class list read left to right');

    expect(drawings.map(drawing => drawing.classes)).toEqual([['cell header-cell', 'muted-rule-after muted-bar-below focus-ringed', 'carried'], ['cell header-cell', 'muted-rule-after muted-bar-below focus-ringed', 'carried']]);
    expect(drawings.map(drawing => drawing.words)).toEqual([['nouns', 'needs', 'states'], ['nouns', 'needs', 'states']]);
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
