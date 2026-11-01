import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {britishSpellingsOnThePage} from '@__test_support/spelling';
import {outOfReadingOrder} from '@__test_support/reading-order';
import indexCss from '/src/index.css?raw';
import stylelintConfig from '/stylelint.config.js?raw';

const whereARuleLives = 'Where a rule lives. The shared words live in src/styles, by concern. A component’s structure lives beside the component.';
const sheetsImported = (): string[] => [...indexCss.matchAll(/@import "styles\/([a-z]+)\.css";/g)].map(([, file]) => file);

describe('the Presentation practice tab', () => {
  test('should spell the Presentation tab\'s prose the American way', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should say style sheet, never a bare sheet, outside a quotation', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.bareSheets()).toEqual([]);
  });

  test('should open the Presentation tab from its address', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    expect(await practicePage.arrivedOn('Presentation')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Presentation');
  });

  test('should name the five things the style sheets hold to, in order: place, value, name, selector and order', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.terms()).toEqual(['Place', 'Value', 'Name', 'Selector', 'Order']);
  });

  test('should send place’s gates to the style sheet lint and the class lint, and its rule to BEM’s folder per block', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksInDefinitionOf('Place')).toEqual([
      ['style sheet lint', `${Paths.repo}/blob/main/stylelint.config.js`],
      ['class lint', `${Paths.repo}/blob/main/scripts/lint/classes.mjs`],
      ['folder per block', 'https://web.archive.org/web/20241224121848/https://en.bem.info/methodology/history/']
    ]);
  });

  test('should send value’s gate to the value lint', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksInDefinitionOf('Value')).toEqual([
      ['value lint', `${Paths.repo}/blob/main/stylelint.config.js`]
    ]);
  });

  test('should send name’s gate to the class lint, and where I agree and part to Wathan’s essay and Tailwind’s utility-first page', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksInDefinitionOf('Name')).toEqual([
      ['class lint', `${Paths.repo}/blob/main/scripts/lint/classes.mjs`],
      ['essay', 'https://adamwathan.me/css-utility-classes-and-separation-of-concerns/'],
      ['utility-first page', 'https://v3.tailwindcss.com/docs/utility-first']
    ]);
  });

  test('should send selector’s gate to the selector lint, and Hyatt’s key selector to the archived copy of his', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksInDefinitionOf('Selector')).toEqual([
      ['selector lint', `${Paths.repo}/blob/main/stylelint.config.js`],
      ['“the part that matches the element being matched, rather than its ancestors”', 'https://web.archive.org/web/20120505043119/https://developer.mozilla.org/en/Writing_Efficient_CSS']
    ]);
  });

  test('should send order’s gate to the import list itself, and the platform’s way to say it to MDN’s @layer', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksInDefinitionOf('Order')).toEqual([
      ['import list', `${Paths.repo}/blob/main/src/index.css`],
      ['@layer', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@layer']
    ]);
  });

  test('should send every method the field put the look in to the page that holds it', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^The rest of this tab says how each of the five holds here/)).toEqual([
      ['reset', 'https://meyerweb.com/eric/tools/css/reset/'],
      ['“a starting point for creating your own defaults”', 'https://meyerweb.com/eric/thoughts/2007/05/01/reset-reloaded/'],
      ['normalize.css', 'https://necolas.github.io/normalize.css/'],
      ['“preserve useful browser defaults rather than erasing them”', 'https://nicolasgallagher.com/about-normalize-css/'],
      ['Sass', 'https://sass-lang.com/libsass/'],
      ['Less', 'https://lesscss.org/about/'],
      ['Bootstrap', 'https://getbootstrap.com/docs/5.3/about/overview/'],
      ['OOCSS', 'https://github.com/stubbornella/oocss/wiki'],
      ['SMACSS', 'https://smacss.com/'],
      ['“more style guide than rigid framework”', 'https://smacss.com/'],
      ['CSS Modules', 'https://github.com/css-modules/css-modules'],
      ['styled-components', 'https://styled-components.com/blog/celebrating-a-decade-of-styled-components'],
      ['2013 moment', `${Paths.record}#someone-needs-components`],
      ['CSS Utility Classes and “Separation of Concerns”', 'https://adamwathan.me/css-utility-classes-and-separation-of-concerns/']
    ]);
  });

  test('should send each thing the platform has since put in the style sheet to MDN, with its date', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^The platform has since put the constants, the order and the isolation in the style sheet itself/)).toEqual([
      ['custom properties', 'https://developer.mozilla.org/en-US/docs/Web/CSS/--*'],
      ['@layer', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@layer'],
      ['nesting', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector'],
      ['@scope', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@scope'],
      ['Container queries', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@container'],
      [':has()', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has']
    ]);
  });

  test('should head the Presentation tab’s seven parts in reading order, closing on the test a class list has to pass', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.partHeadings()).toEqual([
      'What organizing CSS has to solve',
      'What this site keeps',
      'Where a rule lives',
      'What a class is named for',
      'What the style sheet owes the reader',
      'Where the platform catches up',
      'The test a class list has to pass'
    ]);
  });

  test('should walk the nine shared style sheets in the order index.css imports them, each linked to its file in the repository', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const imported = sheetsImported();
    const walked = practicePage.linksUnder('Where a rule lives')
      .filter(([, href]) => (href ?? '').startsWith(`${Paths.repo}/blob/main/src/styles/`));

    expect(imported).toHaveLength(9);
    expect(walked.map(([name]) => name)).toEqual(['reset', 'colors.css', 'spacing.css', 'button', 'typography', 'surface', 'drawing', 'placement', 'glide']);
    expect(walked.map(([, href]) => href)).toEqual(imported.map(file => `${Paths.repo}/blob/main/src/styles/${file}.css`));
  });

  test('should quote the tag rule’s message as stylelint.config.js prints it, signposted to the config', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const [[message, address]] = practicePage.linksIn(/^Three of those gates are stylelint rules, and each prints its reason/);

    expect(message).toBe('“a tag is styled only in src/styles/reset.css; give the element a class”');
    expect(address).toBe(`${Paths.repo}/blob/main/stylelint.config.js`);
    expect(stylelintConfig).toContain('a tag is styled only in src/styles/reset.css; give the element a class');
  });

  test('should quote the look rule’s message as stylelint.config.js prints it, signposted to the config', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const [, [message, address]] = practicePage.linksIn(/^Three of those gates are stylelint rules, and each prints its reason/);

    expect(message).toBe('“is a look; a component sheet holds structure, and a look is a word in src/styles that the element wears as a class”');
    expect(address).toBe(`${Paths.repo}/blob/main/stylelint.config.js`);
    expect(stylelintConfig).toContain('is a look; a component sheet holds structure, and a look is a word in src/styles that the element wears as a class');
  });

  test('should draw where a rule lives in the part it names, before what a class is named for', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(outOfReadingOrder([
      practicePage.partHeading('Where a rule lives'),
      practicePage.figure(whereARuleLives),
      practicePage.partHeading('What a class is named for')
    ])).toEqual([]);
  });

  test('should keep the drawing of where a rule lives from a screen reader, which hears its title and caption', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.drawingsSeenIn(whereARuleLives)).toEqual([]);
  });

  test('should draw src/styles in two groups, one component’s parts with its style sheets beside them, and the word it wears, wide and stacked', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const tree = [
      'src/styles',
      'the reset and the tokens', 'reset', 'colors', 'spacing',
      'the vocabulary, by concern', 'button', 'typography', 'surface', 'lifted', 'drawing', 'placement', 'glide'
    ];
    const component = ['DragSortableTable', 'DraggableColumn.tsx', 'RowGrip.tsx', 'SortMenu.tsx', 'ResizeHandle.tsx', 'Table.css', 'Header.css', 'RowGrip.css'];
    const frame = [...tree, ...component, 'wears'];

    expect(practicePage.drawnIn(whereARuleLives)).toEqual([...frame, ...frame]);
  });

  test('should draw src/styles’ style sheets in the order index.css imports them, wide and stacked', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const imported = sheetsImported();

    expect(practicePage.drawnIn(whereARuleLives).filter(label => imported.includes(label))).toEqual([...imported, ...imported]);
  });

  test('should send Wathan’s case and Tailwind’s own words to their sources', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.link('Compose a look from a shared set of pieces rather than write it again')).toHaveAttribute('href', 'https://adamwathan.me/css-utility-classes-and-separation-of-concerns/');
    expect(practicePage.link('“You aren’t wasting energy inventing class names”')).toHaveAttribute('href', 'https://v3.tailwindcss.com/docs/utility-first');
  });

  test('should send BEM to Yandex’s page, and its beginnings, the independent block and the folder per block to the history page’s archived copy', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^BEM is Yandex’s method, and it began at scale/)).toEqual([
      ['BEM', 'https://yandex.com/dev/bem/index'],
      ['history', 'https://web.archive.org/web/20241224121848/https://en.bem.info/methodology/history/'],
      ['“any changes to the code of one page affected the code of other pages”', 'https://web.archive.org/web/20241224121848/https://en.bem.info/methodology/history/'],
      ['“can be used anywhere on the page”', 'https://web.archive.org/web/20241224121848/https://en.bem.info/methodology/history/'],
      ['“each block is stored in a separate folder; each technology is represented by a separate file inside the folder”', 'https://web.archive.org/web/20241224121848/https://en.bem.info/methodology/history/']
    ]);
  });

  test('should send what a BEM modifier defines to the history page’s archived copy, from the paragraph on what I give up', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^I give up the scoping of every look to its block/)).toEqual([
      ['“defines the appearance, state, and sometimes the behavior of the block”', 'https://web.archive.org/web/20241224121848/https://en.bem.info/methodology/history/']
    ]);
  });

  test('should list the two things kept from BEM, the block and the folder per block, after saying there are two', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.itemsListedAfter(/^I keep two things from BEM/)).toEqual([
      expect.stringMatching(/^the block as the unit/),
      expect.stringMatching(/^the folder per block/)
    ]);
  });

  test('should list the three kinds of size spacing.css names outside its scale, after saying there are three', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.itemsListedAfter(/^Then two token files/)).toEqual([
      expect.stringMatching(/^the hairlines, in pixels/),
      expect.stringMatching(/^the corner radii/),
      expect.stringMatching(/^the breakpoints, in pixels/)
    ]);
  });

  test('should list the sizes that belong to one component and sit in its own style sheet', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.itemsListedAfter(/^A few sizes belong to one component and sit in its own style sheet/)).toEqual([
      expect.stringMatching(/^its container queries, in rems/),
      expect.stringMatching(/^a table’s or a page’s width, in rems, measured to what it holds/),
      expect.stringMatching(/^a drawing’s width, in pixels/)
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

  test('should send the runtime values’ custom properties to MDN’s guide to using them, and their lesson to the 2013 moment', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^Only values the code works out at runtime/)).toEqual([
      ['custom properties', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties'],
      ['2013 moment', `${Paths.record}#someone-needs-components`]
    ]);
  });

  test('should send the states the platform already names to MDN’s pseudo-classes', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.link('pseudo-classes')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes');
  });

  test('should send the reader’s motion preference to MDN’s prefers-reduced-motion', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.link('prefers-reduced-motion')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion');
  });

  test('should send the order a keyboard moves through to WCAG’s meaningful sequence', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.link('the meaningful sequence')).toHaveAttribute('href', 'https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html');
  });

  test('should send the customizable select, and its fallback, to MDN’s page on it, and the record’s pattern to the 1996 moment', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksUnder('Where the platform catches up')).toEqual([
      ['appearance: base-select', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select'],
      ['“fall back to a classic select experience”', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select'],
      ['1996 moment', `${Paths.record}#the-pages-need-to-look-the-same`]
    ]);
  });

  test('should show the trades column’s header in the part on what a class is named for', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const figure = practicePage.figure('The trades column’s header from the Tables demo, its class list trimmed, read left to right: nouns, then needs, then states.');

    expect(outOfReadingOrder([
      practicePage.partHeading('What a class is named for'),
      figure,
      practicePage.partHeading('What the style sheet owes the reader')
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

  test('should rest Presentation’s practice on its own moments, each citation naming the year of the moment it opens', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.citations()).toEqual([['2013', `${Paths.record}#someone-needs-components`], ['2013', `${Paths.record}#someone-needs-components`], ['1994', `${Paths.record}#authors-need-control-of-the-look`], ['2003', `${Paths.record}#the-separation-needs-proof`], ['1996', `${Paths.record}#the-pages-need-to-look-the-same`]]);
  });
});
