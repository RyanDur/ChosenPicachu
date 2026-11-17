import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import names from '@navigation/names.json';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';

const htmlAlone = 'An accordion in HTML alone';

const parts = ['How we used to build a fold', 'What the platform gives now', 'How a sliding fold moves'];

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

  test('should give the max-height guess’s reading time in the singular, as one minute', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const guess = explanation.partIn(await explanation.part(parts[0]), 'The max-height guess');

    expect(explanation.saying(guess, '1 minute to read')).toBeInTheDocument();
  });

  test('should say what the max-height guess does, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, names.accordions['the-max-height-guess'].description)).toBeInTheDocument();
  });
});

describe('what the platform gives now, on the tab', () => {
  test('following what the platform gives now opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('What the platform gives now');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/what-the-platform-gives-now', '?type=inclusive&style=drawer'));
  });

  test('should say what the platform gives now, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const platformWay = await explanation.part(parts[1]);

    expect(explanation.saying(platformWay, names.accordions['what-the-platform-gives-now'].description)).toBeInTheDocument();
  });
});

describe('how a sliding fold moves, on the tab', () => {
  test('following how a sliding fold moves opens its page, with the fold choices carried', async () => {
    const from = demosAt('accordions', '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('How a sliding fold moves');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/how-a-sliding-fold-moves', '?type=inclusive&style=drawer'));
  });

  test('should say how a sliding fold moves, under its title', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const slidingFold = await explanation.part(parts[2]);

    expect(explanation.saying(slidingFold, names.accordions['how-a-sliding-fold-moves'].description)).toBeInTheDocument();
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
