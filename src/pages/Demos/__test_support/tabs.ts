import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const tabList = (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'demos'});

export const demoTabs = {
  names: async (): Promise<string[]> => within(await tabList()).getAllByRole('link').map(tab => tab.textContent),
  current: async (): Promise<string[]> =>
    within(await tabList()).getAllByRole('link', {current: 'page'}).map(tab => tab.textContent),
  headingRepeatingItsName: async (name: string): Promise<HTMLElement | null> =>
    within(await screen.findByRole('region', {name})).queryByRole('heading', {name}),
  title: (name: string): Promise<HTMLElement> => screen.findByRole('heading', {level: 1, name}),
  arrivedOn: (name: string): Promise<HTMLElement> => screen.findByRole('region', {name}),
  open: async (name: string): Promise<void> =>
    userEvent.click(within(await tabList()).getByRole('link', {name})),
  assumedLinks: async (name: string): Promise<(string | null)[][]> =>
    within(within(await screen.findByRole('region', {name})).getByText(/^This tab assumes/)).getAllByRole('link')
      .map(link => [link.textContent, link.getAttribute('href')]),
  addresses: async (): Promise<(string | null)[]> =>
    within(await tabList()).getAllByRole('link').map(tab => tab.getAttribute('href'))
};
