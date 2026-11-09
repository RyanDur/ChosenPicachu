import {waitFor} from '@testing-library/react';

// moves needs this clock: RTL's own setTimeout(0) after the move fires only while real time moves it
const hold = (): void => {
  vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true});
};

// React's act check lifts only inside RTL's async wrapper, and waitFor is the public way in;
// waitFor times itself out on the held clock, which real time moves too, so the headroom is a whole move:
// more than vitest's test timeout, which then reports a real hang
type Outcome = {thrown?: unknown};

const moves = async (milliseconds: number): Promise<void> => {
  const outcome = await waitFor(() => vi.advanceTimersByTimeAsync(milliseconds)
    .then((): Outcome => ({}), (thrown: unknown): Outcome => ({thrown})), {timeout: milliseconds * 2});
  if ('thrown' in outcome) throw outcome.thrown;
};

export const heldClock = {hold, moves};
