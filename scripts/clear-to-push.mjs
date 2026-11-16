import {has, maybe, not} from '@ryandur/sand';
import {execFileSync} from 'node:child_process';

/** @typedef {{name: string, bucket: string, workflow: string}} Check */
/** @typedef {{number: number, headRefName: string, files: {path: string}[]}} Pull */

/** @param {Check[]} checks */
const reportsOnly = ['pages'];

/** @param {Check} check */
const gates = ({workflow, name}) => workflow === 'Checks' && not(reportsOnly.includes(name));

/** @param {Check[]} checks */
const running = checks => checks.filter(check => gates(check) && check.bucket === 'pending').map(({name}) => name);

/**
 * @param {Pull} own
 * @param {Check[]} checks
 * @return {string[]}
 */
const runRefusals = (own, checks) => {
  const names = running(checks);
  return has(names) ? [`#${own.number} is still running ${names.join(', ')}. Push once the run is done, with every fix for it.`] : [];
};

/**
 * @param {string[]} changed
 * @param {Pull[]} others
 * @return {string[]}
 */
const sharingRefusals = (changed, others) => others.flatMap(other => {
  const shared = other.files.map(({path}) => path).filter(path => changed.includes(path));
  return has(shared) ? [`#${other.number} already changes ${shared.join(', ')}. That work goes to #${other.number}’s owner.`] : [];
});

/** @param {string} branch */
const fixesMain = branch => branch.startsWith('verify/main-');

/**
 * @param {{branch: string, changed: string[], pulls: Pull[], checks: Check[]}} push
 * @return {string[]}
 */
export const refusals = ({branch, changed, pulls, checks}) => {
  const own = pulls.find(({headRefName}) => headRefName === branch);
  if (has(own)) return runRefusals(own, checks);
  return fixesMain(branch) ? [] : sharingRefusals(changed, pulls);
};

/** @typedef {(command: string, ...args: string[]) => string} Run */

/** @type {Run} */
const outputOf = (command, ...args) => execFileSync(command, args, {encoding: 'utf8', stdio: 'pipe'}).trim();

/**
 * @param {string} branch
 * @param {Run} run
 * @return {Check[]}
 */
export const checksOf = (branch, run = outputOf) => {
  try {
    return JSON.parse(run('gh', 'pr', 'checks', branch, '--json', 'name,bucket,workflow'));
  } catch (failure) {
    const {stdout, stderr} = failure;
    if (typeof stdout === 'string' && has(stdout.trim())) return JSON.parse(stdout);
    const noChecksYet = ['no pull requests found', 'no checks reported'];
    if (typeof stderr === 'string' && noChecksYet.some(reply => stderr.includes(reply))) return [];
    throw failure;
  }
};

/**
 * @param {string} branch
 * @param {string} pushed
 * @param {Run} run
 * @return {{refused: string[], unread?: string}}
 */
export const clearToPush = (branch, pushed, run = outputOf) => {
  try {
    /** @type {Pull[]} */
    const pulls = JSON.parse(run('gh', 'pr', 'list', '--state', 'open', '--json', 'number,headRefName,files'));
    run('git', 'fetch', '--quiet', 'origin', 'main');
    const changed = run('git', 'diff', '--name-only', `origin/main...${pushed}`).split('\n').filter(path => has(path));
    const opened = pulls.some(({headRefName}) => headRefName === branch);
    return {refused: refusals({branch, changed, pulls, checks: opened ? checksOf(branch, run) : []})};
  } catch (error) {
    const printed = maybe(error.stderr).map(stderr => String(stderr).trim()).orElse('');
    return {refused: [], unread: has(printed) ? printed : error.message.split('\n')[0]};
  }
};

if (import.meta.main) {
  const [, , pushedTo, pushed = 'HEAD'] = process.argv;
  const {refused, unread} = clearToPush(pushedTo ?? outputOf('git', 'branch', '--show-current'), pushed);
  if (has(unread)) console.error(`pre-push: the open pull requests couldn't be checked (${unread}).`);
  refused.forEach(reason => console.error(`pre-push: ${reason}`));
  process.exitCode = has(refused) ? 1 : 0;
}
