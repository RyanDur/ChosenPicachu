import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const demoTabs = {
  arrivedOn: (name: string): Promise<HTMLElement> => screen.findByRole('region', {name}),
  open: async (name: string): Promise<void> =>
    userEvent.click(within(await screen.findByRole('navigation', {name: 'demos'})).getByRole('link', {name})),
  assumedLinks: async (name: string): Promise<(string | null)[][]> =>
    within(within(await screen.findByRole('region', {name})).getByText(/^This tab assumes/)).getAllByRole('link')
      .map(link => [link.textContent, link.getAttribute('href')]),
  gripIn: (tab: HTMLElement, item: string): HTMLElement => within(tab).getByRole('button', {name: `grip for ${item}`}),
  addresses: async (): Promise<(string | null)[]> =>
    within(await screen.findByRole('navigation', {name: 'demos'})).getAllByRole('link').map(tab => tab.getAttribute('href'))
};
