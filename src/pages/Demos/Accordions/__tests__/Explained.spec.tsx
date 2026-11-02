import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {demoPage, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';

const htmlAlone = 'An accordion in HTML alone';

const togetherHeading = (type: string): string => `A ${type === 'exclusive' ? 'radio' : 'checkbox'} and a grid row: the old control, the new slide`;
const parts = ['How we used to build a fold', 'What the platform gives now', togetherHeading('exclusive'), 'How every fold moves'];

const drawingsTitled = (part: HTMLElement, titles: string[]): HTMLElement[] =>
  titles.map(title => explanation.drawingNamed(part, new RegExp(`^${title}\\.`)));

describe('the accordions tab', () => {
  test('should name no two regions the same, with inclusive chosen, so every landmark is its own', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    await explanation.part('Accordions');
    const names = explanation.partNames();

    expect(names.filter((name, at) => names.indexOf(name) !== at)).toEqual([]);
  });

  test('should name no two regions the same, with exclusive chosen, so every landmark is its own', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    await explanation.part('Accordions');
    const names = explanation.partNames();

    expect(names.filter((name, at) => names.indexOf(name) !== at)).toEqual([]);
  });

  test('should start with HTML alone, then the fold choices, then tell the old way, the platform, the two together, and how every fold moves', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');

    expect(explanation.partTitles(tab)).toEqual([htmlAlone, 'fold choices', ...parts]);
  });

  test('should hold both rows inside the section named by the fold choices’ heading', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const choices = await explanation.part('fold choices');

    expect(accordionsTab.choiceIn(choices, 'fold type')).toBeVisible();
    expect(accordionsTab.choiceIn(choices, 'fold motion')).toBeVisible();
  });

  test('should open on the exclusive type, and write the type chosen into the address', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const types = await accordionsTab.choice('fold type');
    expect(accordionsTab.option(types, 'Exclusive')).toBeChecked();

    await accordionsTab.choose('fold type', 'Inclusive');

    expect(demoPage.urlSearch()).toHaveTextContent('type=inclusive');
    expect(accordionsTab.option(types, 'Inclusive')).toBeChecked();
  });

  test('should show, with inclusive chosen, the two checkbox builds under the old way', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(parts[0]);

    expect(accordionsTab.buildsIn(explained)).toEqual(['Accordion using checkboxes and a measured height', 'Accordion using checkboxes and a known height']);
  });

  test('should show, with inclusive chosen, the inclusive details build under the platform', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(accordionsTab.buildsIn(explained)).toEqual(['Inclusive accordion using details elements']);
  });

  test('should show, with inclusive chosen, the checkbox build under the two together', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(togetherHeading('inclusive'));

    expect(accordionsTab.buildsIn(explained)).toEqual(['Inclusive accordion using checkboxes']);
  });

  test('should show, with exclusive chosen, the two radio group builds under the old way', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(parts[0]);

    expect(accordionsTab.buildsIn(explained)).toEqual(['Accordion using a radio group and a measured height', 'Accordion using a radio group and a known height']);
  });

  test('should show, with exclusive chosen, the exclusive details build under the platform', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(accordionsTab.buildsIn(explained)).toEqual(['Exclusive accordion using details elements']);
  });

  test('should show, with exclusive chosen, the radio group build under the two together', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(togetherHeading('exclusive'));

    expect(accordionsTab.buildsIn(explained)).toEqual(['Exclusive accordion using radio group']);
  });
});

describe('the words and the code chosen by type', () => {
  test('should, with inclusive chosen, link the run on the box to the plain fold’s HTML on GitHub', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.sourcesBeside(oldWay, /To open and close a fold/)).toEqual(['Plain/fold.html on GitHub']);
  });

  test('should, with exclusive chosen, show a sample beside the run on the box that links no file on GitHub', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.codeBeside(oldWay, /To open and close a fold/)).toBeInTheDocument();
    expect(explanation.sourcesBeside(oldWay, /To open and close a fold/)).toEqual([]);
  });
});

describe('what the platform gives now', () => {
  test('should link, with inclusive chosen, the run that introduces details to the build’s source on GitHub', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(explanation.sourcesBeside(explained, /This build uses details and summary/)).toEqual(['Accordions/Accordions.tsx on GitHub']);
  });

  test('should link, with exclusive chosen, the run that introduces details to the build’s source on GitHub', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(explanation.sourcesBeside(explained, /This build uses details and summary/)).toEqual(['Accordions/Accordions.tsx on GitHub']);
  });
});

describe('the measured build', () => {
  test('should show the fold measured by plain script under the heading "The measured height"', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const measured = await explanation.part('The measured height');

    expect(await accordionsTab.foldMeasuredByPlainScript(measured)).toBeInTheDocument();
  });

  test('should link the run that tells the two layout effects to the React build’s source on GitHub', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);

    expect(explanation.sourcesBeside(explained, /The script makes the moves in two layout effects/)).toEqual(['Accordions/MeasuredPanel.tsx on GitHub']);
  });

  test('should link the run that turns a fold around to the React build’s source on GitHub', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);

    expect(explanation.sourcesBeside(explained, /turns around from where it is/)).toEqual(['Accordions/MeasuredPanel.tsx on GitHub']);
  });
});

