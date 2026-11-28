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
const source = 'The exhibit’s source';

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

  test('should title the exhibit, then its source', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');

    expect(explanation.partTitles(tab)).toEqual([htmlAlone, source]);
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

describe('the fold type in the exhibit’s foot', () => {
  test('should read the chosen fold type, and read the other once it is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const row = await accordionsTab.choiceRow('fold type');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('Opening one fold closes the others.');

    await accordionsTab.choose('fold type', 'Inclusive');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('Opening one fold leaves the others as they are.');
  });

  test('should sit in the exhibit, after its folds', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const exhibit = await accordionsTab.htmlAlone();
    const foldType = accordionsTab.choiceIn(exhibit, 'fold type');

    expect(outOfReadingOrder([await accordionsTab.firstFigure(), foldType])).toEqual([]);
  });
});

describe('the parts index', () => {
  test('should list the six parts in order, the accordion in HTML alone first', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const partsIndex = await accordionsTab.partsIndex();

    expect(accordionsTab.titlesIn(partsIndex)).toEqual(titles);
  });

  test('should list the three old ways under how we used to build a fold', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const partsIndex = await accordionsTab.partsIndex();

    expect(accordionsTab.titlesUnder(partsIndex, 'How we used to build a fold')).toEqual(titles.slice(1, 4));
  });

  test('should list the platform and how a sliding fold moves under what the platform gives now', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const partsIndex = await accordionsTab.partsIndex();

    expect(accordionsTab.titlesUnder(partsIndex, 'What the platform gives now')).toEqual(titles.slice(4));
  });

  test('should come before the accordion in HTML alone and the exhibit’s source', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const partsIndex = await accordionsTab.partsIndex();
    const accordion = await accordionsTab.htmlAlone();
    const itsSource = await explanation.part(source);

    expect(outOfReadingOrder([partsIndex, accordion, itsSource])).toEqual([]);
  });

  test('should mark no part as the current page on the tab, though the accordion in HTML alone stands on it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const partsIndex = await accordionsTab.partsIndex();

    expect(accordionsTab.currentPagesIn(partsIndex)).toEqual([]);
  });

  test('should give the accordion in HTML alone its minutes, as 1 min', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.partsIndex(), htmlAlone);

    expect(explanation.saying(entry, '1 min')).toBeInTheDocument();
  });

  test('should give the measured height its minutes, as 5 min', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.partsIndex(), 'The measured height');

    expect(explanation.saying(entry, '5 min')).toBeInTheDocument();
  });

  test('should say what the part “An accordion in HTML alone” does, under its title, on a one-column page', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.partsIndex(), htmlAlone);

    expect(explanation.saying(entry, accordionParts.listed('html-alone-heading').says)).toBeInTheDocument();
  });

  test('following a box remembers the fold, and a rule reads it opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('A box remembers the fold, and a rule reads it');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/a-box-remembers-the-fold', '?type=inclusive&style=drawer'));
  });

  test('should say what the part “A box remembers the fold, and a rule reads it” does, under its title, on a one-column page', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.partsIndex(), 'A box remembers the fold, and a rule reads it');

    expect(explanation.saying(entry, names.accordions['a-box-remembers-the-fold'].description)).toBeInTheDocument();
  });

  test('following the max-height guess opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('The max-height guess');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/the-max-height-guess', '?type=inclusive&style=drawer'));
  });

  test('should say what the part “The max-height guess” does, under its title, on a one-column page', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.partsIndex(), 'The max-height guess');

    expect(explanation.saying(entry, names.accordions['the-max-height-guess'].description)).toBeInTheDocument();
  });

  test('following the measured height opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('The measured height');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/the-measured-height', '?type=inclusive&style=drawer'));
  });

  test('should say what the part “The measured height” does, under its title, on a one-column page', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.partsIndex(), 'The measured height');

    expect(explanation.saying(entry, names.accordions['the-measured-height'].description)).toBeInTheDocument();
  });

  test('following what the platform gives now opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('What the platform gives now');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/what-the-platform-gives-now', '?type=inclusive&style=drawer'));
  });

  test('should say what the part “What the platform gives now” does, under its title, on a one-column page', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.partsIndex(), 'What the platform gives now');

    expect(explanation.saying(entry, names.accordions['what-the-platform-gives-now'].description)).toBeInTheDocument();
  });

  test('following how a sliding fold moves opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('How a sliding fold moves');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/how-a-sliding-fold-moves', '?type=inclusive&style=drawer'));
  });

  test('should say what the part “How a sliding fold moves” does, under its title, on a one-column page', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const entry = accordionsTab.entryOf(await accordionsTab.partsIndex(), 'How a sliding fold moves');

    expect(explanation.saying(entry, names.accordions['how-a-sliding-fold-moves'].description)).toBeInTheDocument();
  });
});

describe('the accordion in HTML alone', () => {
  test('should hold three folds, basalt, cinder and meadow, in that order', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const folds = await accordionsTab.firstFigure();

    expect(explanation.foldLabelsIn(folds)).toEqual(['basalt', 'cinder', 'meadow']);
  });

  test('should say beside its name that it is written in HTML, with no CSS and no script', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const exhibit = await accordionsTab.htmlAlone();

    expect(accordionsTab.writtenInOf(exhibit)).toEqual(['HTML', 'no CSS', 'no script']);
  });

  test('should open its source with its HTML', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const firstRun = explanation.runsIn(await explanation.part(source))[0];

    expect(explanation.samplesIn(firstRun)[0]).toHaveTextContent('<summary>basalt</summary>');
  });
});

describe('the name that makes the first accordion exclusive', () => {
  test('should, with exclusive chosen, link name to MDN beside the first accordion', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const itsSource = await explanation.part(source);

    expect(explanation.linksBeside(itsSource, /^Each of these details carries/)).toEqual([['name', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#name']]);
  });
});
