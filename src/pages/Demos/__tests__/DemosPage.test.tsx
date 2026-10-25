import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs} from '@pages/Demos/__test_support';
import {expect, test} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import {listeningFeed} from '@pages/Demos/__test_support/feed';
import {DemoTopics, topicNames} from '@pages/Demos/types';
import {britishSpellingsOnThePage} from '@__test_support/spelling';

describe('The Demos page', () => {
  test.each([DemoTopics.accordions, DemoTopics.zIndex, DemoTopics.dragAndDrop, DemoTopics.charts])('should spell the %s tab\'s prose the American way', async tab => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=${tab}`)} feed={feed}/>);
    await demoTabs.arrivedOn(topicNames[tab]);

    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should open on what the tabs hold and where to start, above the tabs', async () => {
    render(<TestApp at={demosAt()}/>);

    const opening = await screen.findByText(/^Each tab below is one feature a page needs/);

    expect(opening).toHaveTextContent('Each tab below is one feature a page needs. I built each one here and explain it. The tabs run from simple to expert: an accordion, a menu that opens under a card, a list you sort by dragging, a live chart, and a table whose columns and rows you drag while trades keep landing. A tab shows the feature first, with dials wherever the build has a choice. Then comes the explanation, with what the platform gives now beside the tricks we used before it. Then come the steps that build it, each beside the code that runs on this page. Start with the accordions if HTML, CSS and JavaScript are new to you, or go to the tab whose bug you came with.');
    expect(opening.compareDocumentPosition(screen.getByRole('navigation', {name: 'demos'})) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test.each([
    ['Accordions', demosAt()],
    ['Accordions', demosAt('?tab=behavior')],
    ['Tables', demosAt('?tab=tables')]
  ])('should mark the demo it shows as the current tab, %s at %s', async (shown, at) => {
    render(<TestApp at={at}/>);

    const tabs = within(await screen.findByRole('navigation', {name: 'demos'}));

    expect(tabs.getByRole('link', {name: shown, current: 'page'})).toBeInTheDocument();
    expect(tabs.getAllByRole('link', {current: 'page'})).toHaveLength(1);
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
