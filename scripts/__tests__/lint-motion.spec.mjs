import stylelint from 'stylelint';
import {describe, expect, it} from 'vitest';
import {motion} from '../lint/motion.mjs';

const warningsFor = async code => {
  const {results: [{warnings}]} = await stylelint.lint({
    code,
    config: {plugins: [motion], rules: {'chosen/compositor-motion': true}}
  });
  return warnings.map(({text}) => text);
};

describe('chosen/compositor-motion', () => {
  it('should accept a transition on a property the GPU composites', async () => {
    expect(await warningsFor('a { transition: translate .3s ease, opacity .3s; }')).toEqual([]);
  });

  it('should accept a grid track opening and closing', async () => {
    expect(await warningsFor('a { transition: grid-template-rows .3s ease-in-out, grid-template-columns .3s; }')).toEqual([]);
  });

  it('should accept a grid track named in transition-property', async () => {
    expect(await warningsFor('a { transition-property: grid-template-rows, content-visibility; }')).toEqual([]);
  });

  it('should refuse a height', async () => {
    expect(await warningsFor('a { transition: block-size .3s; }')).toHaveLength(1);
  });

  it('should refuse all', async () => {
    expect(await warningsFor('a { transition: all .3s; }')).toHaveLength(1);
  });

  it('should refuse a keyframe that moves a margin', async () => {
    expect(await warningsFor('@keyframes in { from { margin-block-end: 0; } }')).toHaveLength(1);
  });
});
