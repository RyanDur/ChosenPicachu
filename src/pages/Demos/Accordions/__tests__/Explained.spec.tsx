import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import names from '@navigation/names.json';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';
import {accordionParts} from '@pages/Demos/Accordions/part-pages';

const htmlAlone = 'An accordion in HTML alone';

const titles = [htmlAlone, 'A box remembers the fold, and a rule reads it', 'The max-height guess', 'The measured height',
  'What the platform gives now', 'How a sliding fold moves'];

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

  test('should title the contents, then the fold choices, then before you start', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');

    expect(explanation.partTitles(tab)).toEqual(['Contents', 'fold choices', 'Before you start']);
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

});

describe('the fold choices', () => {
  test('should answer the drawer, through the fold motion dial, with what it does on the part pages and what a reader who asks for less motion gets there', async () => {
    render(<TestApp at={demosAt('accordions', '?style=drawer')}/>);

    const reading = accordionsTab.readingIn(await accordionsTab.choiceRow('fold motion'));

    expect(reading).toHaveTextContent('On the part pages, the text slides down from under its bar.');
    expect(reading).toHaveTextContent('If your system asks for less motion, every fold on the part pages opens at once, whichever you choose.');
  });

  test('should read the chosen fold type, and read the other once it is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const row = await accordionsTab.choiceRow('fold type');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('Opening one fold closes the others.');

    await accordionsTab.choose('fold type', 'Inclusive');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('Any number of folds can be open at once.');
  });

  test('should read Reveal as the fold motion on the part pages once it is chosen over static', async () => {
    render(<TestApp at={demosAt('accordions', '?style=static')}/>);

    const row = await accordionsTab.choiceRow('fold motion');
    await accordionsTab.choose('fold motion', 'Reveal');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('On the part pages, the text is uncovered from its first line down.');
  });

  test('should read Drawer as the fold motion on the part pages once it is chosen over static', async () => {
    render(<TestApp at={demosAt('accordions', '?style=static')}/>);

    const row = await accordionsTab.choiceRow('fold motion');
    await accordionsTab.choose('fold motion', 'Drawer');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('On the part pages, the text slides down from under its bar.');
  });

  test('should read Static as the fold motion on the part pages once it is chosen over reveal', async () => {
    render(<TestApp at={demosAt('accordions', '?style=reveal')}/>);

    const row = await accordionsTab.choiceRow('fold motion');
    await accordionsTab.choose('fold motion', 'Static');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('On the part pages, the fold opens at once, with nothing moving.');
  });
});

describe('the fold motion', () => {
  test('should sit after the contents, right after the fold type, before before you start, and in neither', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');
    const contents = explanation.partIn(tab, 'Contents');
    const beforeYouStart = explanation.partIn(tab, 'Before you start');
    const foldType = accordionsTab.choiceIn(tab, 'fold type');
    const foldMotion = accordionsTab.choiceIn(tab, 'fold motion');

    expect(outOfReadingOrder([contents, foldType, foldMotion, beforeYouStart])).toEqual([]);
    expect(await accordionsTab.partsHolding(foldMotion, ['Contents', 'Before you start'])).toEqual([]);
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

});

describe('the contents', () => {
  test('should list the six parts in order, the accordion in HTML alone first', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const contents = await accordionsTab.contents();

    expect(accordionsTab.titlesIn(contents)).toEqual(titles);
  });

  test('should list the three old ways under how we used to build a fold', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const contents = await accordionsTab.contents();

    expect(accordionsTab.titlesUnder(contents, 'How we used to build a fold')).toEqual(titles.slice(1, 4));
  });

  test('should list the platform and how a sliding fold moves under what the platform gives now', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const contents = await accordionsTab.contents();

    expect(accordionsTab.titlesUnder(contents, 'What the platform gives now')).toEqual(titles.slice(4));
  });

  test('should come after the accordion in HTML alone, and before before you start', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const contents = await accordionsTab.contents();
    const accordion = await accordionsTab.exhibit();
    const beforeYouStart = await explanation.part('Before you start');

    expect(outOfReadingOrder([accordion, contents, beforeYouStart])).toEqual([]);
  });

  test('should give the accordion in HTML alone its minutes, as 1 min', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.contents(), htmlAlone);

    expect(explanation.saying(entry, '1 min')).toBeInTheDocument();
  });

  test('should give the measured height its minutes, as 5 min', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.contents(), 'The measured height');

    expect(explanation.saying(entry, '5 min')).toBeInTheDocument();
  });

  test('should say what the accordion in HTML alone does, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.contents(), htmlAlone);

    expect(explanation.saying(entry, accordionParts.listed('html-alone-heading').says)).toBeInTheDocument();
  });

  test('following a box remembers the fold, and a rule reads it opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('A box remembers the fold, and a rule reads it');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/a-box-remembers-the-fold', '?type=inclusive&style=drawer'));
  });

  test('should say what a box remembers the fold, and a rule reads it does, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.contents(), 'A box remembers the fold, and a rule reads it');

    expect(explanation.saying(entry, names.accordions['a-box-remembers-the-fold'].description)).toBeInTheDocument();
  });

  test('following the max-height guess opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('The max-height guess');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/the-max-height-guess', '?type=inclusive&style=drawer'));
  });

  test('should say what the max-height guess does, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.contents(), 'The max-height guess');

    expect(explanation.saying(entry, names.accordions['the-max-height-guess'].description)).toBeInTheDocument();
  });

  test('following the measured height opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('The measured height');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/the-measured-height', '?type=inclusive&style=drawer'));
  });

  test('should say what the measured height does, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.contents(), 'The measured height');

    expect(explanation.saying(entry, names.accordions['the-measured-height'].description)).toBeInTheDocument();
  });

  test('following what the platform gives now opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('What the platform gives now');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/what-the-platform-gives-now', '?type=inclusive&style=drawer'));
  });

  test('should say what what the platform gives now does, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.contents(), 'What the platform gives now');

    expect(explanation.saying(entry, names.accordions['what-the-platform-gives-now'].description)).toBeInTheDocument();
  });

  test('following how a sliding fold moves opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('How a sliding fold moves');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/how-a-sliding-fold-moves', '?type=inclusive&style=drawer'));
  });

  test('should say what how a sliding fold moves does, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.contents(), 'How a sliding fold moves');

    expect(explanation.saying(entry, names.accordions['how-a-sliding-fold-moves'].description)).toBeInTheDocument();
  });
});

describe('the accordion in HTML alone', () => {
  test('should hold three folds above the contents, basalt, cinder and meadow, in that order', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const exhibit = await accordionsTab.exhibit();

    expect(explanation.foldLabelsIn(exhibit)).toEqual(['basalt', 'cinder', 'meadow']);
  });

  test('should open its part before you start on its HTML', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const firstRun = explanation.runsIn(await explanation.part(htmlAlone))[0];

    expect(explanation.codeIn(firstRun)).not.toEqual([]);
  });
});

describe('the name that makes the first accordion exclusive', () => {
  test('should, with exclusive chosen, link name to MDN beside the first accordion', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const first = await explanation.part(htmlAlone);

    expect(explanation.linksBeside(first, /^Each of these details carries/)).toEqual([['name', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#name']]);
  });
});
