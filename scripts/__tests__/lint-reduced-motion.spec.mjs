import stylelint from 'stylelint';
import {describe, expect, it} from 'vitest';
import {reducedMotionOnce} from '../lint/reduced-motion.mjs';

const warningsFor = async (code, codeFilename = 'src/components/a.css') => {
  const {results: [{warnings}]} = await stylelint.lint({
    code,
    codeFilename,
    config: {plugins: [reducedMotionOnce], rules: {'chosen/reduced-motion-once': true}}
  });
  return warnings.map(({text}) => text);
};

describe('chosen/reduced-motion-once', () => {
  it('should refuse a component zeroing a duration under reduced motion', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { transition-duration: 0s; } }')).toHaveLength(1);
  });

  it('should refuse the transition shorthand under reduced motion, which sets a duration', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { transition: none; } }')).toHaveLength(1);
  });

  it('should refuse an animation under reduced motion', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { animation: none; } }')).toHaveLength(1);
  });

  it('should refuse a component stopping its own animation under reduced motion', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { animation-name: none; } }')).toHaveLength(1);
  });

  it('should refuse a component pausing its own animation under reduced motion', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { animation-play-state: paused; } }')).toHaveLength(1);
  });

  it('should refuse a component naming no transition under reduced motion', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { transition-property: none; } }')).toHaveLength(1);
  });

  it('should refuse scroll behavior under reduced motion', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { scroll-behavior: auto; } }')).toHaveLength(1);
  });

  it('should refuse a duration in a reduced-motion block nested in a rule', async () => {
    expect(await warningsFor('a { &::before { @media (prefers-reduced-motion: reduce) { transition-duration: 0s; } } }')).toHaveLength(1);
  });

  it('should refuse a timing function under reduced motion', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { transition-timing-function: linear; } }')).toHaveLength(1);
  });

  it('should refuse a duration under the boolean form of the query, which means reduce', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion) { a { transition: none; } }')).toHaveLength(1);
  });

  it('should accept a duration under a query that starts with not, which asks for motion', async () => {
    expect(await warningsFor('@media not all and (prefers-reduced-motion: reduce) { a { transition: .3s; } }')).toEqual([]);
  });

  it('should accept a duration under no preference', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: no-preference) { a { transition: .3s; } }')).toEqual([]);
  });

  it('should refuse a duration under a query written in capitals', async () => {
    expect(await warningsFor('@media (PREFERS-REDUCED-MOTION: REDUCE) { a { transition: none; } }')).toHaveLength(1);
  });

  it('should refuse a duration under a query that negates no preference, which means reduce', async () => {
    expect(await warningsFor('@media not (prefers-reduced-motion: no-preference) { a { transition: none; } }')).toHaveLength(1);
  });

  it('should refuse a vendor-prefixed transition under reduced motion', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { a { -webkit-transition: none; } }')).toHaveLength(1);
  });

  it('should accept a delay zeroed beside the slide it times', async () => {
    expect(await warningsFor('a { transition: color 0s 75ms; @media (prefers-reduced-motion: reduce) { transition-delay: 0s; } }')).toEqual([]);
  });

  it('should accept the words a reader who asks for less motion is shown', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { .when-motion-allowed { display: none; } }')).toEqual([]);
  });

  it('should accept a duration under a query for motion allowed', async () => {
    expect(await warningsFor('@media not (prefers-reduced-motion: reduce) { a { transition-duration: .3s; } }')).toEqual([]);
  });

  it('should accept a duration under a media query that is not about motion', async () => {
    expect(await warningsFor('@media (width <= 600px) { a { transition-duration: .3s; } }')).toEqual([]);
  });

  it('should accept a duration outside any reduced-motion block', async () => {
    expect(await warningsFor('a { transition-duration: .3s; }')).toEqual([]);
  });

  it('should accept the reset setting the durations once for every element', async () => {
    expect(await warningsFor('@media (prefers-reduced-motion: reduce) { * { transition-duration: 0s !important; } }', 'src/styles/reset.css')).toEqual([]);
  });
});
