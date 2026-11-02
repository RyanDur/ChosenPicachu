import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {outOfReadingOrder} from '@__test_support/reading-order';

const whereARuleLives = 'Where a rule lives. The shared words live in src/styles, by concern. A component’s structure lives beside the component.';

describe('the Presentation practice tab', () => {
  test('should open the Presentation tab from its address', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    expect(await practicePage.arrivedOn('Presentation')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Presentation');
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

    expect(practicePage.linksIn(/^CSS has one global scope, so every rule can reach every element/)).toEqual([
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

  test('should send each thing the platform has since put in the style sheet to MDN', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksIn(/^The platform has since put the values, the order and the scoping in the style sheet itself/)).toEqual([
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

  test('should send each of the nine shared style sheets walked under where a rule lives to its file in the repository', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.linksUnder('Where a rule lives')
      .filter(([, href]) => (href ?? '').startsWith(`${Paths.repo}/blob/main/src/styles/`))).toEqual([
      ['reset', `${Paths.repo}/blob/main/src/styles/reset.css`],
      ['colors.css', `${Paths.repo}/blob/main/src/styles/colors.css`],
      ['spacing.css', `${Paths.repo}/blob/main/src/styles/spacing.css`],
      ['button', `${Paths.repo}/blob/main/src/styles/button.css`],
      ['typography', `${Paths.repo}/blob/main/src/styles/typography.css`],
      ['surface', `${Paths.repo}/blob/main/src/styles/surface.css`],
      ['drawing', `${Paths.repo}/blob/main/src/styles/drawing.css`],
      ['placement', `${Paths.repo}/blob/main/src/styles/placement.css`],
      ['glide', `${Paths.repo}/blob/main/src/styles/glide.css`]
    ]);
  });

  test('should send the tag rule’s quoted message to stylelint.config.js', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const [[message, address]] = practicePage.linksIn(/^Three of the five needs above, place, value and selector, are held by stylelint rules/);

    expect(message).toBe('“a tag is styled only in src/styles/reset.css; give the element a class”');
    expect(address).toBe(`${Paths.repo}/blob/main/stylelint.config.js`);
  });

  test('should send the look rule’s quoted message to stylelint.config.js', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    const [, [message, address]] = practicePage.linksIn(/^Three of the five needs above, place, value and selector, are held by stylelint rules/);

    expect(message).toBe('“is a look; a component sheet holds structure, and a look is a word in src/styles that the element wears as a class”');
    expect(address).toBe(`${Paths.repo}/blob/main/stylelint.config.js`);
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

  test('should keep the drawing of where a rule lives from a screen reader', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.imagesHeardIn(whereARuleLives)).toEqual([]);
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

  test('should keep the drawing of the trades column’s header from a screen reader', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.drawingsSeenIn('The trades column’s header from the Tables demo, its class list trimmed, read left to right: nouns, then needs, then states.')).toEqual([]);
  });
});
