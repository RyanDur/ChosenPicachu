import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {demoPage, demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';

const remembers = 'accordions/a-box-remembers-the-fold';
const title = 'A box remembers the fold, and a rule reads it';
const knownHeightWorks = 'How the known height works';
describe('a box remembers the fold, on its own page', () => {
  test('should say its place in the accordions book', async () => {
    render(<TestApp at={demosAt(remembers)}/>);

    expect(await accordionsTab.place()).toHaveTextContent('Accordions · part 2 of 6');
  });

  test('should open on the known-height fold, before the runs that tell it', async () => {
    render(<TestApp at={demosAt(remembers)}/>);

    const part = await explanation.part(title);

    expect(outOfReadingOrder([accordionsTab.buildIn(part), explanation.saying(part, /To open and close a fold/)])).toEqual([]);
  });

  test('should build the known-height fold with checkboxes when inclusive is carried to it', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive')}/>);

    const part = await explanation.part(title);

    expect(accordionsTab.buildsIn(part)).toEqual(['Accordion using checkboxes and a known height']);
  });

  test('should build the known-height fold with a radio group when exclusive is carried to it', async () => {
    render(<TestApp at={demosAt(remembers, '?type=exclusive')}/>);

    const part = await explanation.part(title);

    expect(accordionsTab.buildsIn(part)).toEqual(['Accordion using a radio group and a known height']);
  });

  test('a reader who arrives with inclusive can choose exclusive on the page, and gets the radio group build', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive')}/>);
    const part = await explanation.part(title);

    await accordionsTab.choose('fold type', 'Exclusive');

    expect(accordionsTab.buildsIn(part)).toEqual(['Accordion using a radio group and a known height']);
  });

  test('should lead back to part one on the tab and on to part three’s page, by number and title, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive&style=drawer')}/>);

    expect(await pageFoot.leadsOn('the accordions parts')).toEqual([
      ['Previous: 1. An accordion in HTML alone', `${demosAt('accordions', '?type=inclusive&style=drawer')}#html-alone-heading`],
      ['Next: 3. The max-height guess', demosAt('accordions/the-max-height-guess', '?type=inclusive&style=drawer')]
    ]);
  });

  test('should title its page with the tab and the part', async () => {
    render(<TestApp at={demosAt(remembers)}/>);

    expect(await demoTabs.title(`Demos Accordions · ${title}`)).toBeInTheDocument();
  });

  test('should keep Accordions as the current tab', async () => {
    render(<TestApp at={demosAt(remembers)}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Accordions']);
  });

  test('should link part one on the tab, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive&style=drawer')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(explanation.opener(part), 'An accordion in HTML alone'))
      .toHaveAttribute('href', `${demosAt('accordions', '?type=inclusive&style=drawer')}#html-alone-heading`);
  });

  test('should link the fold choices on the tab, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive&style=drawer')}/>);

    const page = await demoTabs.arrivedOn('Accordions');

    expect(explanation.linkNamed(page, 'the fold choices'))
      .toHaveAttribute('href', `${demosAt('accordions', '?type=inclusive&style=drawer')}#fold-choices-heading`);
  });

  test('should link React to the z-index part that defines it', async () => {
    render(<TestApp at={demosAt(remembers)}/>);

    const page = await demoTabs.arrivedOn('Accordions');

    expect(demoPage.linksToPageIn(page, `${Paths.demos}z-index/why-the-popover-wins/`)).toEqual([
      ['React', `${Paths.demos}z-index/why-the-popover-wins/`]
    ]);
  });
});

describe('the box that remembers the fold, chosen by type', () => {
  test('should, with inclusive chosen, show a sample beside the run on the box that links no file on GitHub', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive')}/>);

    const part = await explanation.part(title);

    expect(explanation.codeBeside(part, /To open and close a fold/)).toBeInTheDocument();
    expect(explanation.sourcesBeside(part, /To open and close a fold/)).toEqual([]);
  });

  test('should, with exclusive chosen, show a sample beside the run on the box that links no file on GitHub', async () => {
    render(<TestApp at={demosAt(remembers, '?type=exclusive')}/>);

    const part = await explanation.part(title);

    expect(explanation.codeBeside(part, /To open and close a fold/)).toBeInTheDocument();
    expect(explanation.sourcesBeside(part, /To open and close a fold/)).toEqual([]);
  });
});

