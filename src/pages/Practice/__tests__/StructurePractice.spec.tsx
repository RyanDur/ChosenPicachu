import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {fileInRepository, Paths} from '@pages/Paths';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {momentAddress} from '@pages/Record/MomentLink';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';

const tableOfContents = 'The page’s table of contents. Each landmark, with its element and, where it has one, its name.';

describe('the Structure practice tab', () => {
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

  test('should send the elements the content asks for to their MDN pages, and semantic markup to the 2014 moment', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksIn(/^I start from what the content is and pick the element for it/)).toEqual([
      ['search', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search'],
      ['progress', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress'],
      ['output', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output'],
      ['October 2014 moment', momentAddress('html5SaysIt')]
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

  test('should send the quotation of html-validate’s loosened id rule to the accessibility journey', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.quotationAddressIn(/^html-validate checks/)).toBe(fileInRepository('e2e/a11y.e2e.ts'));
  });

  test('should send the quotation on how a test finds things to AGENTS.md', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.quotationAddressIn(/^The rule the review holds is one line in AGENTS.md/)).toBe(fileInRepository('AGENTS.md'));
  });

  test('should send outOfReadingOrder to its file', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.linksInItem(/^outOfReadingOrder takes/)).toEqual([['outOfReadingOrder', fileInRepository('src/__test_support/reading-order.ts')]]);
  });

  test('should send the quotation of stylelint’s message on an obsolete element to stylelint.config.js', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.quotationAddressIn(/^stylelint refuses a selector/)).toBe(fileInRepository('stylelint.config.js'));
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

  test('should keep the table of contents’ drawing from a screen reader', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.imagesHeardIn(tableOfContents)).toEqual([]);
  });

  test('should open the Structure tab from its address', async () => {
    render(<TestApp at={practiceAt('structure')}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
  });

  test('should send the div’s “last resort” to the HTML standard and “No ARIA is better than bad ARIA” to MDN', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.link(/of last resort, for when no other element is suitable/))
      .toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element');
    expect(practicePage.link(/No ARIA is better than bad ARIA/))
      .toHaveAttribute('href', expect.stringContaining('developer.mozilla.org'));
  });
});
