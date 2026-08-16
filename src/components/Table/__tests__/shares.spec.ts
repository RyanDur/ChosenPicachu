import {describe, expect, it} from 'vitest';
import {grippedAt, resizeArrows, resizeLabel, soughtTrade} from '../shares';

describe('the shares vocabulary', () => {
  it('seeds the grip from the table width, or nothing from no width', () => {
    expect(grippedAt(700, 120)).toEqual({fromX: 120, pxPerShare: 7});
    expect(grippedAt(0, 120)).toBeUndefined();
  });

  it('folds each move into the increment since the last one', () => {
    const grip = {fromX: 100, pxPerShare: 7};

    const first = soughtTrade(grip, 170, 0);
    expect(first).toEqual({delta: 10, carried: 10});
    expect(soughtTrade(grip, 240, first.carried)).toEqual({delta: 10, carried: 20});
  });

  it('claims the arrows for a step of shares, and swallows the press', () => {
    const trades: number[] = [];
    const swallowed: string[] = [];
    const listener = resizeArrows(delta => trades.push(delta));
    const press = (key: string) => ({
      key,
      preventDefault: (): void => {
        swallowed.push('default');
      },
      stopPropagation: (): void => {
        swallowed.push('descent');
      }
    });

    listener(press('ArrowRight'));
    listener(press('ArrowLeft'));
    listener(press('Tab'));

    expect(trades).toEqual([2, -2]);
    expect(swallowed).toEqual(['default', 'descent', 'default', 'descent']);
  });

  it('speaks the resize announcement, with the share once the ledger exists', () => {
    expect(resizeLabel('trades', 24.4)).toBe('resize trades, 24%');
    expect(resizeLabel('trades', undefined)).toBe('resize trades');
  });
});