describe('the attribute part 2 leans on', () => {
  test('should, with inclusive chosen, link attribute to where the tab defines it, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive&style=drawer')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'attribute')).toHaveAttribute('href', `${demosAt('accordions', '?type=inclusive&style=drawer')}#html-alone-heading`);
  });

  test('should, with exclusive chosen, link attribute to where the tab defines it, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(remembers, '?type=exclusive&style=drawer')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'attribute')).toHaveAttribute('href', `${demosAt('accordions', '?type=exclusive&style=drawer')}#html-alone-heading`);
  });
});

describe('the rule that reads the box', () => {
  const matchesOnTheInput = /Now a rule has to match on/;
  const mdnLinks = [
    [':checked', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:checked'],
    ['combinator', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator']
  ];

  test('should link the pseudo-class and the combinator to MDN, with inclusive chosen', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive')}/>);

    const part = await explanation.part(title);

    expect(explanation.linksBeside(part, matchesOnTheInput)).toEqual(expect.arrayContaining(mdnLinks));
  });

  test('should link the pseudo-class and the combinator to MDN, with exclusive chosen', async () => {
    render(<TestApp at={demosAt(remembers, '?type=exclusive')}/>);

    const part = await explanation.part(title);

    expect(explanation.linksBeside(part, matchesOnTheInput)).toEqual(expect.arrayContaining(mdnLinks));
  });
});

describe('the drawings of a box remembering the fold', () => {
  test('should draw, with inclusive chosen, each mechanism in order, found by its name', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive')}/>);

    const part = await explanation.part(title);

    expect(explanation.drawingsTitled(part, ['The rule matches the box', 'The known height', 'Off screen, not gone', 'Two borders, turned', 'Focus on the box, drawn on the bar']))
      .toEqual(explanation.drawingsIn(part));
  });

  test('should draw, with exclusive chosen, each mechanism in order, ending on the one name, found by its name', async () => {
    render(<TestApp at={demosAt(remembers, '?type=exclusive')}/>);

    const part = await explanation.part(title);

    expect(explanation.drawingsTitled(part, ['The rule matches the box', 'The known height', 'Off screen, not gone', 'Two borders, turned', 'Focus on the box, drawn on the bar', 'One name, one choice']))
      .toEqual(explanation.drawingsIn(part));
  });
});

describe('how the known height works', () => {
  const threeParts = /^The fold is the three parts from the runs above/;

  test('should show, with exclusive chosen, what the closed fold holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt(remembers, '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part(title), knownHeightWorks);
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });

  test('should show the bar’s own rule linked to its file, and its shared look apart from it, linked to the site’s drawing style sheet on GitHub', async () => {
    render(<TestApp at={demosAt(remembers)}/>);

    const folded = recipeFolds.story(await explanation.part(title), knownHeightWorks);

    expect(explanation.sampleFilesBeside(folded, /The bar looks like the site’s diagrams/)).toEqual([
      ['Accordions/Accordions.css on GitHub'],
      ['styles/drawing.css on GitHub']
    ]);
  });

  test('should show, with inclusive chosen, the build’s source beside the fold’s run linked to its file', async () => {
    render(<TestApp at={demosAt(remembers, '?type=inclusive')}/>);

    const folded = recipeFolds.story(await explanation.part(title), knownHeightWorks);

    expect(explanation.sampleFilesBeside(folded, threeParts)).toEqual([['Accordions/InclusiveAccordion.tsx on GitHub']]);
  });

  test('should show, with exclusive chosen, the build’s source beside the fold’s run linked to its file', async () => {
    render(<TestApp at={demosAt(remembers, '?type=exclusive')}/>);

    const folded = recipeFolds.story(await explanation.part(title), knownHeightWorks);

    expect(explanation.sampleFilesBeside(folded, threeParts)).toEqual([['Accordions/ExclusiveAccordion.tsx on GitHub']]);
  });
});
