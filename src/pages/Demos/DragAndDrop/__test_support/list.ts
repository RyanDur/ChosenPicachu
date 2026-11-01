import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const untilTheTabMounts = {timeout: 5000};

const grip = (item: string): HTMLElement => screen.getByRole('button', {name: `grip for ${item}`});

const fingerDown = async (item: string): Promise<void> => {
  await userEvent.pointer({keys: '[TouchA>]', target: grip(item)});
};

export const sortableList = {
  arrived: (): Promise<HTMLElement> => screen.findByRole('list', {name: 'sortable list'}, untilTheTabMounts),
  itemsIn: (list: HTMLElement): HTMLElement[] => within(list).getAllByRole('listitem'),
  seats: (): string[] =>
    within(screen.getByRole('list', {name: 'sortable list'})).getAllByRole('listitem').map(({textContent}) => textContent ?? ''),
  moveReport: (): HTMLElement => screen.getByRole('status', {name: 'move report'}),
  fingerDown,
  grip,
  fingerTap: async (item: string): Promise<void> => {
    await userEvent.pointer({keys: '[TouchA]', target: grip(item)});
  },
  moveByKey: async (item: string, key: string): Promise<void> => {
    grip(item).focus();
    await userEvent.keyboard(key);
  }
};
