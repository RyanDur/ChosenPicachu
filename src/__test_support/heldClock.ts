import {waitFor} from '@testing-library/react';

// heldClockMoves needs this clock: RTL's own setTimeout(0) after the move fires only while real time moves it
export const holdTheClock = (): void => {
  vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true});
};

// tests.md: React's act check lifts only inside RTL's async wrapper, and waitFor is the public way in.
// waitFor retries a callback whose promise rejects, so the move starts once, a retry gets the same one,
// and it settles to an outcome either way: a timer that throws ends the wait with its own error;
// waitFor times itself out on the held clock, which real time moves too, so the headroom is a whole move:
// more than vitest's test timeout, which then reports a real hang
type Outcome = {thrown?: unknown};

export const heldClockMoves = async (milliseconds: number): Promise<void> => {
  const held: {moving?: Promise<Outcome>} = {};
  const outcome = await waitFor(() => (held.moving ??= vi.advanceTimersByTimeAsync(milliseconds)
    .then((): Outcome => ({}), (thrown: unknown): Outcome => ({thrown}))), {timeout: milliseconds * 2});
  if ('thrown' in outcome) throw outcome.thrown;
};
