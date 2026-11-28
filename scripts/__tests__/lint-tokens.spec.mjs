import stylelint from 'stylelint';
import {describe, expect, it} from 'vitest';
import {tokenRead} from '../lint/tokens.mjs';

const warningsFor = async code => {
  const {results: [{warnings}]} = await stylelint.lint({
    code,
    codeFilename: 'src/styles/a.css',
    config: {plugins: [tokenRead], rules: {'chosen/token-read': true}}
  });
  return warnings.map(({text}) => text);
};

describe('chosen/token-read', () => {
  it('should accept a token a style sheet reads with var()', async () => {
    expect(await warningsFor(':root { --page-inset: 1rem; }')).toEqual([]);
  });

  it('should accept a token a script reads by its name', async () => {
    expect(await warningsFor(':root { --phone-on-its-side: 500px; }')).toEqual([]);
  });

  it('should refuse a token nothing in src reads', async () => {
    expect(await warningsFor(':root { --nothing-reads-this: 1rem; }')).toHaveLength(1);
  });
});
