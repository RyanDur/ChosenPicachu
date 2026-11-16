import {has, not} from '@ryandur/sand';
import {checksOf, clearToPush} from '../clear-to-push.mjs';

const check = (name, bucket, workflow = 'Checks') => ({name, bucket, workflow});
const renamed = (from, path) => ({from, path});

const failed = reason => Object.assign(new Error(`Command failed\n${reason}\n`), {stderr: `${reason}\n`});
const quoted = path => /[^\x20-\x7e]/.test(path)
  ? `"${Array.from(new TextEncoder().encode(path), byte => byte < 0x80 ? String.fromCharCode(byte) : `\\${byte.toString(8)}`).join('')}"`
  : path;

/**
 * @param {{
 *   pulls?: {number: number, branch: string, files?: (string | {from: string, path: string})[], unreadable?: string}[],
 *   checks?: object[],
 *   changed?: (string | {from: string, path: string})[],
 *   gitDown?: string
 * }} world
 */
const githubWith = ({pulls = [], checks = [], changed = [], gitDown}) => (command, ...args) => {
  if (command === 'git') {
    if (has(gitDown)) throw failed(gitDown);
    if (not(args.includes('diff'))) return '';
    const paths = changed.flatMap(file => typeof file === 'string' ? [file]
      : args.includes('--no-renames') ? [file.from, file.path] : [file.path]);
    return paths.map(path => args.includes('core.quotePath=false') ? path : quoted(path)).join('\n');
  }
  if (args[0] === 'api') {
    const pull = pulls.find(({number}) => args[2] === `repos/{owner}/{repo}/pulls/${number}/files`);
    if (has(pull.unreadable)) throw failed(pull.unreadable);
    const withOldPaths = String(args.at(-1)).includes('previous_filename');
    return pull.files.flatMap(file => typeof file === 'string' ? [file] : withOldPaths ? [file.path, file.from] : [file.path]).join('\n');
  }
  if (args[1] === 'list') {
    const listed = args.includes('--limit') ? pulls : pulls.slice(0, 30);
    return JSON.stringify(listed.map(({number, branch}) => ({number, headRefName: branch})));
  }
  if (args[1] === 'checks') return JSON.stringify(checks);
  throw new Error(`no stand-in for ${command} ${args.join(' ')}`);
};

