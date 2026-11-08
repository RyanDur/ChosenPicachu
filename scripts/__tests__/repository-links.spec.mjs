import {existsSync, readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {describe, expect, it} from 'vitest';

const linked = /repository\.(file|directory)\('([^']+)'\)/g;

const sources = execFileSync('git', ['ls-files', 'src/**/*.ts', 'src/**/*.tsx'], {encoding: 'utf8'})
  .split('\n').filter(path => path.length > 0);

const links = sources.flatMap(source => [...readFileSync(source, 'utf8').matchAll(linked)]
  .map(([, kind, path]) => ({source, kind, path})));

describe('a link to the repository', () => {
  it('should find some links to check', () => {
    expect(links.length).toBeGreaterThan(10);
  });

  it.each(links)('$source links to $path, which exists', ({path}) => {
    expect(existsSync(path)).toBe(true);
  });
});
