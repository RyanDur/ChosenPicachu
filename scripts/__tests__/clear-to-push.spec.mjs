import {checksOf, clearToPush, refusals} from '../clear-to-push.mjs';

const check = (name, bucket, workflow = 'Checks') => ({name, bucket, workflow});

const pull = (number, branch, files) => ({number, headRefName: branch, files: files.map(path => ({path}))});

describe('clear to push', () => {
  test('a branch whose pull request is still running its checks is refused, naming them', () => {
    const said = refusals({
      branch: 'verify/a',
      changed: ['src/a.ts'],
      pulls: [pull(1, 'verify/a', ['src/a.ts'])],
      checks: [check('review', 'pending'), check('build_test', 'pass')]
    });

    expect(said).toEqual(['#1 is still running review. Push once the run is done, with every fix for it.']);
  });

  test('a branch whose run is done is clear', () => {
    expect(refusals({
      branch: 'verify/a',
      changed: ['src/a.ts'],
      pulls: [pull(1, 'verify/a', ['src/a.ts'])],
      checks: [check('review', 'fail'), check('build_test', 'pass')]
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

  test('when a command fails, the note gives the reason it printed', () => {
    const expired = () => {
      throw Object.assign(new Error('Command failed: gh pr list\nHTTP 401: Bad credentials\n'),
        {stderr: 'HTTP 401: Bad credentials\n'});
    };

    expect(clearToPush('verify/a', 'HEAD', expired)).toEqual({refused: [], unread: 'HTTP 401: Bad credentials'});
  });

  test('a branch with no pull request yet has no checks', () => {
    const none = () => {
      throw Object.assign(new Error('exit status 1'), {stdout: '', stderr: 'no pull requests found for branch "verify/a"'});
    };

    expect(checksOf('verify/a', none)).toEqual([]);
  });

  test('when the checks cannot be read, the push goes through and says so', () => {
    const dropped = (...args) => {
      if (args.includes('checks')) throw Object.assign(new Error('connection reset'), {stdout: '', stderr: 'connection reset'});
      return args.includes('list') ? JSON.stringify([pull(1, 'verify/a', ['src/a.ts'])]) : 'src/a.ts';
    };

    expect(clearToPush('verify/a', 'HEAD', dropped)).toEqual({refused: [], unread: 'connection reset'});
  });

  test('a report that gates nothing, or a reply to a review, does not hold a push', () => {
    expect(refusals({
      branch: 'verify/a',
      changed: ['src/a.ts'],
      pulls: [pull(1, 'verify/a', ['src/a.ts'])],
      checks: [check('pages', 'pending'), check('rerun', 'pending', 'Discuss'), check('review', 'pass')]
    })).toEqual([]);
  });

  test('a branch with no pull request yet is checked for shared files without reading any checks', () => {
    const run = (...args) => {
      if (args.includes('checks')) throw new Error('checks were read');
      return args.includes('list') ? JSON.stringify([pull(1, 'verify/a', ['AGENTS.md'])]) : 'AGENTS.md';
    };

    expect(clearToPush('verify/b', 'HEAD', run)).toEqual({refused: ['#1 already changes AGENTS.md. That work goes to #1’s owner.']});
  });
});
