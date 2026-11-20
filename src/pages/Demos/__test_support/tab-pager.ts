import {within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {not} from '@ryandur/sand';
import {demosNav} from './demos-nav';

export const demoTabPager = {
  previous: async (): Promise<HTMLElement | null> => within(await demosNav.navigation()).queryByRole('link', {name: /^Previous tab/}),
  next: async (): Promise<HTMLElement | null> => within(await demosNav.navigation()).queryByRole('link', {name: /^Next tab/}),
  goNextByKeyboard: async (): Promise<void> => {
    within(await demosNav.navigation()).getByRole('link', {name: /^Next tab/}).focus();
    await userEvent.keyboard('{Enter}');
  },
  currentTab: async (): Promise<HTMLElement> => {
    const bar = await demosNav.bar();
    const [currentTab] = within(await demosNav.navigation()).getAllByRole('link', {current: 'page'})
      .filter(link => not(bar.contains(link)));
    return currentTab;
  },
  current: async (): Promise<string[]> => {
    const bar = await demosNav.bar();
    return within(await demosNav.navigation()).getAllByText(/./, {selector: '[aria-current="page"]'})
      .filter(shown => not(bar.contains(shown)))
      .map(({textContent}) => textContent);
  }
};
