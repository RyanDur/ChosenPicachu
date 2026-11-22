import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleDescription} from 'dom-accessibility-api';
import {assumedLinksIn} from './page';
import {demosNav} from './demos-nav';

export const demoTabs = {
  names: async (): Promise<string[]> => within(await demosNav.bar()).getAllByRole('link').map(tab => tab.textContent),
  whatEachAdds: async (): Promise<[string, string][]> => within(await demosNav.bar()).getAllByRole('link')
    .map(tab => [tab.textContent, computeAccessibleDescription(tab)]),
  current: async (): Promise<string[]> =>
    within(await demosNav.bar()).getAllByRole('link', {current: 'page'}).map(tab => tab.textContent),
  currentButNotThePage: async (): Promise<string[]> =>
    within(await demosNav.bar()).getAllByRole('link', {current: true}).map(tab => tab.textContent),
  headingRepeatingItsName: async (name: string): Promise<HTMLElement | null> =>
    within(await screen.findByRole('region', {name})).queryByRole('heading', {name}),
  title: (name: string): Promise<HTMLElement> => screen.findByRole('heading', {level: 1, name}),
  arrivedOn: (name: string): Promise<HTMLElement> => screen.findByRole('region', {name}),
  tab: async (name: string): Promise<HTMLElement> => within(await demosNav.bar()).getByRole('link', {name}),
  open: async (name: string): Promise<void> =>
    userEvent.click(within(await demosNav.bar()).getByRole('link', {name})),
  assumedLinks: async (name: string): Promise<(string | null)[][]> => assumedLinksIn(await screen.findByRole('region', {name})),
  addresses: async (): Promise<(string | null)[]> =>
    within(await demosNav.bar()).getAllByRole('link').map(tab => tab.getAttribute('href'))
};
