import {refusals} from '../pulls/clear-to-push.mjs';

const pull = (number, branch, files) => ({number, headRefName: branch, files: files.map(path => ({path}))});

describe('clear to push', () => {
  test('a branch whose pull request is still running its checks is refused, naming them', () => {
    const said = refusals({
      branch: 'verify/a',
      changed: ['src/a.ts'],
      pulls: [pull(1, 'verify/a', ['src/a.ts'])],
      checks: [{name: 'review', bucket: 'pending'}, {name: 'build_test', bucket: 'pass'}]
    });

    expect(said).toEqual(['#1 is still running review. Push once the run is done, with every fix for it.']);
  });

  test('a branch whose run is done is clear', () => {
    expect(refusals({
      branch: 'verify/a',
      changed: ['src/a.ts'],
      pulls: [pull(1, 'verify/a', ['src/a.ts'])],
      checks: [{name: 'review', bucket: 'fail'}, {name: 'build_test', bucket: 'pass'}]
    })).toEqual([]);
  });

  test('a branch that changes a file another open pull request changes is refused, naming both', () => {
    const said = refusals({
      branch: 'verify/b',
      changed: ['AGENTS.md', 'src/b.ts'],
      pulls: [pull(1, 'verify/a', ['AGENTS.md', 'src/a.ts']), pull(2, 'verify/b', ['src/b.ts'])],
      checks: []
    });

    expect(said).toEqual(['#1 already changes AGENTS.md. That work goes to #1, or waits until it merges.']);
  });

  test('a fix for a red check on main may share a file, since it goes alone and first', () => {
    expect(refusals({
      branch: 'verify/main-journeys',
      changed: ['AGENTS.md'],
      pulls: [pull(1, 'verify/a', ['AGENTS.md'])],
      checks: []
    })).toEqual([]);
  });
});
