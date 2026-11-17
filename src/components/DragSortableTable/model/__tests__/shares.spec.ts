import {describe, expect, it} from 'vitest';
import {nothing, some} from '@ryandur/sand';
import {shares} from '../shares';

describe('the shares vocabulary', () => {
  it('seeds the grip from the table width', () => {
    expect(shares.grippedAt(700, 120).orNull()).toEqual({fromX: 120, pxPerShare: 7});
  });

  it('seeds no grip from a table with no width', () => {
    expect(shares.grippedAt(0, 120).orNull()).toBeNull();
  });

  it('folds each move into the increment since the last one', () => {
    const grip = {fromX: 100, pxPerShare: 7};

    const first = shares.soughtTrade(grip, 170, 0);
    expect(first).toEqual({delta: 10, carried: 10});
    expect(shares.soughtTrade(grip, 240, first.carried)).toEqual({delta: 10, carried: 20});
  });

  it('speaks the resize announcement, with the share once the ledger exists', () => {
    expect(shares.resizeLabel('trades', some(24.4))).toBe('resize trades, 24%');
    expect(shares.resizeLabel('trades', nothing())).toBe('resize trades');
  });
});
