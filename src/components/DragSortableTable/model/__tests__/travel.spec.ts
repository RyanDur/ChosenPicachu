import {describe, expect, it} from 'vitest';
import {travel} from '../travel';

describe('the travel vocabulary', () => {
  it('a move with no buttons is the drop', () => {
    const happened: string[] = [];
    const listener = travel.pointer(() => happened.push('moved'), () => happened.push('drop'));

    listener({buttons: 0, pointerId: 7, clientX: 0, clientY: 0, currentTarget: null});

    expect(happened).toEqual(['drop']);
  });
});
