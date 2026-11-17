import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {Paths} from '@navigation';
import {demoPage, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';
import {site} from '@pages/__test_support';

const measuredHeight = 'accordions/the-measured-height';

describe('the measured height, on its own page', () => {
  test('following a part the measured height builds on lands on that part’s heading on the tab, with the fold choices carried', async () => {
    const from = demosAt(measuredHeight, '?type=inclusive&style=drawer');
    render(<TestApp at={from}/>);

    await accordionsTab.openPart('The max-height guess');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions', '?type=inclusive&style=drawer'));
    expect(appAddress.fragment()).toBe('#max-height-guess-heading');
  });

  test('the measured height’s page says its place in the accordions book', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    expect(await accordionsTab.place()).toHaveTextContent('Accordions · part 4 of 6');
  });

  test('the measured height’s page shows the fold measured by plain script under its title', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const measured = await explanation.part('The measured height');

    expect(await accordionsTab.foldMeasuredByPlainScript(measured)).toBeInTheDocument();
  });

  test('the measured height’s page builds its fold with the fold type carried to it', async () => {
    render(<TestApp at={demosAt(measuredHeight, '?type=inclusive')}/>);

    const measured = await explanation.part('The measured height');

    expect(accordionsTab.buildsIn(measured)).toEqual(['Accordion using checkboxes and a measured height']);
  });

  test('a reader who arrives with no fold type in the address can choose exclusive on the page, and gets the exclusive build', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);
    const measured = await explanation.part('The measured height');

    await accordionsTab.choose('fold type', 'Exclusive');

    expect(accordionsTab.buildsIn(measured)).toEqual(['Accordion using a radio group and a measured height']);
  });

  test('should link the run that tells the two layout effects to the React build’s source on GitHub', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const measured = await explanation.part('The measured height');

    expect(explanation.sourcesBeside(measured, /The script makes the moves in two layout effects/)).toEqual(['Accordions/MeasuredPanel.tsx on GitHub']);
  });

  test('should link the run that turns a fold around to the React build’s source on GitHub', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const measured = await explanation.part('The measured height');

    expect(explanation.sourcesBeside(measured, /turns around from where it is/)).toEqual(['Accordions/MeasuredPanel.tsx on GitHub']);
  });

  test('should show, with exclusive chosen, what the closed fold "How this site does it" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt(measuredHeight, '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part('The measured height'), 'How this site does it');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });

  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const page = await demoTabs.arrivedOn('Accordions');

    expect(demoPage.linksToTabsIn(page)).toEqual([
      ['z-index tab', `${Paths.demos}z-index/`]
    ]);
  });

  test('should title the measured height’s page with the tab and the part', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    expect(await demoTabs.title('Demos Accordions · The measured height')).toBeInTheDocument();
  });

  test('should keep Accordions as the current tab on the measured height’s page', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    expect(await demoTabs.current()).toEqual(['Accordions']);
  });

  test('an address naming no part of the accordions tab says there is no room there', async () => {
    render(<TestApp at={demosAt('accordions/the-guess')}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
  });
});