describe('clear to push', () => {
  test('a branch whose pull request is still running its checks is refused, naming them', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: []}], checks: [check('review', 'pending'), check('build_test', 'pass')]});

    expect(clearToPush('verify/a', 'HEAD', github).refused)
      .toEqual(['#1 is still running review. Push once the run is done, with every fix for it.']);
  });

  test('a branch whose run is done is clear', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: []}], checks: [check('review', 'fail'), check('build_test', 'pass')]});

    expect(clearToPush('verify/a', 'HEAD', github)).toEqual({refused: []});
  });

  test('a review the Discuss workflow is rerunning holds a push, since its findings are still coming', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: []}], checks: [check('review', 'pending'), check('rerun', 'pass', 'Discuss')]});

    expect(clearToPush('verify/a', 'HEAD', github).refused)
      .toEqual(['#1 is still running review. Push once the run is done, with every fix for it.']);
  });

  test('a check from a workflow that was renamed still holds a push', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: []}], checks: [check('journeys', 'pending', 'Pull request checks')]});

    expect(clearToPush('verify/a', 'HEAD', github).refused)
      .toEqual(['#1 is still running journeys. Push once the run is done, with every fix for it.']);
  });

  test('the Pages report gates nothing, so it does not hold a push', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: []}], checks: [check('pages', 'pending', 'Pages'), check('review', 'pass')]});

    expect(clearToPush('verify/a', 'HEAD', github)).toEqual({refused: []});
  });

  test('a branch with no pull request yet that changes a file another open pull request changes is refused', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md', 'src/a.ts']}], changed: ['AGENTS.md', 'src/b.ts']});

    expect(clearToPush('verify/b', 'HEAD', github).refused).toEqual(['#1 already changes AGENTS.md. That work goes to #1’s owner.']);
  });

  test('a branch with no pull request yet that shares no file is clear', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: ['src/a.ts']}], changed: ['src/b.ts']});

    expect(clearToPush('verify/b', 'HEAD', github)).toEqual({refused: []});
  });

  test('a fix for a red check on main may share a file, since it goes alone and first', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md']}], changed: ['AGENTS.md']});

    expect(clearToPush('verify/main-journeys', 'HEAD', github)).toEqual({refused: []});
  });

  test('a branch whose pull request is open may keep changing its own files, whatever opened since', () => {
    const github = githubWith({
      pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md']}, {number: 5, branch: 'verify/main-x', files: ['AGENTS.md']}],
      changed: ['AGENTS.md']
    });

    expect(clearToPush('verify/a', 'HEAD', github)).toEqual({refused: []});
  });

  test('a branch whose pull request is open is refused when it adds a file another open pull request changes', () => {
    const github = githubWith({
      pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md']}, {number: 2, branch: 'verify/b', files: ['src/x.ts']}],
      changed: ['AGENTS.md', 'src/x.ts']
    });

    expect(clearToPush('verify/a', 'HEAD', github).refused).toEqual(['#2 already changes src/x.ts. That work goes to #2’s owner.']);
  });

  test('a branch whose pull request is still running is refused even when git cannot reach main', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: []}], checks: [check('journeys', 'pending')], gitDown: 'timed out'});

    expect(clearToPush('verify/a', 'HEAD', github))
      .toEqual({refused: ['#1 is still running journeys. Push once the run is done, with every fix for it.']});
  });

  test('a branch that renames a file another open pull request changes is refused', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: ['src/a.ts']}], changed: [renamed('src/a.ts', 'src/b.ts')]});

    expect(clearToPush('verify/b', 'HEAD', github).refused).toEqual(['#1 already changes src/a.ts. That work goes to #1’s owner.']);
  });

  test('a file another open pull request renamed away is still seen as shared under its old path', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: [renamed('src/a.ts', 'src/b.ts')]}], changed: ['src/a.ts']});

    expect(clearToPush('verify/b', 'HEAD', github).refused).toEqual(['#1 already changes src/a.ts. That work goes to #1’s owner.']);
  });

  test('a path with letters outside ASCII is seen as shared', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: ['src/café.ts']}], changed: ['src/café.ts']});

    expect(clearToPush('verify/b', 'HEAD', github).refused).toEqual(['#1 already changes src/café.ts. That work goes to #1’s owner.']);
  });

  test('every open pull request is read, past gh’s default of thirty', () => {
    const others = Array.from({length: 30}, (_, at) => ({number: at + 1, branch: `verify/${at}`, files: []}));
    const github = githubWith({pulls: [...others, {number: 31, branch: 'verify/b', files: []}], checks: [check('review', 'pending')]});

    expect(clearToPush('verify/b', 'HEAD', github).refused)
      .toEqual(['#31 is still running review. Push once the run is done, with every fix for it.']);
  });

  test('a pull request whose files cannot be read keeps the refusals found for the others, and says so', () => {
    const github = githubWith({
      pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md']}, {number: 2, branch: 'verify/c', unreadable: 'HTTP 502'}],
      changed: ['AGENTS.md']
    });

    expect(clearToPush('verify/b', 'HEAD', github))
      .toEqual({refused: ['#1 already changes AGENTS.md. That work goes to #1’s owner.'], unread: 'HTTP 502'});
  });

  test('when GitHub cannot be read, the push goes through and says so', () => {
    const offline = () => {
      throw new Error('could not resolve host: api.github.com');
    };

    expect(clearToPush('verify/a', 'HEAD', offline)).toEqual({refused: [], unread: 'could not resolve host: api.github.com'});
  });

  test('when a command fails, the note gives the reason it printed', () => {
    const expired = () => {
      throw failed('HTTP 401: Bad credentials');
    };

    expect(clearToPush('verify/a', 'HEAD', expired)).toEqual({refused: [], unread: 'HTTP 401: Bad credentials'});
  });

  test('when the checks cannot be read, the push goes through and says so', () => {
    const github = githubWith({pulls: [{number: 1, branch: 'verify/a', files: []}]});
    const dropped = (command, ...args) => {
      if (args[1] === 'checks') throw Object.assign(new Error('connection reset'), {stdout: '', stderr: 'connection reset'});
      return github(command, ...args);
    };

    expect(clearToPush('verify/a', 'HEAD', dropped)).toEqual({refused: [], unread: 'connection reset'});
  });

  test('a pending check is read even though gh exits non-zero while one is pending', () => {
    const pending = () => {
      throw Object.assign(new Error('exit status 8'), {stdout: '[{"name":"review","bucket":"pending"}]'});
    };

    expect(checksOf('verify/a', pending)).toEqual([{name: 'review', bucket: 'pending'}]);
  });

  test('a branch with no pull request yet has no checks', () => {
    const none = () => {
      throw Object.assign(new Error('exit status 1'), {stdout: '', stderr: 'no pull requests found for branch "verify/a"'});
    };

    expect(checksOf('verify/a', none)).toEqual([]);
  });

  test('a pull request whose run has not registered yet has no checks', () => {
    const notYet = () => {
      throw Object.assign(new Error('exit status 1'), {stdout: '', stderr: "no checks reported on the 'verify/a' branch"});
    };

    expect(checksOf('verify/a', notYet)).toEqual([]);
  });
});
