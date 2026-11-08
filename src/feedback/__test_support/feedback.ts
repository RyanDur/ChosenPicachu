import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const dialog = (): HTMLElement => screen.getByRole('dialog', {name: 'Feedback'});
const note = (): HTMLElement => screen.getByRole('textbox', {name: 'What did you find?'});
const wayToReach = (): HTMLElement => screen.getByRole('textbox', {name: 'A way to reach you, if you like'});
const status = (): HTMLElement => within(dialog()).getByRole('status');

export const feedback = {
  offeredIfAny: (): HTMLElement | null => screen.queryByRole('button', {name: 'Feedback'}),
  open: async (): Promise<void> => userEvent.click(await screen.findByRole('button', {name: 'Feedback'})),
  dialog,
  dialogIfAny: (): HTMLElement | null => screen.queryByRole('dialog', {name: 'Feedback'}),
  says: (words: string): Promise<HTMLElement> => within(dialog()).findByText(words),
  pageThread: (): Promise<HTMLElement> =>
    within(dialog()).findByRole('link', {name: 'this page’s thread on GitHub'}),
  note,
  write: async (words: string): Promise<void> => userEvent.type(note(), words),
  rewrite: async (words: string): Promise<void> => {
    await userEvent.clear(note());
    await userEvent.type(note(), words);
  },
  startNewLine: async (): Promise<void> => userEvent.type(note(), '{Shift>}{Enter}{/Shift}'),
  wayToReach,
  leaveAWayToReach: async (address: string): Promise<void> => userEvent.type(wayToReach(), address),
  changeTheWayToReach: async (address: string): Promise<void> => {
    await userEvent.clear(wayToReach());
    await userEvent.type(wayToReach(), address);
  },
  send: async (): Promise<void> => userEvent.type(note(), '{Enter}'),
  sendControl: (): HTMLElement => within(dialog()).getByRole('button', {name: 'Send'}),
  cancel: async (): Promise<void> => userEvent.click(within(dialog()).getByRole('button', {name: 'Cancel'})),
  status,
  noteOnGitHub: (): Promise<HTMLElement> => screen.findByRole('link', {name: 'Read it on GitHub'}),
  noteOnGitHubFromTheDialog: (): Promise<HTMLElement> =>
    within(status()).findByRole('link', {name: 'Read it on GitHub'})
};
