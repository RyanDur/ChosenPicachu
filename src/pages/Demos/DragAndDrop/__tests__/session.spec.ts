import {describe, expect, it} from 'vitest';
import {nothing, some} from '@ryandur/sand';
import {session} from '../session';

describe('a landed drag', () => {
  const order = ['A', 'B', 'C'];

  it('an item dropped on its own place is not a move', () => {
    expect(session.landedMove(some('B'), some(1), order).orNull()).toBeNull();
  });

  it('nothing landed is not a move', () => {
    expect(session.landedMove(nothing(), some(1), order).orNull()).toBeNull();
    expect(session.landedMove(some('A'), nothing(), order).orNull()).toBeNull();
  });
});
