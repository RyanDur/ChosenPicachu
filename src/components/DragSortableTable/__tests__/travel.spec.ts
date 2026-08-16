import {describe, expect, it} from 'vitest';
import {drifted} from '../travel';

describe('the travel vocabulary', () => {
  it('measures the drift from the grab to the pointer', () => {
    expect(drifted({clientX: 130, clientY: 45}, {x: 100, y: 50})).toEqual({x: 30, y: -5});
  });
});
