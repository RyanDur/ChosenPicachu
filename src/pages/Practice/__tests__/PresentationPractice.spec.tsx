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

  test('should open the Presentation tab from its address', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    expect(await practicePage.arrivedOn('Presentation')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Presentation');
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

  test('should list the five needs of CSS as terms, defaults, constants, reuse, isolation and order, each with a definition beside it', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.terms()).toEqual(['Defaults', 'Constants', 'Reuse', 'Isolation', 'Order']);
    expect(practicePage.definitions().map(definition => definition.length > 0)).toEqual([true, true, true, true, true]);
  });

  test('should head the Presentation tab’s six parts in reading order, closing on the test a class list has to pass', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.partHeadings()).toEqual([
      'What organizing CSS has to solve',
      'What this site keeps',
      'Where a rule lives',
      'What a class is named for',
      'The duties the sheet keeps',
      'The test a class list has to pass'
    ]);
  });

  test('should walk the nine shared sheets in the order index.css imports them, each linked to its file in the repository', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const imported = sheetsImported();
    const walked = [
      ...practicePage.linksIn(/^Here is how this site’s CSS is laid out/),
      ...practicePage.linksIn(/^Then two token files/),
      ...practicePage.linksIn(/^Then the vocabulary, six files by concern/)
    ];

    expect(imported).toHaveLength(9);
    expect(walked.map(([name]) => name)).toEqual(['reset', 'colors.css', 'spacing.css', 'button', 'typography', 'surface', 'drawing', 'placement', 'glide']);
    expect(walked.map(([, href]) => href)).toEqual(imported.map(file => `${Paths.repo}/blob/main/src/styles/${file}.css`));
  });

  test('should quote the tag rule’s message as stylelint.config.js prints it, signposted to the config', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const [[message, address]] = practicePage.linksIn(/^Three lint rules hold those lines, and they are the method/);

    expect(message).toBe('“a tag is styled only in src/styles/reset.css; give the element a class”');
    expect(address).toBe(`${Paths.repo}/blob/main/stylelint.config.js`);
    expect(stylelintConfig).toContain('a tag is styled only in src/styles/reset.css; give the element a class');
  });

  test('should quote the look rule’s message as stylelint.config.js prints it, signposted to the config', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const [, [message, address]] = practicePage.linksIn(/^Three lint rules hold those lines, and they are the method/);

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

  test('should draw src/styles in two groups, one component’s parts with its sheets beside them, and the word it wears, wide and stacked', async () => {
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

  test('should draw src/styles’ sheets in the order index.css imports them, wide and stacked', async () => {
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

  test('should list the three things kept from BEM, the block, the folder per block and flat selectors, after saying there are three', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.itemsListedAfter(/^I keep three things from BEM/)).toEqual([
      expect.stringMatching(/^the block as the unit/),
      expect.stringMatching(/^the folder per block/),
      expect.stringMatching(/^flat selectors/)
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

  test('should rest Presentation’s practice on its own moments, each citation naming the year of the moment it opens', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.citations()).toEqual([['2013', `${Paths.record}#someone-needs-components`], ['1994', `${Paths.record}#authors-need-control-of-the-look`], ['2003', `${Paths.record}#the-separation-needs-proof`], ['1996', `${Paths.record}#the-pages-need-to-look-the-same`], ['2013', `${Paths.record}#someone-needs-components`]]);
  });
});
