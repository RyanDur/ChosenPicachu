import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Way = 'FIRST' | 'PREV' | 'NEXT' | 'LAST';

const way = (name: Way): HTMLElement => screen.getByRole('link', {name});

export const galleryNav = {
  count: (): HTMLElement => screen.getByRole('navigation', {name: 'pagination'}),
  way,
  wayIfAny: (name: Way): HTMLElement | null => screen.queryByRole('link', {name}),
  wayAppears: (name: Way): Promise<HTMLElement> => screen.findByRole('link', {name}),
  go: (name: Way): Promise<void> => userEvent.click(way(name))
};
