import {gallerySettings} from '@pages/Gallery/__test_support';
import {heldClockMoves, holdTheClock} from '@__test_support/heldClock';
import userEvent, {type UserEvent} from '@testing-library/user-event';

const searchBarOf = (user: Pick<UserEvent, 'type' | 'click' | 'tab'>) => {
  const query = (): HTMLElement => gallerySettings().getByRole('combobox', {name: /Search For/});
  const submitButton = (): HTMLElement => gallerySettings().getByRole('button', {name: 'submit search'});
  const resetButton = (): HTMLElement => gallerySettings().getByRole('button', {name: 'reset search'});
  return {
    query,
    queryNamedAppears: (name: string): Promise<HTMLElement> => gallerySettings().findByRole('combobox', {name}),
    submitButton,
    resetButton,
    type: (word: string): Promise<void> => user.type(query(), word),
    submit: (): Promise<void> => user.click(submitButton()),
    reset: (): Promise<void> => user.click(resetButton()),
    focusMovesOn: (): Promise<void> => user.tab(),
    suggestions: (): HTMLElement => gallerySettings().getByRole('listbox', {hidden: true})
  };
};

export const searchBar = searchBarOf(userEvent);

export const heldSearch = () => {
  holdTheClock();
  return {
    ...searchBarOf(userEvent.setup({advanceTimers: vi.advanceTimersByTime})),
    pauseEnds: (): Promise<void> => heldClockMoves(60_000)
  };
};
