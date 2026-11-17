import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import names from '@navigation/names.json';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';

const htmlAlone = 'An accordion in HTML alone';

const parts = ['How we used to build a fold', 'What the platform gives now', 'How a sliding fold moves'];

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

  test('should start with HTML alone, then the fold choices, then tell the old way, the platform, and how a sliding fold moves', async () => {
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

  test('should show, with inclusive chosen, the inclusive details build under the platform', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(accordionsTab.buildsIn(explained)).toEqual(['Inclusive accordion using details elements']);
  });

  test('should show, with exclusive chosen, the exclusive details build under the platform', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(accordionsTab.buildsIn(explained)).toEqual(['Exclusive accordion using details elements']);
  });
});

describe('what the platform gives now', () => {
  test('should link, with inclusive chosen, the run that introduces details to the build’s source on GitHub', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(explanation.sourcesBeside(explained, /This build uses details and summary/)).toEqual(['Accordions/InclusiveToggleAccordion.tsx on GitHub']);
  });

  test('should link, with exclusive chosen, the run that introduces details to the build’s source on GitHub', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(explanation.sourcesBeside(explained, /This build uses details and summary/)).toEqual(['Accordions/ExclusiveToggleAccordion.tsx on GitHub']);
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
    expect(await accordionsTab.partsHolding(foldMotion, parts)).toEqual([]);
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

  test('should still show the first platform fold’s text after the reader chooses another motion', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const platform = await explanation.part(parts[1]);
    const text = await accordionsTab.openFirstFoldIn(platform);

    await accordionsTab.choose('fold motion', 'Drawer');

    expect(text).toBeVisible();
  });
});

describe('the accordions diagrams', () => {
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

describe('the old way', () => {
  test('should outline part one as what a fold remembers, the guess, then the measured height', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.sectionTitles(oldWay)).toEqual(['A box remembers the fold, and a rule reads it', 'The max-height guess', 'The measured height']);
  });

  test('following a box remembers the fold opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('A box remembers the fold, and a rule reads it');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/a-box-remembers-the-fold', '?type=inclusive&style=drawer'));
  });

  test('should say what a box remembering the fold holds, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, names.accordions['a-box-remembers-the-fold'].description)).toBeInTheDocument();
  });

  test('following the max-height guess opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('The max-height guess');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/the-max-height-guess', '?type=inclusive&style=drawer'));
  });

  test('should say what the max-height guess does, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, names.accordions['the-max-height-guess'].description)).toBeInTheDocument();
  });
});

describe('the accordion in HTML alone', () => {
  test('should hold three folds, basalt, cinder and meadow, in that order', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const part = await explanation.part(htmlAlone);

    expect(explanation.foldLabelsIn(part)).toEqual(['basalt', 'cinder', 'meadow']);
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

describe('the tab’s words on the build part 2 shows', () => {
  const build = '?type=inclusive&style=drawer';
  const remembers = demosAt('accordions/a-box-remembers-the-fold', build);

  test('should link the checkbox build, at its first use in what the platform gives and in How details works, to part 2’s page', async () => {
    render(<TestApp at={demosAt('accordions', build)}/>);

    const platformWay = await explanation.part(parts[1]);

    expect(explanation.linksNamed(platformWay, 'the checkbox build').map(link => link.getAttribute('href'))).toEqual([remembers, remembers]);
  });

  test('should, with inclusive chosen, link the checkbox build’s folds to part 2’s page', async () => {
    render(<TestApp at={demosAt('accordions', build)}/>);

    const platformWay = await explanation.part(parts[1]);

    expect(explanation.linkNamed(platformWay, 'the checkbox build’s folds')).toHaveAttribute('href', remembers);
  });

  test('should link classes in How details works to part 2’s page, where class is defined', async () => {
    render(<TestApp at={demosAt('accordions', build)}/>);

    const platformWay = await explanation.part(parts[1]);

    expect(explanation.linkNamed(platformWay, 'classes')).toHaveAttribute('href', remembers);
  });

  test('should link the known-height build’s bars to part 2’s page', async () => {
    render(<TestApp at={demosAt('accordions', build)}/>);

    const platformWay = await explanation.part(parts[1]);

    expect(explanation.linkNamed(platformWay, 'the known-height build’s bars')).toHaveAttribute('href', remembers);
  });
});

describe('the depth of each part', () => {

  test('should show, with exclusive chosen, what the closed fold "How details works" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part(parts[1]), 'How details works');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });
});
