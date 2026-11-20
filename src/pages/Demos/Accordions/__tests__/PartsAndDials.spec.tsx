import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt, partsIndex} from '@pages/Demos/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';

const maxHeightGuess = 'accordions/the-max-height-guess';
const chosen = '?type=inclusive&style=drawer';
const everyPart = (choices: string) => [
  `${demosAt('accordions', choices)}#html-alone-heading`,
  demosAt('accordions/a-box-remembers-the-fold', choices),
  demosAt('accordions/the-max-height-guess', choices),
  demosAt('accordions/the-measured-height', choices),
  demosAt('accordions/what-the-platform-gives-now', choices),
  demosAt('accordions/how-a-sliding-fold-moves', choices)
];
const howLong = /about 24 minutes/;

describe('the accordions panel', () => {
  test('should say on the accordions tab how long the parts take together', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await accordionsTab.partsAndDials()).toHaveTextContent(howLong);
  });

  test('should say on a part’s page how long the parts take together', async () => {
    render(<TestApp at={demosAt(maxHeightGuess)}/>);

    expect(await accordionsTab.partsAndDials()).toHaveTextContent(howLong);
  });

  test('should hold the six parts beside a part, as the tab does', async () => {
    render(<TestApp at={demosAt(maxHeightGuess)}/>);

    const index = await partsIndex.find();

    expect(accordionsTab.titlesIn(index)).toEqual(['An accordion in HTML alone',
      'A box remembers the fold, and a rule reads it', 'The max-height guess', 'The measured height',
      'What the platform gives now', 'How a sliding fold moves']);
  });

  test('should mark the part the reader is on as the current page', async () => {
    render(<TestApp at={demosAt(maxHeightGuess)}/>);

    const index = await partsIndex.find();

    expect(partsIndex.currentIn(index)).toHaveAccessibleName('The max-height guess');
  });

  test('should lead from a part’s page to every part, with the reader’s choices carried', async () => {
    render(<TestApp at={demosAt(maxHeightGuess, chosen)}/>);

    const index = await partsIndex.find();

    expect(partsIndex.addressesIn(index)).toEqual(everyPart(chosen));
  });

  test('should carry the fold type a reader chooses in it on a part’s page to every part', async () => {
    render(<TestApp at={demosAt(maxHeightGuess)}/>);

    await accordionsTab.choose('fold type', 'Inclusive');

    expect(partsIndex.addressesIn(await partsIndex.find())).toEqual(everyPart('?type=inclusive'));
  });

  test('should list the parts once on a part’s page, beside the part', async () => {
    render(<TestApp at={demosAt(maxHeightGuess)}/>);

    await partsIndex.find();

    expect(demoPage.entriesLinking(/An accordion in HTML alone$/)).toHaveLength(1);
  });

  test('should come after a part’s introduction and before its first exhibit', async () => {
    render(<TestApp at={demosAt('accordions/the-measured-height')}/>);

    const page = await explanation.part('Accordions');
    const introduction = explanation.saying(page, /^This part builds on two before it/);
    const foldType = accordionsTab.choiceIn(await accordionsTab.partsAndDials(), 'fold type');
    const exhibit = await accordionsTab.exhibit();

    expect(outOfReadingOrder([introduction, foldType, exhibit])).toEqual([]);
  });

  test('should title its parts beneath the part’s own title, so the part’s runs stay under the part', async () => {
    render(<TestApp at={demosAt('accordions/the-measured-height')}/>);

    expect(await partsIndex.titledAt(3)).toBeInTheDocument();
  });

  test('should title its parts beside the tab’s sections on the tab', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await partsIndex.titledAt(2)).toBeInTheDocument();
  });
});
