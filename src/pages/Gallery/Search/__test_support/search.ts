import {gallerySettings} from '@pages/Gallery/__test_support';
import {within} from '@testing-library/react';
import {heldClock} from '@__test_support/heldClock';
import userEvent, {type UserEvent} from '@testing-library/user-event';

const searchBarOf = (user: Pick<UserEvent, 'type' | 'click' | 'tab'>) => {
  const query = (): HTMLElement => gallerySettings().getByRole('combobox', {name: 'Search'});
  const submitButton = (): HTMLElement => gallerySettings().getByRole('button', {name: 'submit search'});
  const resetButton = (): HTMLElement => gallerySettings().getByRole('button', {name: 'reset search'});
  const suggestions = (): HTMLElement => gallerySettings().getByRole('listbox', {hidden: true});
  return {
    query,
    submitButton,
    resetButton,
    type: (word: string): Promise<void> => user.type(query(), word),
    submit: (): Promise<void> => user.click(submitButton()),
    reset: (): Promise<void> => user.click(resetButton()),
    focusMovesOn: (): Promise<void> => user.tab(),
    suggestions,
    offered: (): string[] => within(suggestions()).getAllByRole('option', {hidden: true}).map(({textContent}) => textContent ?? '')
  };
};

export const searchPage = {
  bar: searchBarOf(userEvent),
  held: () => {
    heldClock.hold();
    return {
      ...searchBarOf(userEvent.setup({advanceTimers: vi.advanceTimersByTime})),
      pauseEnds: (): Promise<void> => heldClock.moves(60_000)
    };
  }
};
