import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {bookMap, demosAt} from '@pages/Demos/__test_support';

const accordionsMap = bookMap('the accordions map');

const chosen = '?type=inclusive&style=drawer';
const everyPart = [
  ['1. An accordion in HTML alone', `${demosAt('accordions', chosen)}#html-alone-heading`],
  ['2. A box remembers the fold, and a rule reads it', demosAt('accordions/a-box-remembers-the-fold', chosen)],
  ['3. The max-height guess', demosAt('accordions/the-max-height-guess', chosen)],
  ['4. The measured height', demosAt('accordions/the-measured-height', chosen)],
  ['5. What the platform gives now', demosAt('accordions/what-the-platform-gives-now', chosen)],
  ['6. How a sliding fold moves', demosAt('accordions/how-a-sliding-fold-moves', chosen)]
];
const howLong = /about 24 minutes/;

describe('the accordions map', () => {
  test('should say on the accordions tab how long the parts take together', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await accordionsMap.says()).toHaveTextContent(howLong);
  });

  test('should give only the size on the accordions tab, where the listings already name the parts', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await accordionsMap.says();

    expect(accordionsMap.listed()).not.toBeInTheDocument();
  });

  test('should say on a part’s page how long the parts take together', async () => {
    render(<TestApp at={demosAt('accordions/the-max-height-guess')}/>);

    expect(await accordionsMap.saysInTheMap()).toHaveTextContent(howLong);
  });

  test('should lead from a part’s page to every part, with the reader’s choices carried', async () => {
    render(<TestApp at={demosAt('accordions/the-max-height-guess', chosen)}/>);

    expect(await accordionsMap.signposts()).toEqual(everyPart);
  });

  test('should mark the part the reader is on', async () => {
    render(<TestApp at={demosAt('accordions/the-max-height-guess', chosen)}/>);

    expect(await accordionsMap.current()).toHaveTextContent('3. The max-height guess');
  });
});
