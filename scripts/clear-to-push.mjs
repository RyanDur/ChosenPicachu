import {has, maybe} from '@ryandur/sand';
import {execFileSync} from 'node:child_process';

/** @typedef {{name: string, bucket: string, workflow: string}} Check */
/** @typedef {{number: number, headRefName: string}} Pull */
/** @typedef {(command: string, ...args: string[]) => string} Run */

/** @param {Check} check */
const gates = ({workflow}) => workflow === 'Checks';

/**
 * @param {Pull} own
 * @param {Check[]} checks
 * @return {string[]}
 */
const runRefusals = (own, checks) => {
  const names = checks.filter(check => gates(check) && check.bucket === 'pending').map(({name}) => name);
  return has(names) ? [`#${own.number} is still running ${names.join(', ')}. Push once the run is done, with every fix for it.`] : [];
};

/**
 * @param {string} text
 * @return {string[]}
 */
const linesOf = text => text.split('\n').filter(line => has(line));

/**
 * @param {Pull} other
 * @param {Run} run
 * @return {string[]}
 */
const filesOf = (other, run) => linesOf(run('gh', 'api', '--paginate', `repos/{owner}/{repo}/pulls/${other.number}/files`,
  '--jq', '.[] | .filename, (.previous_filename // empty)'));

/**
 * @param {string[]} changed
 * @param {Pull[]} others
 * @param {Run} run
 * @return {string[]}
 */
const sharingRefusals = (changed, others, run) => others.flatMap(other => {
  const shared = filesOf(other, run).filter(path => changed.includes(path));
  return has(shared) ? [`#${other.number} already changes ${shared.join(', ')}. That work goes to #${other.number}’s owner.`] : [];
});

/** @type {Run} */
const outputOf = (command, ...args) => execFileSync(command, args, {encoding: 'utf8', stdio: 'pipe', timeout: 15_000}).trim();

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
 * @return {string[]}
 */
const refusalsOf = (branch, pushed, run) => {
  /** @type {Pull[]} */
  const pulls = JSON.parse(run('gh', 'pr', 'list', '--state', 'open', '--limit', '1000', '--json', 'number,headRefName'));
  const own = pulls.find(({headRefName}) => headRefName === branch);
  if (has(own)) return runRefusals(own, checksOf(branch, run));
  if (branch.startsWith('verify/main-')) return [];
  run('git', 'fetch', '--quiet', 'origin', 'main');
  return sharingRefusals(linesOf(run('git', 'diff', '--name-only', '--no-renames', `origin/main...${pushed}`)), pulls, run);
};

/**
 * @param {string} branch
 * @param {string} pushed
 * @param {Run} run
 * @return {{refused: string[], unread?: string}}
 */
export const clearToPush = (branch, pushed, run = outputOf) => {
  try {
    return {refused: refusalsOf(branch, pushed, run)};
  } catch (error) {
    const printed = maybe(error.stderr).map(stderr => String(stderr).trim()).orElse('');
    return {refused: [], unread: has(printed) ? printed : error.message.split('\n')[0]};
  }
};

if (import.meta.main) {
  const [, , pushedTo, pushed = 'HEAD'] = process.argv;
  const {refused, unread} = clearToPush(has(pushedTo) ? pushedTo : outputOf('git', 'branch', '--show-current'), pushed);
  if (has(unread)) console.error(`pre-push: the open pull requests couldn't be checked (${unread}).`);
  refused.forEach(reason => console.error(`pre-push: ${reason}`));
  process.exitCode = has(refused) ? 1 : 0;
}
