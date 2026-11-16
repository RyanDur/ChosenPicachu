import {checksOf, clearToPush, refusals} from '../clear-to-push.mjs';

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

  test('a branch with no pull request yet that changes a file another open pull request changes is refused', () => {
    const said = refusals({
      branch: 'verify/b',
      changed: ['AGENTS.md', 'src/b.ts'],
      pulls: [pull(1, 'verify/a', ['AGENTS.md', 'src/a.ts'])],
      checks: []
    });

    expect(said).toEqual(['#1 already changes AGENTS.md. That work goes to #1’s owner.']);
  });

  test('a fix for a red check on main may share a file, since it goes alone and first', () => {
    expect(refusals({
      branch: 'verify/main-journeys',
      changed: ['AGENTS.md'],
      pulls: [pull(1, 'verify/a', ['AGENTS.md'])],
      checks: []
    })).toEqual([]);
  });

  test('a branch whose pull request is open may keep changing its own files, whatever opened since', () => {
    expect(refusals({
      branch: 'verify/a',
      changed: ['AGENTS.md'],
      pulls: [pull(1, 'verify/a', ['AGENTS.md']), pull(5, 'verify/main-x', ['AGENTS.md'])],
      checks: []
    })).toEqual([]);
  });

  test('a pending check is read even though gh exits non-zero while one is pending', () => {
    const pending = () => {
      throw Object.assign(new Error('exit status 8'), {stdout: '[{"name":"review","bucket":"pending"}]'});
    };

    expect(checksOf('verify/a', pending)).toEqual([{name: 'review', bucket: 'pending'}]);
  });

  test('when GitHub cannot be read, the push goes through and says so', () => {
    const offline = () => {
      throw new Error('could not resolve host: api.github.com');
    };

    expect(clearToPush('verify/a', 'HEAD', offline)).toEqual({refused: [], unread: 'could not resolve host: api.github.com'});
  });
});
