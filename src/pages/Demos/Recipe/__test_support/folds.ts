import {within} from '@testing-library/react';

export const recipeFolds = {
  story: (root: HTMLElement, title: string): HTMLElement => within(root).getByRole('group', {name: title}),
  reveals: (root: HTMLElement): HTMLElement[] => within(root).getAllByRole('group', {name: 'how we built it'}),
  opened: (details: readonly HTMLElement[]): HTMLElement[] => details.filter(fold => fold.hasAttribute('open'))
};
