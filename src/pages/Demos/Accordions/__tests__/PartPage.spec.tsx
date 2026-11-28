import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {Paths} from '@navigation';
import {demoPage, demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';
import {site} from '@pages/__test_support';

const measuredHeight = 'accordions/the-measured-height';

describe('the measured height, on its own page', () => {
  test('following the part the measured height answers opens that part’s page, with the fold choices carried', async () => {
    const from = demosAt(measuredHeight, '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.followInIntroduction('The measured height', 'The max-height guess');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/the-max-height-guess', '?type=inclusive&style=drawer'));
  });

  test('following the part it builds on for the input and its label opens that part’s page, with the fold choices carried', async () => {
    const from = demosAt(measuredHeight, '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.followInIntroduction('The measured height', 'A box remembers the fold, and a rule reads it');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions/a-box-remembers-the-fold', '?type=inclusive&style=drawer'));
  });

  test('should be named by the title its region holds, so a reader who jumps to the part hears which part it is', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const part = await explanation.part('The measured height');

    expect(explanation.partTitles(part)).toEqual(['The measured height']);
  });

  test('the measured height’s page says its place in the accordions book', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    expect(await accordionsTab.place()).toHaveTextContent('Accordions · part 4 of 6');
  });

  test('the measured height’s page links class to part 2’s page, where it is defined, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(measuredHeight, '?type=inclusive&style=drawer')}/>);

    const measured = await explanation.part('The measured height');

    expect(explanation.linkNamed(measured, 'class')).toHaveAttribute('href', demosAt('accordions/a-box-remembers-the-fold', '?type=inclusive&style=drawer'));
  });

  test('the measured height’s page shows the fold measured by plain script under its title', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const measured = await explanation.part('The measured height');

    expect(await accordionsTab.foldsOwnPage(measured)).toBeInTheDocument();
  });

  test('the measured height’s page builds its fold with the fold type carried to it', async () => {
    render(<TestApp at={demosAt(measuredHeight, '?type=inclusive')}/>);

    const measured = await explanation.part('The measured height');

    expect(accordionsTab.exhibitsIn(measured))
      .toEqual(['A fold measured by plain script', 'Accordion using checkboxes and a measured height']);
  });

  test('a reader who arrives with no fold type in the address can choose exclusive on the page, and gets the exclusive build', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);
    const measured = await explanation.part('The measured height');

    await accordionsTab.choose('fold type', 'Exclusive');

    expect(accordionsTab.exhibitsIn(measured))
      .toEqual(['A fold measured by plain script', 'Accordion using a radio group and a measured height']);
  });

  test('should lead back to part three’s page and on to part five’s, by number and title, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(measuredHeight, '?type=inclusive&style=drawer')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 3. The max-height guess', demosAt('accordions/the-max-height-guess', '?type=inclusive&style=drawer')],
      ['Next: 5. What the platform gives now', demosAt('accordions/what-the-platform-gives-now', '?type=inclusive&style=drawer')]
    ]);
  });

  test('should show the React build’s samples beside the run that tells the two layout effects linked to its file', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const measured = await explanation.part('The measured height');

    expect(explanation.sampleFilesBeside(measured, /The script makes the moves in two layout effects/)).toEqual([['Accordions/MeasuredPanel.tsx on GitHub']]);
  });

  test('should show the React build’s sample beside the run that turns a fold around linked to its file', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const measured = await explanation.part('The measured height');

    expect(explanation.sampleFilesBeside(measured, /turns around from where it is/)).toEqual([['Accordions/MeasuredPanel.tsx on GitHub']]);
  });

  test('should show, with exclusive chosen, what the closed fold "How this page builds it" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt(measuredHeight, '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part('The measured height'), 'How this page builds it');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });

  test('should name no tab, now that the z-index parts it leans on have pages of their own', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const page = await demoTabs.arrivedOn('Accordions');

    expect(demoPage.linksToTabsIn(page)).toEqual([]);
  });

  test('should cite the z-index parts that teach state, context and dispatch, each at its page', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const part = await explanation.part('The measured height');

    expect(explanation.linksTo(part, `${Paths.demos}z-index/`).map(link => [link.textContent, link.getAttribute('href')]))
      .toEqual([
        ['Why the popover wins', `${Paths.demos}z-index/why-the-popover-wins/`],
        ['Let’s build this feature', `${Paths.demos}z-index/lets-build-this-feature/`],
        ['Let’s build this feature', `${Paths.demos}z-index/lets-build-this-feature/`]
      ]);
  });

  test('should title the measured height’s page with its tab', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    expect(await demoTabs.title('Demos Accordions')).toBeInTheDocument();
  });

  test('should keep Accordions as the current tab on the measured height’s page', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Accordions']);
  });

  test('an address naming no part of the accordions tab says there is no room there', async () => {
    render(<TestApp at={demosAt('accordions/the-guess')}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
  });
});

describe('the fold motion on a part’s page', () => {
  test('should open on the reveal', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const motions = await accordionsTab.choice('fold motion');

    expect(accordionsTab.option(motions, 'Reveal')).toBeChecked();
  });

  test('should write the motion chosen into the address', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);
    const motions = await accordionsTab.choice('fold motion');

    await accordionsTab.choose('fold motion', 'Drawer');

    expect(demoPage.urlSearch()).toHaveTextContent('style=drawer');
    expect(accordionsTab.option(motions, 'Drawer')).toBeChecked();
  });
});
