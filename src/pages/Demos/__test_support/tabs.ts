import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const demoTabs = {
  open: async (name: string): Promise<void> =>
    userEvent.click(within(await screen.findByRole('navigation', {name: 'demos'})).getByRole('link', {name}))
};
