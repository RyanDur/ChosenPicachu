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

  test('should lead back to the part before it and on to the part after it on the tab, by number and title, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(measuredHeight, '?type=inclusive&style=drawer')}/>);

    expect(await pageFoot.leadsOn('the accordions parts')).toEqual([
      ['Previous: 3. The max-height guess', `${demosAt('accordions', '?type=inclusive&style=drawer')}#max-height-guess-heading`],
      ['Next: 5. What the platform gives now', `${demosAt('accordions', '?type=inclusive&style=drawer')}#platform-way-heading`]
    ]);
  });

  test('should show the React build’s samples beside the run that tells the two layout effects as taken from the exhibit, with no link', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const measured = await explanation.part('The measured height');

    expect(explanation.sampleCaptionsBeside(measured, /The script makes the moves in two layout effects/)).toEqual(['Taken from the exhibit on this page. The rest of the site doesn’t use it.']);
  });

  test('should show the React build’s sample beside the run that turns a fold around as taken from the exhibit, with no link', async () => {
    render(<TestApp at={demosAt(measuredHeight)}/>);

    const measured = await explanation.part('The measured height');

    expect(explanation.sampleCaptionsBeside(measured, /turns around from where it is/)).toEqual(['Taken from the exhibit on this page. The rest of the site doesn’t use it.']);
  });

  test('should show, with exclusive chosen, what the closed fold "How this page builds it" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt(measuredHeight, '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part('The measured height'), 'How this page builds it');
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
