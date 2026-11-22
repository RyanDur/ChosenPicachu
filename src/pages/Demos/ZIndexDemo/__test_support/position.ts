import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
type ParentPillWords = 'position: relative' | 'not positioned';

const pillsOf = (name: string): HTMLElement => screen.getByRole('group', {name});

export const positionExhibit = {
  choose: async (position: Position): Promise<void> =>
    userEvent.click(within(pillsOf('Second’s position is')).getByRole('radio', {name: position})),
  chooseParent: async (parentPillWords: ParentPillWords): Promise<void> =>
    userEvent.click(within(pillsOf('And its parent is')).getByRole('radio', {name: parentPillWords})),
  measuredFrom: (): HTMLElement => screen.getByRole('status', {name: 'what Second is measured from'}),
  parentPills: (): HTMLElement => pillsOf('And its parent is'),
  queryParentPills: (): HTMLElement | null => screen.queryByRole('group', {name: 'And its parent is'})
};
