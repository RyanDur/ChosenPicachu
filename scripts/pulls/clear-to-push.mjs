import {has} from '@ryandur/sand';
import {execFileSync} from 'node:child_process';

/** @typedef {{name: string, bucket: string}} Check */
/** @typedef {{number: number, headRefName: string, files: {path: string}[]}} Pull */

/** @param {Check[]} checks */
const running = checks => checks.filter(({bucket}) => bucket === 'pending').map(({name}) => name);

/**
 * @param {Pull | undefined} own
 * @param {Check[]} checks
 * @return {string[]}
 */
const runRefusals = (own, checks) => {
  const names = running(checks);
  return has(own) && has(names)
    ? [`#${own.number} is still running ${names.join(', ')}. Push once the run is done, with every fix for it.`]
    : [];
};

/**
 * @param {string} branch
 * @param {string[]} changed
 * @param {Pull[]} others
 * @return {string[]}
 */
const sharingRefusals = (branch, changed, others) => branch.startsWith('verify/main-') ? [] : others.flatMap(other => {
  const shared = other.files.map(({path}) => path).filter(path => changed.includes(path));
  return has(shared)
    ? [`#${other.number} already changes ${shared.join(', ')}. That work goes to #${other.number}, or waits until it merges.`]
    : [];
});

/**
 * @param {{branch: string, changed: string[], pulls: Pull[], checks: Check[]}} push
 * @return {string[]}
 */
export const refusals = ({branch, changed, pulls, checks}) => {
  const own = pulls.find(({headRefName}) => headRefName === branch);
  const others = pulls.filter(({headRefName}) => headRefName !== branch);
  return [...runRefusals(own, checks), ...sharingRefusals(branch, changed, others)];
};

const said = (command, ...args) => execFileSync(command, args, {encoding: 'utf8', stdio: 'pipe'}).trim();

// gh pr checks exits non-zero while a check is pending or has failed, and still prints the checks; a branch with
// no pull request prints nothing.
const checksOf = branch => {
  try {
    return JSON.parse(said('gh', 'pr', 'checks', branch, '--json', 'name,bucket'));
  } catch ({stdout}) {
    return typeof stdout === 'string' && has(stdout.trim()) ? JSON.parse(stdout) : [];
  }
};

if (import.meta.main) {
  // the hook passes the branch being pushed to and the commit pushed, which a local branch's own name may not be
  const [, , pushedTo, pushed = 'HEAD'] = process.argv;
  const branch = pushedTo ?? said('git', 'branch', '--show-current');
  try {
    const pulls = JSON.parse(said('gh', 'pr', 'list', '--state', 'open', '--json', 'number,headRefName,files'));
    const changed = said('git', 'diff', '--name-only', `origin/main...${pushed}`).split('\n').filter(path => path !== '');
    const refused = refusals({branch, changed, pulls, checks: checksOf(branch)});
    refused.forEach(reason => console.error(`pre-push: ${reason}`));
    process.exitCode = refused.length > 0 ? 1 : 0;
  } catch (error) {
    console.error(`pre-push: the open pull requests couldn't be checked (${error.message.split('\n')[0]}).`);
  }
}
