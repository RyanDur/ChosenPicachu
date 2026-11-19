import {within} from '@testing-library/react';
import {not} from '@ryandur/sand';
import {demosNav} from './demos-nav';

export const demoTabRow = {
  previous: async (): Promise<HTMLElement | null> => within(await demosNav.row()).queryByRole('link', {name: /^Previous tab/}),
  next: async (): Promise<HTMLElement | null> => within(await demosNav.row()).queryByRole('link', {name: /^Next tab/}),
  current: async (): Promise<string | null> => {
    const bar = await demosNav.bar();
    return within(await demosNav.row()).getAllByText(/./, {selector: '[aria-current="page"]'})
      .filter(shown => not(bar.contains(shown)))
      .map(({textContent}) => textContent).join();
  }
};
