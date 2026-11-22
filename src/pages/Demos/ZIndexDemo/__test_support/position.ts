import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const positionExhibit = {
  choose: async (position: string): Promise<void> =>
    userEvent.click(within(screen.getByRole('group', {name: 'Second’s position is'})).getByRole('radio', {name: position})),
  chooseParent: async (position: string): Promise<void> =>
    userEvent.click(within(screen.getByRole('group', {name: 'And its parent is'})).getByRole('radio', {name: position})),
  measuredFrom: (): HTMLElement => screen.getByRole('status', {name: 'what Second is measured from'}),
  parentPills: (): HTMLElement => screen.getByRole('group', {name: 'And its parent is'}),
  queryParentPills: (): HTMLElement | null => screen.queryByRole('group', {name: 'And its parent is'})
};
