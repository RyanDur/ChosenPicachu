import {has, maybe, not} from '@ryandur/sand';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

/** @typedef {{name: string, bucket: string, workflow: string}} Check */
/** @typedef {{number: number, headRefName: string}} Pull */
/** @typedef {(command: string, ...args: string[]) => string} Run */
/** @typedef {{refused: string[], unread?: string}} Verdict */

/** @param {Check} check */
const holds = ({workflow}) => workflow !== 'Pages';

/**
 * @param {Pull} own
 * @param {Check[]} checks
 * @return {string[]}
 */
const runRefusals = (own, checks) => {
  const names = checks.filter(check => holds(check) && check.bucket === 'pending').map(({name}) => name);
  return has(names) ? [`#${own.number} is still running ${names.join(', ')}. Push once the run is done, with every fix for it.`] : [];
};

/**
 * @param {string} text
 * @return {string[]}
 */
const linesOf = text => text.split('\n').filter(line => has(line));

/**
 * @param {Pull} pull
 * @param {Run} run
 * @return {string[]}
 */
const filesOf = (pull, run) => linesOf(run('gh', 'api', '--paginate', `repos/{owner}/{repo}/pulls/${pull.number}/files`,
  '--jq', '.[] | .filename, (.previous_filename // empty)'));

/**
 * @param {Error & {stderr?: unknown}} error
 * @return {string}
 */
const reasonOf = error => {
  const printed = maybe(error.stderr).map(stderr => String(stderr).trim()).orElse('');
  return has(printed) ? printed : error.message.split('\n')[0];
};

/**
 * @param {Pull} pull
 * @param {Run} run
 * @return {{pull: Pull, files: string[], unread?: string}}
 */
const readFilesOf = (pull, run) => {
  try {
    return {pull, files: filesOf(pull, run)};
  } catch (error) {
    return {pull, files: [], unread: reasonOf(error)};
  }
};

/**
 * @param {string[]} changed
 * @param {Pull[]} others
 * @param {Run} run
 * @return {Verdict}
 */
const sharingRefusals = (changed, others, run) => {
  const reads = others.map(other => readFilesOf(other, run));
  const refused = reads.flatMap(({pull, files}) => {
    const shared = files.filter(path => changed.includes(path));
    return has(shared) ? [`#${pull.number} already changes ${shared.join(', ')}. That work goes to #${pull.number}’s owner.`] : [];
  });
  const unread = reads.map(read => read.unread).find(reason => has(reason));
  return has(unread) ? {refused, unread} : {refused};
};

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
 * @return {Verdict}
 */
const verdictOn = (branch, pushed, run) => {
  /** @type {Pull[]} */
  const pulls = JSON.parse(run('gh', 'pr', 'list', '--state', 'open', '--limit', '1000', '--json', 'number,headRefName'));
  const own = pulls.find(({headRefName}) => headRefName === branch);
  const running = has(own) ? runRefusals(own, checksOf(branch, run)) : [];
  if (has(running)) return {refused: running};
  if (branch.startsWith('verify/main-')) return {refused: []};
  run('git', 'fetch', '--quiet', 'origin', 'main');
  const held = has(own) ? filesOf(own, run) : [];
  const changed = linesOf(run('git', '-c', 'core.quotePath=false', 'diff', '--name-only', '--no-renames', `origin/main...${pushed}`))
    .filter(path => not(held.includes(path)));
  return sharingRefusals(changed, pulls.filter(pull => pull !== own), run);
};

/**
 * @param {string} branch
 * @param {string} pushed
 * @param {Run} run
 * @return {Verdict}
 */
export const clearToPush = (branch, pushed, run = outputOf) => {
  try {
    return verdictOn(branch, pushed, run);
  } catch (error) {
    return {refused: [], unread: reasonOf(error)};
  }
};

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const [, , pushedTo, pushed = 'HEAD'] = process.argv;
  const {refused, unread} = clearToPush(has(pushedTo) ? pushedTo : outputOf('git', 'branch', '--show-current'), pushed);
  if (has(unread)) console.error(`pre-push: the open pull requests couldn't be checked (${unread}).`);
  refused.forEach(reason => console.error(`pre-push: ${reason}`));
  process.exitCode = has(refused) ? 1 : 0;
}
