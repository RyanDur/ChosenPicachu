import {render} from '@testing-library/react';
import {appAddress} from '@__test_support/address';
import {site} from '@pages/__test_support';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {momentAddress} from '@pages/Record/MomentLink';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {britishSpellingsOnThePage} from '@__test_support/spelling';
import {outOfReadingOrder} from '@__test_support/reading-order';
import tableSource from '@pages/Demos/Tables/Frame/table.html?sample';
import bootSource from '@pages/Demos/Tables/Frame/boot.ts?sample';
import columnSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import indexCss from '/src/index.css?raw';
import stylelintConfig from '/stylelint.config.js?raw';

const appContinuum = 'https://www.appcontinuum.io/';
const tableOfContents = 'The page’s table of contents. Each landmark, with its element and, where it has one, its name.';

describe('the practice page', () => {
  test('should spell the Structure tab\'s prose the American way', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should spell the Presentation tab\'s prose the American way', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should spell the Behavior tab\'s prose the American way', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should open on Structure, at its own address, when no tab is named', async () => {
    render(<TestApp at={Paths.practice}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should send a link saved as ?tab=structure to that tab\'s own address', async () => {
    render(<TestApp at={`${Paths.practice}?tab=structure`}/>);

    expect(await appAddress.movedOnFrom(`${Paths.practice}?tab=structure`)).toBe(practiceAt('structure'));
  });

  test('should send a link saved as ?tab=presentation to that tab\'s own address', async () => {
    render(<TestApp at={`${Paths.practice}?tab=presentation`}/>);

    expect(await appAddress.movedOnFrom(`${Paths.practice}?tab=presentation`)).toBe(practiceAt('presentation'));
  });

  test('should send a link saved as ?tab=behavior to that tab\'s own address', async () => {
    render(<TestApp at={`${Paths.practice}?tab=behavior`}/>);

    expect(await appAddress.movedOnFrom(`${Paths.practice}?tab=behavior`)).toBe(practiceAt('behavior'));
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

  test('should open a link saved under the old tab name, dynamic, on the Behavior tab', async () => {
    render(<TestApp at={`${Paths.practice}?tab=dynamic`}/>);

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
    expect(appAddress.shown()).toBe(practiceAt('behavior'));
  });

  test('should open a link saved under the old tab name, dynamic-interaction, on the Behavior tab', async () => {
    render(<TestApp at={`${Paths.practice}?tab=dynamic-interaction`}/>);

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
    expect(appAddress.shown()).toBe(practiceAt('behavior'));
  });

  test('should open on Structure when the address names constructor, a word every object answers to', async () => {
    render(<TestApp at={`${Paths.practice}?tab=constructor`}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should open on Structure when the address names toString, a word every object answers to', async () => {
    render(<TestApp at={`${Paths.practice}?tab=toString`}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should open on Structure when the address names __proto__, a word every object answers to', async () => {
    render(<TestApp at={`${Paths.practice}?tab=__proto__`}/>);

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

  test('should follow the Structure tab’s first rule with the principle applied to it: the element is the name', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.paragraphAfter(/^I start from what the content is and pick the element for it/))
      .toEqual(expect.stringMatching(/^The element is the name\./));
  });

  test('should follow the Behavior tab’s first rule with the principle applied to it: an event and a type are names', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.paragraphAfter(/^Behavior splits into what is true and what happened/))
      .toEqual(expect.stringMatching(/^An event is a name for what happened\./));
  });

  test('should open the Structure tab on who reads markup, then the five things that have to be true of it, then where each lives, before the skeleton', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.paragraphs().slice(0, 4)).toEqual([
      expect.stringMatching(/^Markup is read by more than the browser/),
      expect.stringMatching(/^So five things have to be true of the markup/),
      expect.stringMatching(/^The rest of this tab takes each of the five in turn/),
      expect.stringMatching(/^The skeleton comes first/)
    ]);
  });

  test('should walk down from the skeleton to one element, through the three attributes and the tables demo’s two builds, before what the elements mean', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    const [headerCell, vanillaHeader] = practicePage.carvedFrom('Frame/table.html');

    expect(outOfReadingOrder([
      practicePage.paragraph(/^One region on every page is a role and not an element/),
      practicePage.paragraph(/^I start from what the content is and pick the element for it/),
      practicePage.paragraph(/^The element is the name/),
      practicePage.paragraph(/^The platform’s elements each bring a behavior/),
      practicePage.paragraph(/^Three attributes carry three jobs/),
      practicePage.paragraph(/^The tables demo builds the same table twice/),
      headerCell,
      practicePage.paragraph(/^The class list is the look/),
      practicePage.paragraph(/^The script attaches itself by the same attribute/),
      practicePage.carvedFrom('Frame/boot.ts')[0],
      practicePage.paragraph(/^boot finds its tables/),
      practicePage.paragraph(/^In React the same markup is written by components/),
      vanillaHeader,
      practicePage.carvedFrom('DragSortableTable/DraggableColumn.tsx')[0],
      practicePage.paragraph(/^DraggableColumn writes the th/),
      practicePage.paragraph(/^The elements mean something beyond how they look/)
    ])).toEqual([]);
  });

  test('should carve the vanilla table’s tag and its trades header from Frame/table.html, lines 2 to 41', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.sourceOf(practicePage.carvedFrom('Frame/table.html')[0])).toBe(`${tableSource.url}#L2-L41`);
  });

  test('should carve where the script finds its tables and hears what they report from Frame/boot.ts, lines 20 to 29', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.sourceOf(practicePage.carvedFrom('Frame/boot.ts')[0])).toBe(`${bootSource.url}#L20-L29`);
  });

  test('should carve the vanilla trades header from Frame/table.html, lines 12 to 41, beside the component', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.sourceOf(practicePage.carvedFrom('Frame/table.html')[1])).toBe(`${tableSource.url}#L12-L41`);
  });

  test('should carve DraggableColumn’s render from DragSortableTable/DraggableColumn.tsx, lines 54 to 76, beside the vanilla header', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.sourceOf(practicePage.carvedFrom('DragSortableTable/DraggableColumn.tsx')[0])).toBe(`${columnSource.url}#L54-L76`);
  });

  test('should send each platform element the walk names to its MDN page', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^The platform’s elements each bring a behavior/)).toEqual([
      ['details', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details'],
      ['dialog', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog'],
      ['popover', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover'],
      ['form', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form'],
      ['output', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output'],
      ['fieldset', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset'],
      ['legend', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend'],
      ['scope', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#scope'],
      ['Invoker commands', 'https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API']
    ]);
  });

  test('should send the split between what happened and what is true to the Behavior tab', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^boot finds its tables/)).toEqual([['Behavior tab', practiceAt('behavior')]]);
  });

  test('should list the five needs as terms, meaning, order, names, behavior and identity, each with what has to be true of the markup', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.terms()).toEqual(['Meaning', 'Order', 'Names', 'Behavior', 'Identity']);
    expect(practicePage.definitions()).toEqual([
      expect.stringMatching(/^What each thing is/),
      expect.stringMatching(/^What comes before what/),
      expect.stringMatching(/^What each region and control is called/),
      expect.stringMatching(/^What presses, opens and submits/),
      expect.stringMatching(/^How one thing is found/)
    ]);
  });

  test('should send each of the four needs WCAG names to its Understanding page, and identity to none', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksInDefinitionOf('Meaning')).toEqual([['1.3.1, Info and Relationships', 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html']]);
    expect(practicePage.linksInDefinitionOf('Order')).toEqual([['1.3.2, Meaningful Sequence', 'https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html']]);
    expect(practicePage.linksInDefinitionOf('Names')).toEqual([
      ['2.4.6, Headings and Labels', 'https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html'],
      ['2.4.1, Bypass Blocks', 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html']
    ]);
    expect(practicePage.linksInDefinitionOf('Behavior')).toEqual([['4.1.2, Name, Role, Value', 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html']]);
    expect(practicePage.linksInDefinitionOf('Identity')).toEqual([]);
  });

  test('should send the survey figure and the survey’s own words to WebAIM’s tenth survey', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^Markup is read by more than the browser/)).toEqual([
      ['WebAIM’s tenth survey', 'https://webaim.org/projects/screenreadersurvey10/'],
      ['“navigate through the headings on the page”', 'https://webaim.org/projects/screenreadersurvey10/']
    ]);
  });

  test('should show the page’s table of contents after the skeleton and why landmarks are named, before the one region that is a role', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(outOfReadingOrder([
      practicePage.paragraph(/^The skeleton comes first/),
      practicePage.paragraph(/^Landmarks are the page’s table of contents/),
      practicePage.figure(tableOfContents),
      practicePage.paragraph(/^One region on every page is a role and not an element/)
    ])).toEqual([]);
  });

  test('should send the rule for naming landmarks to the Authoring Practices, and the landmark elements to the 2004 moment', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^Landmarks are the page’s table of contents/)).toEqual([
      ['Authoring Practices', 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/'],
      ['“If a specific landmark role is used more than once on a page, provide each instance of that landmark with a unique label.”', 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/'],
      ['2004 moment', momentAddress('browsersTakePen')]
    ]);
  });

  test('should send the banners’ role to the z-index tab that builds it', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^One region on every page is a role and not an element/)).toEqual([
      ['z-index tab', demoAddress(DemoTopics.zIndex)]
    ]);
  });

  test('should keep the table of contents’ drawing from a screen reader, which hears its title and caption', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.drawingsSeenIn(tableOfContents)).toEqual([]);
  });

  test('should label each drawn landmark with its element and, where it has one, its name', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.drawnIn(tableOfContents)).toEqual(expect.arrayContaining([
      'header',
      'section · pages and feedback', 'nav · site', 'feedback',
      'main', 'nav · tabs', 'only where a page has tabs',
      'footer',
      'section · role alert · live region · top layer'
    ]));
  });

  test('should open the Structure tab from its address, reading how I organize it from its first rule to its test', async () => {
    render(<TestApp at={practiceAt('structure')}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(practicePage.paragraph(/^I start from what the content is and pick the element for it/)).toBeInTheDocument();
    expect(practicePage.paragraph(/^The test is to read the page with the styles turned off/)).toBeInTheDocument();
  });

  test('should open the Presentation tab from its address, reading how I organize it from its first rule to its test', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    expect(await practicePage.arrivedOn('Presentation')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Presentation');
    expect(practicePage.paragraph(/^I write CSS in two kinds of sheet/)).toBeInTheDocument();
    expect(practicePage.paragraph(/^The test is to read a class list on its own/)).toBeInTheDocument();
  });

  test('should open the Behavior tab from its address, reading how I organize it from its first rule to its test', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
    expect(practicePage.paragraph(/^Behavior splits into what is true and what happened/)).toBeInTheDocument();
    expect(practicePage.paragraph(/^The test is to read the state on its own/)).toBeInTheDocument();
  });

  test('should read Presentation’s practice when the reader picks its tab from Structure', async () => {
    render(<TestApp at={practiceAt('structure')}/>);

    await practicePage.pickTab('Presentation');

    expect(await practicePage.arrivedOn('Presentation')).toBeInTheDocument();
    expect(practicePage.paragraph(/^I write CSS in two kinds of sheet/)).toBeInTheDocument();
  });

  test('should read Behavior’s practice when the reader picks its tab from Presentation', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    await practicePage.pickTab('Behavior');

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.paragraph(/^Behavior splits into what is true and what happened/)).toBeInTheDocument();
  });

  test('should read Structure’s practice when the reader picks its tab from Behavior', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);

    await practicePage.pickTab('Structure');

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.paragraph(/^I start from what the content is and pick the element for it/)).toBeInTheDocument();
  });

  test('the structure tab tells how I organize structure', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.heading()).toBeVisible();
    expect(practicePage.linksIn(/^I start from what the content is and pick the element for it/)).toEqual([
      ['search', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search'],
      ['progress', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress'],
      ['output', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output'],
      ['2014 moment', momentAddress('html5SaysIt')]
    ]);
    expect(practicePage.link(/of last resort, for when no other element is suitable/))
      .toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element');
    expect(practicePage.link(/No ARIA is better than bad ARIA/))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
    expect(practicePage.paragraph(/The test is to read the page with the styles turned off/)).toBeInTheDocument();
  });

  test('should tell presentation in its paragraphs, in order, from the two kinds of sheet to the test', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.paragraphs()).toEqual([
      expect.stringMatching(/^CSS has one global scope, so every rule can reach every element, and a cascade/),
      expect.stringMatching(/^The field answered them in turn, and each answer had a cost/),
      expect.stringMatching(/^A reset answered defaults/),
      expect.stringMatching(/^A preprocessor answered constants and reuse/),
      expect.stringMatching(/^A framework answered reuse for teams without a designer/),
      expect.stringMatching(/^A methodology answered isolation and order by convention/),
      expect.stringMatching(/^CSS in script answered isolation by build/),
      expect.stringMatching(/^Utilities answered constants and reuse with no new CSS/),
      expect.stringMatching(/^Since 2017 the platform has answered four of the five needs itself/),
      expect.stringMatching(/^So what is left to organize is smaller than it was/),
      expect.stringMatching(/^BEM is Yandex’s method, and it began at scale/),
      expect.stringMatching(/^I keep three things from BEM/),
      expect.stringMatching(/^Tailwind’s own advice on reuse is the part I agree with most/),
      expect.stringMatching(/^Here is how this site’s CSS is laid out, in the order index\.css imports it/),
      expect.stringMatching(/^Then two token files/),
      expect.stringMatching(/^Then the vocabulary, six files by concern/),
      expect.stringMatching(/^Then the component sheets/),
      expect.stringMatching(/^Two gates hold those lines, and they are the method/),
      expect.stringMatching(/^What this repository does not use is the platform’s newer scoping/),
      expect.stringMatching(/^I write CSS in two kinds of sheet/),
      expect.stringMatching(/^Utilities are where I agree with Adam Wathan, who made Tailwind/),
      expect.stringMatching(/^BEM takes the independent block and gives up sharing/),
      expect.stringMatching(/^A class is a name for what the element is, what it needs or what is true right now/),
      expect.stringMatching(/^The nouns say what the element is/),
      expect.stringMatching(/^Presentation has duties of its own/),
      expect.stringMatching(/^Workarounds go away as the platform catches up/),
      expect.stringMatching(/^Constants live in the sheet, as tokens/),
      expect.stringMatching(/^The test is to read a class list on its own/)
    ]);
  });

  test('should send each answer the field gave to its source, and the quotations to the pages that hold them', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^A reset answered defaults/)).toEqual([
      ['reset', 'https://meyerweb.com/eric/tools/css/reset/'],
      ['“a starting point for creating your own defaults”', 'https://meyerweb.com/eric/thoughts/2007/05/01/reset-reloaded/'],
      ['normalize.css', 'https://necolas.github.io/normalize.css/'],
      ['“preserve useful browser defaults rather than erasing them”', 'https://nicolasgallagher.com/about-normalize-css/']
    ]);
    expect(practicePage.linksIn(/^A preprocessor answered constants and reuse/)).toEqual([
      ['Sass', 'https://sass-lang.com/'],
      ['Less', 'https://lesscss.org/about/']
    ]);
    expect(practicePage.linksIn(/^A framework answered reuse for teams without a designer/)).toEqual([
      ['Bootstrap', 'https://getbootstrap.com/docs/5.3/about/overview/']
    ]);
    expect(practicePage.linksIn(/^A methodology answered isolation and order by convention/)).toEqual([
      ['OOCSS', 'https://github.com/stubbornella/oocss/wiki'],
      ['SMACSS', 'https://smacss.com/'],
      ['“more style guide than rigid framework”', 'https://smacss.com/']
    ]);
    expect(practicePage.linksIn(/^CSS in script answered isolation by build/)).toEqual([
      ['CSS Modules', 'https://github.com/css-modules/css-modules'],
      ['styled-components', 'https://styled-components.com/blog/celebrating-a-decade-of-styled-components'],
      ['2013 moment', `${Paths.record}#someone-needs-components`]
    ]);
    expect(practicePage.linksIn(/^Utilities answered constants and reuse with no new CSS/)).toEqual([
      ['CSS Utility Classes and “Separation of Concerns”', 'https://adamwathan.me/css-utility-classes-and-separation-of-concerns/']
    ]);
    expect(practicePage.linksIn(/^Since 2017 the platform has answered four of the five needs itself/)).toEqual([
      ['Custom properties', 'https://developer.mozilla.org/en-US/docs/Web/CSS/--*'],
      ['@layer', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@layer'],
      ['Container queries', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@container'],
      [':has()', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has'],
      ['nesting', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector'],
      ['@scope', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@scope']
    ]);
  });

  test('should list the five needs of CSS as terms, defaults, constants, reuse, isolation and order, each with what it asks', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.terms()).toEqual(['Defaults', 'Constants', 'Reuse', 'Isolation', 'Order']);
    expect(practicePage.definitions()).toEqual([
      expect.stringMatching(/^that agree across browsers/),
      expect.stringMatching(/^written once/),
      expect.stringMatching(/^of a look/),
      expect.stringMatching(/^of a component/),
      expect.stringMatching(/^when rules conflict/)
    ]);
  });

  test('should head the Presentation tab’s two parts, what organizing CSS has to solve and what this site keeps, each before the paragraphs it heads', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.partHeadings()).toEqual(['What organizing CSS has to solve', 'What this site keeps']);
    expect(outOfReadingOrder([
      practicePage.partHeading('What organizing CSS has to solve'),
      practicePage.paragraph(/^CSS has one global scope/),
      practicePage.paragraph(/^So what is left to organize is smaller than it was/),
      practicePage.partHeading('What this site keeps'),
      practicePage.openingParagraph(/^BEM is Yandex’s method, and it began at scale/)
    ])).toEqual([]);
  });

  test('should walk the nine shared sheets in the order index.css imports them, each linked to its file in the repository', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const imported = [...indexCss.matchAll(/@import "styles\/([a-z]+)\.css";/g)].map(([, file]) => file);
    const walked = [
      ...practicePage.linksIn(/^Here is how this site’s CSS is laid out/),
      ...practicePage.linksIn(/^Then two token files/),
      ...practicePage.linksIn(/^Then the vocabulary, six files by concern/)
    ];

    expect(imported).toHaveLength(9);
    expect(walked.map(([name]) => name)).toEqual(['reset', 'colors.css', 'spacing.css', 'button', 'typography', 'surface', 'drawing', 'placement', 'glide']);
    expect(walked.map(([, href]) => href)).toEqual(imported.map(file => `${Paths.repo}/blob/main/src/styles/${file}.css`));
  });

  test('should quote the two gates’ messages as stylelint.config.js prints them, each signposted to the config', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const quoted = practicePage.linksIn(/^Two gates hold those lines, and they are the method/);

    expect(quoted).toEqual([
      ['“a tag is styled only in src/styles/reset.css; give the element a class”', `${Paths.repo}/blob/main/stylelint.config.js`],
      ['“is a look; a component sheet holds structure, and a look is a word in src/styles that the element wears as a class”', `${Paths.repo}/blob/main/stylelint.config.js`]
    ]);
    quoted.forEach(([message]) => expect(stylelintConfig).toContain((message ?? '').slice(1, -1)));
  });

  test('should send Wathan’s case and Tailwind’s own words to their sources', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.link('compose a look from a shared set of pieces rather than write it again')).toHaveAttribute('href', 'https://adamwathan.me/css-utility-classes-and-separation-of-concerns/');
    expect(practicePage.link('“You aren’t wasting energy inventing class names”')).toHaveAttribute('href', 'https://v3.tailwindcss.com/docs/utility-first');
  });

  test('should send BEM to Yandex’s page, and its beginnings, the independent block and the folder per block to the history page’s archived copy', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^BEM is Yandex’s method, and it began at scale/)).toEqual([
      ['BEM', 'https://yandex.com/dev/bem/index'],
      ['history', 'https://web.archive.org/web/2024/https://en.bem.info/methodology/history/'],
      ['“any changes to the code of one page affected the code of other pages”', 'https://web.archive.org/web/2024/https://en.bem.info/methodology/history/'],
      ['“can be used anywhere on the page”', 'https://web.archive.org/web/2024/https://en.bem.info/methodology/history/'],
      ['“each block is stored in a separate folder; each technology is represented by a separate file inside the folder”', 'https://web.archive.org/web/2024/https://en.bem.info/methodology/history/']
    ]);
  });

  test('should send what a BEM modifier defines to the history page’s archived copy', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^I keep three things from BEM/)).toEqual([
      ['“defines the appearance, state, and sometimes the behavior of the block”', 'https://web.archive.org/web/2024/https://en.bem.info/methodology/history/']
    ]);
  });

  test('should send Tailwind’s advice on reuse, and its two quoted lines, to its page on styling with utility classes', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^Tailwind’s own advice on reuse is the part I agree with most/)).toEqual([
      ['styling with utility classes', 'https://tailwindcss.com/docs/styling-with-utility-classes'],
      ['“there’s no benefit to introducing any additional abstraction”', 'https://tailwindcss.com/docs/styling-with-utility-classes'],
      ['“the best strategy is to create a component”', 'https://tailwindcss.com/docs/styling-with-utility-classes']
    ]);
  });

  test('should keep its links to the platform’s own references', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(['pseudo-classes', 'prefers-reduced-motion', 'the meaningful sequence', 'appearance: base-select', '“fall back to a classic select experience”', 'custom properties']
      .map(name => practicePage.link(name).getAttribute('href'))).toEqual([
      'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes',
      'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion',
      'https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html',
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select',
      'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select',
      'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties'
    ]);
  });

  test('should show the trades column’s header after the paragraph that reads a class list, before the nouns are told', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const figure = practicePage.figure('The trades column’s header from the Tables demo, its class list trimmed, read left to right: nouns, then needs, then states.');

    expect(outOfReadingOrder([
      practicePage.paragraph(/A class list reads left to right/),
      figure,
      practicePage.paragraph(/^The nouns say what the element is/)
    ])).toEqual([]);
  });

  test('should give a screen reader the trades header’s tag once, as text', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.tagIn('The trades column’s header from the Tables demo, its class list trimmed, read left to right: nouns, then needs, then states.')).toBe('<th scope="col" class="cell header-cell muted-rule-after muted-bar-below focus-ringed carried">trades</th>');
  });

  test('should keep its drawings from a screen reader, which hears the tag once, from its code', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.drawingsSeenIn('The trades column’s header from the Tables demo, its class list trimmed, read left to right: nouns, then needs, then states.')).toEqual([]);
  });

  test('should draw the trades column’s header wide and narrow, each run with its kind under it: nouns, needs, states', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.drawnIn('The trades column’s header from the Tables demo, its class list trimmed, read left to right: nouns, then needs, then states.')).toEqual([
      '<th scope="col" class="',
      'cell header-cell', 'nouns',
      'muted-rule-after muted-bar-below focus-ringed', 'needs',
      'carried', 'states',
      '">trades</th>',
      '<th scope="col" class="',
      'cell header-cell', 'nouns',
      'muted-rule-after muted-bar-below focus-ringed', 'needs',
      'carried', 'states',
      '">trades</th>'
    ]);
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

  test('should rest Structure’s practice on its own moments, each citation naming the year of the moment it opens', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.citations()).toEqual([['2004', `${Paths.record}#the-standard-needs-the-real-world`], ['2014', `${Paths.record}#the-rules-need-writing-down`], ['2013', `${Paths.record}#someone-needs-components`], ['2004', `${Paths.record}#the-standard-needs-the-real-world`], ['2016', `${Paths.record}#the-document-needs-to-come-first`]]);
  });

  test('should rest Presentation’s practice on its own moments, each citation naming the year of the moment it opens', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.citations()).toEqual([['2013', `${Paths.record}#someone-needs-components`], ['1994', `${Paths.record}#authors-need-control-of-the-look`], ['2003', `${Paths.record}#the-separation-needs-proof`], ['1996', `${Paths.record}#the-pages-need-to-look-the-same`], ['2013', `${Paths.record}#someone-needs-components`]]);
  });

  test('should rest Behavior’s practice on its own moments, each citation naming the year of the moment it opens', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.citations()).toEqual([['2010', `${Paths.record}#the-application-needs-a-frame`], ['2005', `${Paths.record}#the-page-needs-to-update-in-place`], ['2010', `${Paths.record}#the-application-needs-a-frame`], ['2013', `${Paths.record}#someone-needs-components`], ['2016', `${Paths.record}#the-document-needs-to-come-first`]]);
  });
});
