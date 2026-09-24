import {describe, expect, it} from 'vitest';
import {nothing, some} from '@ryandur/sand';
import {landedMove} from '../session';

describe('a landed drag', () => {
  const order = ['A', 'B', 'C'];

  it('an item dropped on its own place is not a move', () => {
    expect(landedMove(some('B'), some(1), order).orNull()).toBeNull();
  });

  it('nothing landed is not a move', () => {
    expect(landedMove(nothing(), some(1), order).orNull()).toBeNull();
    expect(landedMove(some('A'), nothing(), order).orNull()).toBeNull();
  });
});
