import {waitFor} from '@testing-library/react';
import {Feed} from './feed';

export const feedIsSubscribed = async (feed: Feed): Promise<void> => {
  await waitFor(() => expect(feed.clients.size).toBeGreaterThan(0));
};
