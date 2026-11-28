import stylelint from 'stylelint';
import {describe, expect, it} from 'vitest';
import {motion} from '../lint/motion.mjs';

const warningsFor = async (code, {codeFilename} = {codeFilename: 'src/a.css'}) => {
  const {results: [{warnings}]} = await stylelint.lint({
    code,
    codeFilename,
    config: {plugins: [motion], rules: {'chosen/compositor-motion': true}}
  });
  return warnings.map(({text}) => text);
};

describe('chosen/compositor-motion', () => {
  it('should accept a transition on a property the GPU composites', async () => {
    expect(await warningsFor('a { transition: translate .3s ease, opacity .3s; }')).toEqual([]);
  });

  it('should refuse a height sliding in a style sheet that has no file name', async () => {
    expect(await warningsFor('a { transition: block-size 1s; }', {codeFilename: undefined})).toHaveLength(1);
  });

  it('should accept a grid track opening and closing', async () => {
    expect(await warningsFor('a { transition: grid-template-rows .3s ease-in-out, grid-template-columns .3s; }')).toEqual([]);
  });

  it('should accept a grid track named in transition-property', async () => {
    expect(await warningsFor('a { transition-property: grid-template-rows, content-visibility; }')).toEqual([]);
  });

  it('should accept a flip of any property, whose 0s duration draws no frame between', async () => {
    expect(await warningsFor('a { transition: color 0s 65ms, background-color 0ms; }')).toEqual([]);
  });

  it('should refuse a property that changes over time after a flip', async () => {
    expect(await warningsFor('a { transition: color 0s 65ms, background-color .3s; }')).toHaveLength(1);
  });

  it('should refuse a property whose duration is a custom property, even with a 0s delay', async () => {
    expect(await warningsFor('a { transition: color var(--fade) 0s; }')).toHaveLength(1);
  });

  it('should refuse a property whose duration is a math function, even with a 0s delay', async () => {
    expect(await warningsFor('a { transition: width max(.3s, 1ms) 0s; }')).toHaveLength(1);
  });

  it('should refuse a property whose duration nests a function in a function, even with a 0s delay', async () => {
    expect(await warningsFor('a { transition: width calc(var(--d) * 2) 0s; }')).toHaveLength(1);
  });

  it('should read a duration whose unit is in capitals', async () => {
    expect(await warningsFor('a { transition: width .3S 0s; }')).toHaveLength(1);
  });

  it('should read a flip only from the shorthand, so a flip written as longhands is refused', async () => {
    expect(await warningsFor('a { transition-property: color; transition-duration: 0s; }')).toHaveLength(1);
  });

  it('should refuse a height', async () => {
    expect(await warningsFor('a { transition: block-size .3s; }')).toHaveLength(1);
  });

  it('should accept the reset sliding a fold’s height to auto', async () => {
    expect(await warningsFor('details::details-content { transition: block-size .3s ease-in-out, content-visibility .3s allow-discrete; }',
      {codeFilename: 'src/styles/reset.css'})).toEqual([]);
  });

  it('should refuse a fold’s height sliding outside the reset', async () => {
    expect(await warningsFor('details::details-content { transition: block-size .3s; }', {codeFilename: 'src/pages/a.css'})).toHaveLength(1);
  });

  it('should refuse a height sliding in the reset on anything but a fold', async () => {
    expect(await warningsFor('dialog { transition: block-size .3s; }', {codeFilename: 'src/styles/reset.css'})).toHaveLength(1);
  });

  it('should refuse a height sliding in the reset on a list that names a fold beside something else', async () => {
    expect(await warningsFor('details::details-content, dialog { transition: block-size .3s; }', {codeFilename: 'src/styles/reset.css'}))
      .toHaveLength(1);
  });

  it('should accept the pill glider’s highlight sliding its anchored inset', async () => {
    expect(await warningsFor('.pill-glider { &::before { transition: inset .15s ease-in-out; } }',
      {codeFilename: 'src/components/PillGlider/PillGlider.css'})).toEqual([]);
  });

  it('should refuse an inset sliding outside the pill glider', async () => {
    expect(await warningsFor('.a::before { transition: inset .15s; }', {codeFilename: 'src/pages/a.css'})).toHaveLength(1);
  });

  it('should refuse an inset sliding in the pill glider on anything but its highlight', async () => {
    expect(await warningsFor('.pill-glider { .pill { transition: inset .15s; } }',
      {codeFilename: 'src/components/PillGlider/PillGlider.css'})).toHaveLength(1);
  });

  it('should refuse an inset sliding on a pill’s own ::before in the pill glider', async () => {
    expect(await warningsFor('.pill-glider { .pill::before { transition: inset .15s; } }',
      {codeFilename: 'src/components/PillGlider/PillGlider.css'})).toHaveLength(1);
  });

  it('should refuse an inset sliding on a hovered pill’s ::before in the pill glider', async () => {
    expect(await warningsFor('.pill-glider { .pill { &:hover::before { transition: inset .15s; } } }',
      {codeFilename: 'src/components/PillGlider/PillGlider.css'})).toHaveLength(1);
  });

  it('should refuse all', async () => {
    expect(await warningsFor('a { transition: all .3s; }')).toHaveLength(1);
  });

  it('should refuse a keyframe that moves a margin', async () => {
    expect(await warningsFor('@keyframes in { from { margin-block-end: 0; } }')).toHaveLength(1);
  });
});
