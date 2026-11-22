import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';

const slidingFold = 'accordions/how-a-sliding-fold-moves';
const title = 'How a sliding fold moves';
const build = '?type=inclusive&style=drawer';

describe('how a sliding fold moves, on its own page', () => {
  test('should say its place in the accordions book', async () => {
    render(<TestApp at={demosAt(slidingFold)}/>);

    expect(await accordionsTab.place()).toHaveTextContent('Accordions · part 6 of 6');
  });

  test('should build part five’s details fold at its top, inclusive for a reader who arrives with inclusive', async () => {
    render(<TestApp at={demosAt(slidingFold, '?type=inclusive')}/>);

    const part = await explanation.part(title);

    expect(accordionsTab.buildsIn(part)).toEqual(['Inclusive accordion using details elements']);
  });

  test('should build part five’s details fold at its top, exclusive for a reader who arrives with exclusive', async () => {
    render(<TestApp at={demosAt(slidingFold, '?type=exclusive')}/>);

    const part = await explanation.part(title);

    expect(accordionsTab.buildsIn(part)).toEqual(['Exclusive accordion using details elements']);
  });

  test('a reader who arrives with inclusive can choose exclusive on the page, and gets the exclusive details build', async () => {
    render(<TestApp at={demosAt(slidingFold, '?type=inclusive')}/>);
    const part = await explanation.part(title);

    await accordionsTab.choose('fold type', 'Exclusive');

    expect(accordionsTab.buildsIn(part)).toEqual(['Exclusive accordion using details elements']);
  });

  test('should link the part where a transition first moves a fold to its page, with the fold choices carried', async () => {
    const from = demosAt(slidingFold, build);
    render(<TestApp at={from}/>);

    await accordionsTab.followInIntroduction(title, 'A box remembers the fold, and a rule reads it');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/a-box-remembers-the-fold', build));
  });

  test('should link the part whose details fold it slides to its page, with the fold choices carried', async () => {
    const from = demosAt(slidingFold, build);
    render(<TestApp at={from}/>);

    await accordionsTab.followInIntroduction(title, 'What the platform gives now');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/what-the-platform-gives-now', build));
  });

  test('should link transition to part 2’s page, where it is defined, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(slidingFold, build)}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'transition')).toHaveAttribute('href', demosAt('accordions/a-box-remembers-the-fold', build));
  });

  test('should show the reset’s reduced-motion rules beside the run that tells them', async () => {
    render(<TestApp at={demosAt(slidingFold)}/>);

    const part = await explanation.part(title);

    expect(explanation.sourcesBeside(part, /has a reduced-motion block with three rules/)).toEqual(['styles/reset.css on GitHub']);
  });

  test('should lead back to part five’s page, by number and title, and on to the z-index tab, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(slidingFold, build)}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 5. What the platform gives now', demosAt('accordions/what-the-platform-gives-now', build)],
      ['Next tab: Z-index', demosAt('z-index', build)]
    ]);
  });

  test('should title its page with its tab', async () => {
    render(<TestApp at={demosAt(slidingFold)}/>);

    expect(await demoTabs.title('Demos Accordions')).toBeInTheDocument();
  });
});
