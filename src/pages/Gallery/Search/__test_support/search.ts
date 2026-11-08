import {screen} from '@testing-library/react';
import userEvent, {type UserEvent} from '@testing-library/user-event';

const searchBarOf = (user: Pick<UserEvent, 'type' | 'click' | 'tab'>) => {
  const query = (): HTMLElement => screen.getByLabelText(/Search For/);
  const submitButton = (): HTMLElement => screen.getByRole('button', {name: 'submit search'});
  const resetButton = (): HTMLElement => screen.getByRole('button', {name: 'reset search'});
  return {
    query,
    queryNamedAppears: (name: string): Promise<HTMLElement> => screen.findByRole('combobox', {name}),
    submitButton,
    resetButton,
    type: (word: string): Promise<void> => user.type(query(), word),
    submit: (): Promise<void> => user.click(submitButton()),
    reset: (): Promise<void> => user.click(resetButton()),
    focusMovesOn: (): Promise<void> => user.tab(),
    suggestions: (): HTMLElement => screen.getByRole('listbox', {hidden: true}),
    addressSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
    addressPath: (): HTMLElement => screen.getByRole('status', {name: 'url path'})
  };
};

export const searchBar = searchBarOf(userEvent);

export const heldSearch = () => {
  vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true});
  return {
    ...searchBarOf(userEvent.setup({advanceTimers: vi.advanceTimersByTime})),
    pauseEnds: async (): Promise<void> => {
      await vi.advanceTimersByTimeAsync(60_000);
    }
  };
};
