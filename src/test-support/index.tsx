import {waitFor} from '@testing-library/react';
import {subscribed} from './feed';

export const feedIsSubscribed = async (): Promise<void> => {
  await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
};
