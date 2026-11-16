import {not} from '@ryandur/sand';
import {checksOf, clearToPush} from '../clear-to-push.mjs';

const check = (name, bucket, workflow = 'Checks') => ({name, bucket, workflow});

/**
 * Stands in for gh and git: the open pull requests with their files, the branch's checks, and the files it changes.
 * @param {{pulls?: {number: number, branch: string, files?: string[]}[], checks?: object[], changed?: string[]}} world
 */
const github = ({pulls = [], checks = [], changed = []}) => (command, ...args) => {
  if (command === 'git') return args[0] === 'diff' ? changed.join('\n') : '';
  if (args[0] === 'api') {
    const number = Number(args[2].match(/pulls\/(\d+)\/files/)[1]);
    return pulls.find(pull => pull.number === number).files.join('\n');
  }
  if (args[1] === 'list') return JSON.stringify(pulls.map(({number, branch}) => ({number, headRefName: branch})));
  if (args[1] === 'checks') return JSON.stringify(checks);
  throw new Error(`no stand-in for ${command} ${args.join(' ')}`);
};

describe('clear to push', () => {
  test('a branch whose pull request is still running its checks is refused, naming them', () => {
    const run = github({pulls: [{number: 1, branch: 'verify/a'}], checks: [check('review', 'pending'), check('build_test', 'pass')]});

    expect(clearToPush('verify/a', 'HEAD', run).refused)
      .toEqual(['#1 is still running review. Push once the run is done, with every fix for it.']);
  });

  test('a branch whose run is done is clear', () => {
    const run = github({pulls: [{number: 1, branch: 'verify/a'}], checks: [check('review', 'fail'), check('build_test', 'pass')]});

    expect(clearToPush('verify/a', 'HEAD', run)).toEqual({refused: []});
  });

  test('a review the Discuss workflow is rerunning holds a push, since its findings are still coming', () => {
    const run = github({pulls: [{number: 1, branch: 'verify/a'}], checks: [check('review', 'pending'), check('rerun', 'pass', 'Discuss')]});

    expect(clearToPush('verify/a', 'HEAD', run).refused)
      .toEqual(['#1 is still running review. Push once the run is done, with every fix for it.']);
  });

  test('the pages report gates nothing, so it does not hold a push', () => {
    const run = github({pulls: [{number: 1, branch: 'verify/a'}], checks: [check('pages', 'pending', 'Pages'), check('review', 'pass')]});

    expect(clearToPush('verify/a', 'HEAD', run)).toEqual({refused: []});
  });

  test('a branch with no pull request yet that changes a file another open pull request changes is refused', () => {
    const run = github({pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md', 'src/a.ts']}], changed: ['AGENTS.md', 'src/b.ts']});

    expect(clearToPush('verify/b', 'HEAD', run).refused).toEqual(['#1 already changes AGENTS.md. That work goes to #1’s owner.']);
  });

  test('a branch with no pull request yet that shares no file is clear', () => {
    const run = github({pulls: [{number: 1, branch: 'verify/a', files: ['src/a.ts']}], changed: ['src/b.ts']});

    expect(clearToPush('verify/b', 'HEAD', run)).toEqual({refused: []});
  });

  test('a fix for a red check on main may share a file, since it goes alone and first', () => {
    const run = github({pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md']}], changed: ['AGENTS.md']});

    expect(clearToPush('verify/main-journeys', 'HEAD', run)).toEqual({refused: []});
  });

  test('a branch whose pull request is open may keep changing its own files, whatever opened since', () => {
    const run = github({
      pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md']}, {number: 5, branch: 'verify/main-x', files: ['AGENTS.md']}],
      changed: ['AGENTS.md']
    });

    expect(clearToPush('verify/a', 'HEAD', run)).toEqual({refused: []});
  });

  test('a branch whose pull request is open reads only its checks, so a stalled fetch cannot let it through', () => {
    const stand = github({pulls: [{number: 1, branch: 'verify/a'}], checks: [check('journeys', 'pending')]});
    const run = (command, ...args) => {
      if (command === 'git') throw new Error('timed out');
      return stand(command, ...args);
    };

    expect(clearToPush('verify/a', 'HEAD', run))
      .toEqual({refused: ['#1 is still running journeys. Push once the run is done, with every fix for it.']});
  });

  test('a branch with no pull request yet is checked for shared files without reading any checks', () => {
    const stand = github({pulls: [{number: 1, branch: 'verify/a', files: ['AGENTS.md']}], changed: ['AGENTS.md']});
    const run = (command, ...args) => {
      if (args[1] === 'checks') throw new Error('checks were read');
      return stand(command, ...args);
    };

    expect(clearToPush('verify/b', 'HEAD', run)).toEqual({refused: ['#1 already changes AGENTS.md. That work goes to #1’s owner.']});
  });

  test('a branch that renames a file another open pull request changes is refused', () => {
    const stand = github({pulls: [{number: 1, branch: 'verify/a', files: ['src/a.ts']}]});
    const run = (command, ...args) => {
      if (args[0] === 'diff') return args.includes('--no-renames') ? 'src/a.ts\nsrc/b.ts' : 'src/b.ts';
      return stand(command, ...args);
    };

    expect(clearToPush('verify/b', 'HEAD', run).refused).toEqual(['#1 already changes src/a.ts. That work goes to #1’s owner.']);
  });

  test('a file another open pull request renamed away is still seen as shared under its old path', () => {
    const stand = github({pulls: [{number: 1, branch: 'verify/a', files: ['src/b.ts']}], changed: ['src/a.ts']});
    const run = (command, ...args) => {
      if (args[0] === 'api') return String(args.at(-1)).includes('previous_filename') ? 'src/b.ts\nsrc/a.ts' : 'src/b.ts';
      return stand(command, ...args);
    };

    expect(clearToPush('verify/b', 'HEAD', run).refused).toEqual(['#1 already changes src/a.ts. That work goes to #1’s owner.']);
  });

  test('every open pull request is read, past gh’s default of thirty', () => {
    const others = Array.from({length: 30}, (_, at) => ({number: at + 1, branch: `verify/${at}`}));
    const stand = github({pulls: [...others, {number: 31, branch: 'verify/b'}], checks: [check('review', 'pending')]});
    const run = (command, ...args) => {
      const answer = stand(command, ...args);
      return args[1] === 'list' && not(args.includes('--limit')) ? JSON.stringify(JSON.parse(answer).slice(0, 30)) : answer;
    };

    expect(clearToPush('verify/b', 'HEAD', run).refused)
      .toEqual(['#31 is still running review. Push once the run is done, with every fix for it.']);
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

  test('when the checks cannot be read, the push goes through and says so', () => {
    const stand = github({pulls: [{number: 1, branch: 'verify/a'}]});
    const dropped = (command, ...args) => {
      if (args[1] === 'checks') throw Object.assign(new Error('connection reset'), {stdout: '', stderr: 'connection reset'});
      return stand(command, ...args);
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
