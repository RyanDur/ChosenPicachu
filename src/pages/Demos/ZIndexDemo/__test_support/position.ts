import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const positionExhibit = {
  choosePosition: async (position: string): Promise<void> =>
    userEvent.click(within(screen.getByRole('group', {name: 'Second’s position is'})).getByRole('radio', {name: position})),
  queryParentPills: (): HTMLElement | null => screen.queryByRole('group', {name: 'And its parent is'})
};
