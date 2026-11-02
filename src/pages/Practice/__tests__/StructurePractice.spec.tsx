import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {fileInRepository, Paths} from '@pages/Paths';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {momentAddress} from '@pages/Record/MomentLink';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {britishSpellingsOnThePage} from '@__test_support/spelling';
import {outOfReadingOrder} from '@__test_support/reading-order';
import a11yJourney from '/e2e/a11y.e2e.ts?raw';
import agents from '/AGENTS.md?raw';
import stylelintConfig from '/stylelint.config.js?raw';

const siteSources: Record<string, string> = import.meta.glob(['/src/**/*.{ts,tsx,html}', '!/src/**/__tests__/**', '!/src/**/__test_support/**', '!/src/**/__test_support__/**'], {query: '?raw', import: 'default', eager: true});

const distinct = (words: string[]): string[] => [...new Set(words)].sort();
const rolesWritten = (): string[] => distinct(Object.values(siteSources).flatMap(source => [...source.matchAll(/role="([a-z]+)"/g)].map(([, role]) => role)));
const tableOfContents = 'The page’s table of contents. Each landmark, with its element and, where it has one, its name.';

const statesWrittenByHand = (): string[] => distinct(Object.values(siteSources).flatMap(source => [...source.matchAll(/(?:\s|setAttribute\(['"])(aria-(?:sort|current|expanded|hidden|pressed|selected|checked|disabled|invalid|busy))(?=[\s=:>/'"])/g)].map(([, state]) => state)));

describe('the Structure practice tab', () => {
  test('should spell the Structure tab\'s prose the American way', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should open the Structure tab on the three rules, then who reads markup, then the five things that have to be true of it, before the skeleton', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(outOfReadingOrder([
      practicePage.partHeading('What organizing markup has to solve'),
      practicePage.paragraph(/^I choose the element for what the thing is/),
      practicePage.paragraph(/^The rules come from the readers/),
      practicePage.paragraph(/^So five things have to be true of the markup/),
      practicePage.paragraph(/^The rest of this tab takes each of the five in turn/),
      practicePage.partHeading('The skeleton, and a name where a landmark repeats')
    ])).toEqual([]);
  });

  test('should head the Structure tab’s parts, each title stating the part’s answer', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.partHeadings()).toEqual([
      'What organizing markup has to solve',
      'The skeleton, and a name where a landmark repeats',
      'From the content to the element',
      'Components, one behavior each',
      'ARIA last',
      'The styles-off test'
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
      practicePage.paragraph(/^boot\.ts, in its feed function, finds its tables/),
      practicePage.paragraph(/^In React the same markup is written by components/),
      vanillaHeader,
      practicePage.carvedFrom('DragSortableTable/DraggableColumn.tsx')[0],
      practicePage.paragraph(/^DraggableColumn writes the th/),
      practicePage.paragraph(/^The elements mean something beyond how they look/)
    ])).toEqual([]);
  });

  test('should show the vanilla table’s tag and trades header with all three attributes: the class lists, the id, and data-drag-sortable, data-sort-toggle and data-resize-handle, with popovertarget naming the menu', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    const carve = practicePage.codeOf(practicePage.carvedFrom('Frame/table.html')[0]);

    expect(carve).toContain('<table class="fancy-table sortable apportioned hide animated" id="live-aggregations" data-drag-sortable>');
    expect(carve).toContain('data-sort-toggle');
    expect(carve).toContain('data-resize-handle');
    expect(carve).toContain('popovertarget="sort-trades"');
    expect(carve).toContain('<menu id="sort-trades"');
  });

  test('should show boot.ts finding its tables by data-drag-sortable and hearing column-moved, row-moved and sorted', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    const carve = practicePage.codeOf(practicePage.carvedFrom('Frame/boot.ts')[0]);

    expect(carve).toContain("querySelectorAll('table[data-drag-sortable]')");
    expect(carve).toContain("addEventListener('column-moved'");
    expect(carve).toContain("addEventListener('row-moved'");
    expect(carve).toContain("addEventListener('sorted'");
  });

  test('should show the vanilla trades header cell beside the component that writes it', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.codeOf(practicePage.carvedFrom('Frame/table.html')[1])).toMatch(/^<th scope="col" class="cell header-cell trades/);
  });

  test('should show DraggableColumn writing the th, with its scope, beside the vanilla header', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    const carve = practicePage.codeOf(practicePage.carvedFrom('DragSortableTable/DraggableColumn.tsx')[0]);

    expect(carve).toMatch(/^return <th/);
    expect(carve).toContain('scope="col"');
  });

  test('should send the elements the content asks for to their MDN pages, and semantic markup to the 2014 moment', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^I start from what the content is and pick the element for it/)).toEqual([
      ['search', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search'],
      ['progress', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress'],
      ['output', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output'],
      ['2014 moment', momentAddress('html5SaysIt')]
    ]);
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

    expect(practicePage.linksIn(/^boot\.ts, in its feed function, finds its tables/)).toEqual([['Behavior tab', practiceAt('behavior')]]);
  });

  test('should open the styles-off test on what the test is, then the four gates that hold the site to it, then the rule the review holds', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(outOfReadingOrder([
      practicePage.partHeading('The styles-off test'),
      practicePage.paragraph(/^The test is to read the page with the styles turned off/),
      practicePage.paragraph(/^The styles-off test is not read by eye/),
      practicePage.paragraph(/^The rule the review holds is one line in AGENTS.md/)
    ])).toEqual([]);
  });

  test('should list the four gates that hold the site to the styles-off test: axe, html-validate, outOfReadingOrder and stylelint', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.codesListedAfter(/^The styles-off test is not read by eye/)).toEqual(['axe', 'html-validate', 'outOfReadingOrder', 'stylelint']);
  });

  test('should quote html-validate’s loosened id rule from the accessibility journey, word for word', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    const {words, address} = practicePage.quotedIn(/^html-validate checks/);

    expect(a11yJourney).toContain(words);
    expect(address).toBe(fileInRepository('e2e/a11y.e2e.ts'));
  });

  test('should quote AGENTS.md on how a test finds things, word for word', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    const {words, address} = practicePage.quotedIn(/^The rule the review holds is one line in AGENTS.md/);

    expect(agents).toContain(words);
    expect(address).toBe(fileInRepository('AGENTS.md'));
  });

  test('should send outOfReadingOrder to its file', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksInItem(/^outOfReadingOrder takes/)).toEqual([['outOfReadingOrder', fileInRepository('src/__test_support/reading-order.ts')]]);
  });

  test('should quote stylelint’s message on an obsolete element, word for word', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    const {words, address} = practicePage.quotedIn(/^stylelint refuses a selector/);

    expect(stylelintConfig).toContain(words);
    expect(address).toBe(fileInRepository('stylelint.config.js'));
  });

  test('should name every role the site writes, and no other', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(distinct(practicePage.codesIn(/^Here is what ARIA last looks like on this site/))).toEqual(rolesWritten());
  });

  test('should name every state the site writes by hand, and no other', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(distinct(practicePage.codesIn(/^States come from the platform wherever it has one/).filter(code => code.startsWith('aria-')))).toEqual(statesWrittenByHand());
  });

  test('should send the old-style banner to the z-index tab that raises it', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^Here is what ARIA last looks like on this site/)).toEqual([['z-index tab', demoAddress(DemoTopics.zIndex)]]);
  });

  test('should send Disclosure, the counter-case, to its source', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^A component is an element that does not exist yet/)).toEqual([
      ['Disclosure', `${Paths.repo}/blob/main/src/components/Disclosure/Disclosure.tsx`]
    ]);
  });

  test('should send each part of the drag-sortable table to its source, and the menu’s three components to the z-index tab', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^And one behavior each/)).toEqual([
      ['RowGrip', `${Paths.repo}/blob/main/src/components/DragSortableTable/RowGrip.tsx`],
      ['ResizeHandle', `${Paths.repo}/blob/main/src/components/DragSortableTable/ResizeHandle.tsx`],
      ['SortMenu', `${Paths.repo}/blob/main/src/components/DragSortableTable/SortMenu.tsx`],
      ['DraggableColumn', `${Paths.repo}/blob/main/src/components/DragSortableTable/DraggableColumn.tsx`],
      ['z-index tab', demoAddress(DemoTopics.zIndex)]
    ]);
  });

  test('should send custom elements to the concert’s paragraph on them, and the first rule of ARIA to Using ARIA', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^This is also why the site’s new elements are React components/)).toEqual([
      ['concert', `${Paths.record}#custom-elements`],
      ['“If you can use a native HTML element or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so.”', 'https://www.w3.org/TR/using-aria/']
    ]);
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

    expect(practicePage.linksIn(/^The rules come from the readers/)).toEqual([
      ['WebAIM’s tenth survey', 'https://webaim.org/projects/screenreadersurvey10/'],
      ['“navigate through the headings on the page”', 'https://webaim.org/projects/screenreadersurvey10/']
    ]);
  });

  test('should show the page’s table of contents after the skeleton and why landmarks are named, before the one region that is a role', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(outOfReadingOrder([
      practicePage.paragraph(/^The skeleton comes first/),
      practicePage.paragraph(/^Landmarks are what a screen reader lists and jumps to/),
      practicePage.figure(tableOfContents),
      practicePage.paragraph(/^One region on every page is a role and not an element/)
    ])).toEqual([]);
  });

  test('should send the rule for naming landmarks to the Authoring Practices, and the landmark elements to the 2004 moment', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^Landmarks are what a screen reader lists and jumps to/)).toEqual([
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
      'footer', 'only where a page has one',
      'section · role alert · live region · top layer'
    ]));
  });

  test('should open the Structure tab from its address, reading how I organize it from its first rule to its test', async () => {
    render(<TestApp at={practiceAt('structure')}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(practicePage.paragraph(/^I choose the element for what the thing is/)).toBeInTheDocument();
    expect(practicePage.paragraph(/^The test is to read the page with the styles turned off/)).toBeInTheDocument();
  });

  test('should send the div’s “last resort” to the HTML standard and “No ARIA is better than bad ARIA” to MDN', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.link(/of last resort, for when no other element is suitable/))
      .toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element');
    expect(practicePage.link(/No ARIA is better than bad ARIA/))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
  });

  test('should rest Structure’s practice on its own moments, each citation naming the year of the moment it opens', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.citations()).toEqual([['2004', `${Paths.record}#the-standard-needs-the-real-world`], ['2014', `${Paths.record}#the-rules-need-writing-down`], ['2013', `${Paths.record}#someone-needs-components`], ['2004', `${Paths.record}#the-standard-needs-the-real-world`], ['2016', `${Paths.record}#the-document-needs-to-come-first`]]);
  });
});
