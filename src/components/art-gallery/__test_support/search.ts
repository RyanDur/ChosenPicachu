import {act, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type HeldSearch = {
  readonly type: (word: string) => Promise<void>;
  readonly pauseEnds: () => Promise<void>;
  readonly suggestions: () => HTMLElement;
};

export const heldSearch = (): HeldSearch => {
  vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true});
  const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime});
  return {
    type: async (word: string): Promise<void> => user.type(screen.getByLabelText(/Search For/), word),
    pauseEnds: async (): Promise<void> => act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    }),
    suggestions: (): HTMLElement => screen.getByRole('listbox', {hidden: true})
  };
};
