import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const option = (name: string): HTMLElement =>
  within(screen.getByRole('region', {name: 'list controls'})).getByRole('radio', {name});

export const listControls = {
  heading: (): Promise<HTMLElement> => screen.findByRole('heading', {name: 'list controls', level: 4}),
  option,
  choose: async (name: string): Promise<void> => userEvent.click(option(name))
};
