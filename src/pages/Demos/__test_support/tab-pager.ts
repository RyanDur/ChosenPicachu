import {within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {not} from '@ryandur/sand';
import {demosNav} from './demos-nav';

const currentLinks = async (): Promise<HTMLElement[]> => {
  const bar = await demosNav.bar();
  return within(await demosNav.navigation()).getAllByRole('link', {current: 'page'})
    .filter(link => not(bar.contains(link)));
};

export const demoTabPager = {
  previous: async (): Promise<HTMLElement | null> => within(await demosNav.navigation()).queryByRole('link', {name: /^Previous tab/}),
  next: async (): Promise<HTMLElement | null> => within(await demosNav.navigation()).queryByRole('link', {name: /^Next tab/}),
  goPreviousByKeyboard: async (): Promise<void> => {
    within(await demosNav.navigation()).getByRole('link', {name: /^Previous tab/}).focus();
    await userEvent.keyboard('{Enter}');
  },
  goNextByKeyboard: async (): Promise<void> => {
    within(await demosNav.navigation()).getByRole('link', {name: /^Next tab/}).focus();
    await userEvent.keyboard('{Enter}');
  },
  currentTab: async (): Promise<HTMLElement> => {
    const [currentTab] = await currentLinks();
    return currentTab;
  },
  current: async (): Promise<string[]> => (await currentLinks()).map(({textContent}) => textContent)
};