describe('the fold choices', () => {
  test('should answer the drawer, through the fold motion dial, with what it does and what a reader who asks for less motion gets', async () => {
    render(<TestApp at={demosAt('accordions', '?style=drawer')}/>);

    const reading = accordionsTab.readingIn(await accordionsTab.choiceRow('fold motion'));

    expect(reading).toHaveTextContent('The text slides down from under its bar.');
    expect(reading).toHaveTextContent('If your system asks for less motion, every fold here opens at once, whichever you choose.');
  });

  test('should read the chosen fold type, and read the other once it is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const row = await accordionsTab.choiceRow('fold type');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('Opening one fold closes the others.');

    await accordionsTab.choose('fold type', 'Inclusive');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('Any number of folds can be open at once.');
  });

  test('should read Reveal as the fold motion once it is chosen over static', async () => {
    render(<TestApp at={demosAt('accordions', '?style=static')}/>);

    const row = await accordionsTab.choiceRow('fold motion');
    await accordionsTab.choose('fold motion', 'Reveal');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('The text is uncovered from its first line down.');
  });

  test('should read Drawer as the fold motion once it is chosen over static', async () => {
    render(<TestApp at={demosAt('accordions', '?style=static')}/>);

    const row = await accordionsTab.choiceRow('fold motion');
    await accordionsTab.choose('fold motion', 'Drawer');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('The text slides down from under its bar.');
  });

  test('should read Static as the fold motion once it is chosen over reveal', async () => {
    render(<TestApp at={demosAt('accordions', '?style=reveal')}/>);

    const row = await accordionsTab.choiceRow('fold motion');
    await accordionsTab.choose('fold motion', 'Static');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('The fold opens at once, with nothing moving.');
  });
});

describe('the fold motion', () => {
  test('should sit after the accordion in HTML alone, right after the fold type, before the old way, and in no part', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');
    const start = explanation.partIn(tab, htmlAlone);
    const oldWay = explanation.partIn(tab, parts[0]);
    const foldType = accordionsTab.choiceIn(tab, 'fold type');
    const foldMotion = accordionsTab.choiceIn(tab, 'fold motion');

    expect(outOfReadingOrder([start, foldType, foldMotion, oldWay])).toEqual([]);
    for (const part of parts) {
      expect(await explanation.part(part)).not.toContainElement(foldMotion);
    }
  });

  test('should open on the reveal', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const motions = await accordionsTab.choice('fold motion');

    expect(accordionsTab.option(motions, 'Reveal')).toBeChecked();
  });

  test('should write the motion chosen into the address', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const motions = await accordionsTab.choice('fold motion');

    await accordionsTab.choose('fold motion', 'Drawer');

    expect(demoPage.urlSearch()).toHaveTextContent('style=drawer');
    expect(accordionsTab.option(motions, 'Drawer')).toBeChecked();
  });

  test('should keep an open fold open when the reader chooses another motion', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const together = await explanation.part(parts[2]);
    const first = await accordionsTab.openFirstFold(together);

    await accordionsTab.choose('fold motion', 'Drawer');

    expect(first).toBeChecked();
  });

  test('should draw, with reveal chosen, under the two together, the row that grows and the padding inside the clip, in order', async () => {
    render(<TestApp at={demosAt('accordions', '?style=reveal')}/>);

    const together = await explanation.part(parts[2]);

    expect(drawingsTitled(together, ['A row that grows to its content', 'The padding inside the clip'])).toEqual(explanation.drawingsIn(together));
  });

  test('should draw, with drawer chosen, under the two together, the row that grows, the padding inside the clip, then the text riding the row’s edge', async () => {
    render(<TestApp at={demosAt('accordions', '?style=drawer')}/>);

    const together = await explanation.part(parts[2]);

    expect(drawingsTitled(together, ['A row that grows to its content', 'The padding inside the clip', 'The text rides the row’s edge'])).toEqual(explanation.drawingsIn(together));
  });

  test('should draw, with static chosen, under the two together, the row that grows and the padding inside the clip, in order', async () => {
    render(<TestApp at={demosAt('accordions', '?style=static')}/>);

    const together = await explanation.part(parts[2]);

    expect(drawingsTitled(together, ['A row that grows to its content', 'The padding inside the clip'])).toEqual(explanation.drawingsIn(together));
  });
});

