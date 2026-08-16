import {describe, expect, it} from 'vitest';
import {resizeLabel} from '../shares';

describe('the shares vocabulary', () => {
  it('speaks the resize announcement, with the share once the ledger exists', () => {
    expect(resizeLabel('trades', 24.4)).toBe('resize trades, 24%');
    expect(resizeLabel('trades', undefined)).toBe('resize trades');
  });
});
