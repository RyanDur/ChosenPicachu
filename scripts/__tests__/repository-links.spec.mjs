import {existsSync, readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {has, not} from '@ryandur/sand';
import {describe, expect, it} from 'vitest';

const linked = /repository\.(file|directory)\('([^']+)'\)/g;

const sources = execFileSync('git', ['ls-files', 'src/**/*.ts', 'src/**/*.tsx'], {encoding: 'utf8'})
  .split('\n').filter(path => has(path));

const links = sources.flatMap(source => [...readFileSync(source, 'utf8').matchAll(linked)]
  .map(([, kind, path]) => ({source, kind, path})));

describe('a link to the repository', () => {
  it('should find some links to check', () => {
    expect(links.length).toBeGreaterThan(10);
  });

  it('should point every link at a path that exists', () => {
    expect(links.filter(({path}) => not(existsSync(path))).map(({source, path}) => `${source} links to ${path}`)).toEqual([]);
  });
});
