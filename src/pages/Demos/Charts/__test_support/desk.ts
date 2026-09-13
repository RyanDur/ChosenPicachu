import {createEvent, fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const addMenu = (): HTMLElement | null => screen.queryByLabelText('charts to add');

export const addChart = async (name: string): Promise<void> => {
  const menu = addMenu();
  if (!menu) {
    throw new Error('no add-a-chart menu on the desk');
  }
  await userEvent.click(within(menu).getByRole('button', {name, hidden: true}));
};

export const doorway = (name: string): HTMLElement => screen.getByRole('link', {name});

export const slot = (name: string): HTMLElement => {
  const seat = screen.getAllByRole('listitem').find(item => within(item).queryByRole('link', {name}) !== null);
  if (!seat) {
    throw new Error(`the ${name} doorway sits in no seat`);
  }
  return seat;
};

export const keys = async (slotName: string, key: string): Promise<void> => {
  doorway(slotName).focus();
  await userEvent.keyboard(`{${key}}`);
};

export const dragChart = (from: string, to: string, handAt: number): void => {
  fireEvent.mouseDown(within(slot(from)).getByRole('button', {name: 'move chart', hidden: true}));
  const start = createEvent.dragStart(slot(from));
  Object.defineProperty(start, 'clientY', {value: 0});
  Object.defineProperty(start, 'dataTransfer', {value: {effectAllowed: '', dropEffect: ''}});
  fireEvent(slot(from), start);
  const over = createEvent.dragOver(slot(to));
  Object.defineProperty(over, 'clientY', {value: handAt});
  Object.defineProperty(over, 'dataTransfer', {value: {dropEffect: ''}});
  fireEvent(slot(to), over);
};

export const releaseDrag = (at: string): void => {
  fireEvent.drop(slot(at));
  fireEvent.dragEnd(slot(at));
};
