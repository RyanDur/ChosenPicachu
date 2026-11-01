import {createEvent, fireEvent, screen, within} from '@testing-library/react';
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
  seatOf: (item: string): HTMLElement => {
    const seat = screen.getAllByRole('listitem').find(candidate => within(candidate).queryByText(item) !== null);
    if (!seat) throw new Error(`no seat for ${item}`);
    return seat;
  },
  moveReport: (): HTMLElement => screen.getByRole('status', {name: 'move report'}),
  fingerDown,
  fingerTap: async (item: string): Promise<void> => {
    await userEvent.pointer({keys: '[TouchA]', target: grip(item)});
  },
  browserTakesOver: (item: string): void => {
    fireEvent.pointerCancel(grip(item), {pointerType: 'touch'});
  },
  lift: async (item: string): Promise<void> => {
    await fingerDown(item);
    fireEvent.dragStart(screen.getByText(item), {dataTransfer: {effectAllowed: ''}});
  },
  dragOver: (item: string, clientX: number): void => {
    const over = createEvent.dragOver(screen.getByText(item));
    Object.defineProperty(over, 'clientX', {value: clientX});
    Object.defineProperty(over, 'dataTransfer', {value: {dropEffect: ''}});
    fireEvent(screen.getByText(item), over);
  },
  release: (item: string): void => {
    fireEvent.dragEnd(screen.getByText(item), {dataTransfer: {dropEffect: 'move'}});
  },
  moveByKey: async (item: string, key: string): Promise<void> => {
    grip(item).focus();
    await userEvent.keyboard(key);
  }
};
