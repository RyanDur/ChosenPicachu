import {vanillaFrame} from '../__test_support';
import {builds} from '../builds';

describe('the frame table, at lazy pace', () => {
  it('should stand the lazy build when the dial says lazy', () => {
    vanillaFrame.stand({pace: 'lazy'});

    expect(vanillaFrame.host()).toBeInstanceOf(builds.lazy);
  });
});
