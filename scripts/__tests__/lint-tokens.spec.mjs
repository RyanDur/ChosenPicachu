import {join} from 'node:path';
import stylelint from 'stylelint';
import {describe, expect, it} from 'vitest';
import {tokenRead} from '../lint/tokens.mjs';

const readIn = join(import.meta.dirname, 'fixtures', 'tokens');

const warningsFor = async code => {
  const {results: [{warnings}]} = await stylelint.lint({
    code,
    codeFilename: 'src/styles/a.css',
    config: {plugins: [tokenRead], rules: {'chosen/token-read': [true, {readIn}]}}
  });
  return warnings.map(({text}) => text);
};

describe('chosen/token-read', () => {
  it('should accept a token a style sheet reads with var()', async () => {
    expect(await warningsFor(':root { --read-by-a-sheet: 1rem; }')).toEqual([]);
  });

  it('should accept a token a script spells with its dashes', async () => {
    expect(await warningsFor(':root { --read-by-a-script: 500px; }')).toEqual([]);
  });

  it('should refuse a token a script names only as a plain word', async () => {
    expect(await warningsFor(':root { --plain-word: 1rem; }')).toHaveLength(1);
  });

  it('should refuse a token nothing reads', async () => {
    expect(await warningsFor(':root { --nothing-reads-this: 1rem; }')).toHaveLength(1);
  });
});
