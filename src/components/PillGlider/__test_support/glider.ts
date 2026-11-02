import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleName} from 'dom-accessibility-api';

export const pillGlider = {
  group: (name: string): HTMLElement => screen.getByRole('group', {name}),
  choices: (): string[] => screen.getAllByRole('radio').map(choice => computeAccessibleName(choice)),
  choice: (name: string): HTMLElement => screen.getByRole('radio', {name}),
  choose: (name: string): Promise<void> => userEvent.click(screen.getByRole('radio', {name}))
};
