import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs} from '@pages/Demos/__test_support';
import {expect, test} from 'vitest';
import {render, screen, waitFor, within} from '@testing-library/react';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';

describe('The Demos page', () => {
  test('the accordion labels survive a visit to the streaming charts', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt()} feed={feed}/>);

    const foldLabels = async () => (await screen.findAllByRole<HTMLInputElement>('radio'))
      .map(toggle => toggle.labels?.[0]?.textContent);
    const before = await foldLabels();
    await demoTabs.open('Charts');
    await waitFor(() => expect(screen.getByRole('status', {name: 'feed'})).toHaveTextContent(/^live$/));
    await feedIsSubscribed(feed);
    broadcast(feed, [tradeFrame(50001)]);
    expect(await within(screen.getByRole('region', {name: 'live trades'})).findByText('$50,001.00')).toBeVisible();
    await demoTabs.open('Accordions');
    expect(await foldLabels()).toEqual(before);
  });

  test('should open on what the tabs hold and where to start, above the tabs', async () => {
    render(<TestApp at={demosAt()}/>);

    const opening = await screen.findByText(/^Each tab below is one feature a page needs/);

    expect(opening).toHaveTextContent('Each tab below is one feature a page needs, built here and explained. The tabs run from simple to expert: an accordion, a menu that opens under a card, a list you sort by dragging, a live chart, and a table whose columns and rows you drag while trades keep landing. A tab shows the thing first, with dials wherever the build has a choice; then the explanation, with what the platform gives now beside the tricks we used before it; then the steps that build it, each beside the code that runs on this page. Start with the accordions if HTML, CSS and JavaScript are new to you, or go to the tab whose bug you came with.');
    expect(opening.compareDocumentPosition(screen.getByRole('navigation', {name: 'demos'})) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('should run its tabs in the order the opening names them, simple to expert', async () => {
    render(<TestApp at={demosAt()}/>);

    const tabs = within(await screen.findByRole('navigation', {name: 'demos'})).getAllByRole('link');

    expect(tabs.map(tab => tab.textContent)).toEqual(['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables']);
  });

  test('the demos page opens on the accordions', async () => {
    render(<TestApp at={demosAt()}/>);

    expect(await screen.findByRole('region', {name: 'Accordions'})).toBeInTheDocument();
  });

  test.each(['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables'])('should name the %s tab by its region, with no heading inside repeating it', async tab => {
    render(<TestApp at={demosAt()}/>);

    await demoTabs.open(tab);

    const region = await screen.findByRole('region', {name: tab});
    expect(within(region).queryByRole('heading', {name: tab})).not.toBeInTheDocument();
  });

  test.each(['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables'])('should title the page Demos %s, the name on its tab, once that tab is chosen', async tab => {
    render(<TestApp at={demosAt()}/>);

    await demoTabs.open(tab);

    expect(await screen.findByRole('heading', {level: 1, name: `Demos ${tab}`})).toBeInTheDocument();
  });
});
