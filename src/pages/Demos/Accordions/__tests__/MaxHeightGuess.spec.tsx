import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';

const guess = 'accordions/the-max-height-guess';
const title = 'The max-height guess';
const build = '?type=inclusive&style=drawer';

describe('the max-height guess, on its own page', () => {
  test('should say its place in the accordions book', async () => {
    render(<TestApp at={demosAt(guess)}/>);

    expect(await accordionsTab.place()).toHaveTextContent('Accordions · part 3 of 6');
  });

  test('should draw one guess against two folds', async () => {
    render(<TestApp at={demosAt(guess)}/>);

    const part = await explanation.part(title);

    expect(explanation.drawingsIn(part)).toEqual([explanation.drawingNamed(part, /^One guess, two folds\./)]);
  });

  test('should link the part it builds on to that part’s page, with the fold choices carried', async () => {
    const from = demosAt(guess, build);
    render(<TestApp at={from}/>);

    await accordionsTab.followInIntroduction(title, 'A box remembers the fold, and a rule reads it');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/a-box-remembers-the-fold', build));
  });

  test('should link transition to part 2’s page, where it is defined, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(guess, build)}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'transition')).toHaveAttribute('href', demosAt('accordions/a-box-remembers-the-fold', build));
  });

  test('should lead back to part two’s page and on to part four’s, by number and title, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(guess, build)}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 2. A box remembers the fold, and a rule reads it', demosAt('accordions/a-box-remembers-the-fold', build)],
      ['Next: 4. The measured height', demosAt('accordions/the-measured-height', build)]
    ]);
  });

  test('should title its page with its tab', async () => {
    render(<TestApp at={demosAt(guess)}/>);

    expect(await demoTabs.title('Demos Accordions')).toBeInTheDocument();
  });
});