describe('the accordions diagrams', () => {
  test('should draw, with inclusive chosen, under the old way, each mechanism in order, found by its name', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(drawingsTitled(oldWay, ['The rule matches the box', 'One guess, two folds', 'The known height', 'Off screen, not gone', 'Two borders, turned', 'Focus on the box, drawn on the bar']))
      .toEqual(explanation.drawingsIn(oldWay));
  });

  test('should draw, with exclusive chosen, under the old way, each mechanism in order, ending on the one name, found by its name', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(drawingsTitled(oldWay, ['The rule matches the box', 'One guess, two folds', 'The known height', 'Off screen, not gone', 'Two borders, turned', 'Focus on the box, drawn on the bar', 'One name, one choice']))
      .toEqual(explanation.drawingsIn(oldWay));
  });

  test('should draw, with inclusive chosen, under the platform, each mechanism in order, found by its name', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const platform = await explanation.part(parts[1]);

    expect(drawingsTitled(platform, ['One job, two ways', 'Three pieces become two', 'Sized to the text'])).toEqual(explanation.drawingsIn(platform));
  });

  test('should draw, with exclusive chosen, under the platform, each mechanism in order, found by its name', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const platform = await explanation.part(parts[1]);

    expect(drawingsTitled(platform, ['One job, two ways', 'Three pieces become two', 'Sized to the text'])).toEqual(explanation.drawingsIn(platform));
  });
});

describe('the max-height guess', () => {
  test('should outline part one, with inclusive chosen, as what a fold remembers, the guess, the measured height, then the known height', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.sectionTitles(oldWay)).toEqual(['A box remembers the fold, and a rule reads it', 'The max-height guess', 'The measured height', 'Accordion using checkboxes and a measured height', 'Accordion using checkboxes and a known height']);
  });

  test('should outline part one, with exclusive chosen, as what a fold remembers, the guess, the measured height, then the known height', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.sectionTitles(oldWay)).toEqual(['A box remembers the fold, and a rule reads it', 'The max-height guess', 'The measured height', 'Accordion using a radio group and a measured height', 'Accordion using a radio group and a known height']);
  });
});

describe('the accordion in HTML alone', () => {
  test('should hold three folds, basalt, cinder and meadow, in that order', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const folds = explanation.foldsIn(await explanation.part(htmlAlone));

    expect(folds).toHaveLength(3);
    ['basalt', 'cinder', 'meadow'].forEach((name, at) => expect(explanation.saying(folds[at], name)).toBeInTheDocument());
  });

  test('should open its part on the three folds', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const firstRun = explanation.runsIn(await explanation.part(htmlAlone))[0];

    expect(explanation.foldsIn(firstRun)).toHaveLength(3);
  });
});

describe('the name that makes the first accordion exclusive', () => {
  test('should, with exclusive chosen, link name to MDN beside the first accordion', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const first = await explanation.part(htmlAlone);

    expect(explanation.linksBeside(first, /^Each of these details carries/)).toEqual([['name', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#name']]);
  });
});

describe('the depth of each part', () => {
  test('should show, with exclusive chosen, what the closed fold "How this site does it" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part(parts[0]), 'How this site does it');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });

  test('should show, with exclusive chosen, what the closed fold "How the known height works" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part(parts[0]), 'How the known height works');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });

  test('should show, with exclusive chosen, what the closed fold "How details works" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part(parts[1]), 'How details works');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });

  test('should show, with exclusive chosen, what the closed fold "How the radio and the grid row work together" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part(togetherHeading('exclusive')), 'How the radio and the grid row work together');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });

  test('should show, with inclusive chosen, what the closed fold "How the checkbox and the grid row work together" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);
    const fold = recipeFolds.story(await explanation.part(togetherHeading('inclusive')), 'How the checkbox and the grid row work together');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });
});

describe('the known-height build’s style sheet reading the hidden input', () => {
  const matchesOnTheInput = /Now a rule has to match on/;
  const mdnLinks = [
    [':checked', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:checked'],
    ['combinator', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator']
  ];

  test('should link the pseudo-class and the combinator to MDN, with inclusive chosen', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.linksBeside(oldWay, matchesOnTheInput)).toEqual(expect.arrayContaining(mdnLinks));
  });

  test('should link the pseudo-class and the combinator to MDN, with exclusive chosen', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.linksBeside(oldWay, matchesOnTheInput)).toEqual(expect.arrayContaining(mdnLinks));
  });
});

describe('how the known height works', () => {
  const knownHeightWorks = 'How the known height works';
  const threeParts = /^The fold is the three parts from/;

  test('should link, with inclusive chosen, the fold’s run to the build’s source on GitHub', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const folded = recipeFolds.story(await explanation.part(parts[0]), knownHeightWorks);

    expect(explanation.sourcesBeside(folded, threeParts)).toEqual(['Accordions/Accordions.tsx on GitHub']);
  });

  test('should link, with exclusive chosen, the fold’s run to the build’s source on GitHub', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const folded = recipeFolds.story(await explanation.part(parts[0]), knownHeightWorks);

    expect(explanation.sourcesBeside(folded, threeParts)).toEqual(['Accordions/Accordions.tsx on GitHub']);
  });
});

describe('the links to other tabs', () => {
  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await demoTabs.arrivedOn('Accordions');

    expect(demoPage.linksToTabsIn(tab)).toEqual([
      ['z-index tab', `${Paths.demos}z-index/`],
      ['React', `${Paths.demos}z-index/`]
    ]);
  });
});
