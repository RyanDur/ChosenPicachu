import {waitFor} from '@testing-library/react';

// tests.md: React's act check lifts only inside RTL's async wrapper, and waitFor is the public way in.
// waitFor retries a callback whose promise rejects, so the move starts once and a retry gets the same one;
// waitFor times itself out on the held clock, which real time moves too, so the headroom is a whole move:
// more than vitest's test timeout, which then reports a real hang
export const heldClockMoves = async (milliseconds: number): Promise<void> => {
  const held: {moving?: Promise<unknown>} = {};
  await waitFor(() => (held.moving ??= vi.advanceTimersByTimeAsync(milliseconds)), {timeout: milliseconds * 2});
};
