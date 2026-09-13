import {TestApp} from '@test-support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {expect, test} from 'vitest';
import userEvent from '@testing-library/user-event';
import {render, screen, waitFor, within} from '@testing-library/react';
import {broadcast, listeningFeed, tradeFrame} from '@test-support/feed';
import {feedIsSubscribed} from '@test-support';

describe('The Demos page', () => {
  test('the accordion labels survive a visit to the streaming charts', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt()} feed={feed}/>);

    const foldLabels = async () => (await screen.findAllByRole<HTMLInputElement>('checkbox'))
      .map(toggle => toggle.labels?.[0]?.textContent);
    const before = await foldLabels();
    const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
    await userEvent.click(within(demoTabs).getByText('Charts'));
    await waitFor(() => expect(screen.getByRole('status', {name: 'feed'})).toHaveTextContent(/^live$/));
    await feedIsSubscribed();
    broadcast(feed, [tradeFrame(50001)]);
    expect(await within(screen.getByRole('region', {name: 'live trades'})).findByText('$50,001.00')).toBeVisible();
    await userEvent.click(within(demoTabs).getByText('Accordions'));
    expect(await foldLabels()).toEqual(before);
  });

  test('the demos page opens on the accordions', async () => {
    render(<TestApp at={demosAt()}/>);

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Different styles of Accordions.')).toBeInTheDocument();
    });
  });

  test('the z-index door leads to its demo and titles the page', async () => {
    render(<TestApp at={demosAt()}/>);

    const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
    await userEvent.click(within(demoTabs).getByText('Z-Index'));

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Z-Index Demo.')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Demos z-index');
  });
});