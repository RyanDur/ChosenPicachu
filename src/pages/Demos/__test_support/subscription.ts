import {screen, waitFor} from '@testing-library/react';
import {Feed} from './feed';

const untilTheTabMounts = {timeout: 5000};

export const feedStatus = (): HTMLElement => screen.getByRole('status', {name: 'feed'});

export const feedIsSubscribed = async (feed: Feed): Promise<void> => {
  await waitFor(() => expect(feed.clients.size).toBeGreaterThan(0), untilTheTabMounts);
};

export const feedIsLive = async (feed: Feed): Promise<void> => {
  await waitFor(() => expect(feedStatus()).toHaveTextContent(/^live$/));
  await feedIsSubscribed(feed);
};
