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

    const foldLabels = async () => (await screen.findAllByRole<HTMLInputElement>('checkbox'))
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

  test('the demos page opens on the accordions', async () => {
    render(<TestApp at={demosAt()}/>);

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByRole('heading', {name: 'Accordions', level: 2})).toBeInTheDocument();
    });
  });

  test('the z-index door leads to its demo and titles the page', async () => {
    render(<TestApp at={demosAt()}/>);

    await demoTabs.open('Z-index');

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByRole('heading', {level: 2, name: 'Z-index'})).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Demos Z-index');
  });
});
