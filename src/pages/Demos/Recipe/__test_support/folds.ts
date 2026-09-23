import {within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const recipeFolds = {
  story: (root: HTMLElement, title: string): HTMLElement => within(root).getByRole('group', {name: title}),
  open: async (root: HTMLElement, title: string): Promise<HTMLElement> => {
    const story = within(root).getByRole('group', {name: title});
    await userEvent.click(within(story).getByRole('heading', {name: title}));
    return story;
  },
  reveals: (root: HTMLElement): HTMLElement[] => within(root).getAllByRole('group', {name: 'how we built it'}),
  opened: (details: readonly HTMLElement[]): HTMLElement[] => details.filter(fold => fold.hasAttribute('open'))
};
