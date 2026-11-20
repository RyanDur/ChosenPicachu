import {within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {not} from '@ryandur/sand';
import {demosNav} from './demos-nav';

export const demoTabPager = {
  previous: async (): Promise<HTMLElement | null> => within(await demosNav.pager()).queryByRole('link', {name: /^Previous tab/}),
  next: async (): Promise<HTMLElement | null> => within(await demosNav.pager()).queryByRole('link', {name: /^Next tab/}),
  goNextByKeyboard: async (): Promise<void> => {
    within(await demosNav.pager()).getByRole('link', {name: /^Next tab/}).focus();
    await userEvent.keyboard('{Enter}');
  },
  current: async (): Promise<string | null> => {
    const bar = await demosNav.bar();
    return within(await demosNav.pager()).getAllByText(/./, {selector: '[aria-current="page"]'})
      .filter(shown => not(bar.contains(shown)))
      .map(({textContent}) => textContent).join();
  }
};
