import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type TabStrip = {
  names: () => string[];
  current: () => string[];
  open: (name: string) => Promise<void>;
};

export const tabStrip = (label: string): TabStrip => {
  const strip = (): HTMLElement => screen.getByRole('navigation', {name: label});
  return {
    names: () => within(strip()).getAllByRole('listitem').map(item => within(item).getByRole('link').textContent),
    current: () => within(strip()).queryAllByRole('link', {current: 'page'}).map(tab => tab.textContent),
    open: name => userEvent.click(within(strip()).getByRole('link', {name}))
  };
};
