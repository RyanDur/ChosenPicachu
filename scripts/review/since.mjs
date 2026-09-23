import {has, maybe} from '@ryandur/sand';

const answered = new Set(['success', 'failure']);

/**
 * The last commit the reviewer answered: the newest run, other than this one, whose review job ran to its
 * verdict. A run that was cancelled before the review, or that never reached it, left its changes unread, so
 * the next review starts from the one before it.
 * @param {{id: number, head_sha: string}[]} runs newest first
 * @param {(runId: number) => Promise<{name: string, conclusion: string | null}[]>} jobsOf
 * @param {number} thisRun
 */
export const reviewedBefore = async (runs, jobsOf, thisRun) => {
  for (const run of runs.filter(({id}) => id !== thisRun)) {
    const jobs = await jobsOf(run.id);
    if (jobs.some(({name, conclusion}) => name === 'review' && answered.has(conclusion ?? ''))) {
      return run.head_sha;
    }
  }
  return undefined;
};

const github = (token, path) => fetch(`https://api.github.com/${path}`, {
  headers: {Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json'}
}).then(response => {
  if (!response.ok) throw new Error(`${response.status} from ${path}`);
  return response.json();
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const {GH_TOKEN, GITHUB_REPOSITORY, GITHUB_RUN_ID, REVIEW_WORKFLOW, REVIEW_ASKED_FROM, REVIEW_PUSHED_FROM} = process.env;
  const asked = maybe(REVIEW_ASKED_FROM).map(from => from.trim()).orElse('');
  if (has(asked)) {
    process.stdout.write(asked);
  } else {
    const {workflow_runs: runs} = await github(GH_TOKEN, `repos/${GITHUB_REPOSITORY}/actions/workflows/${REVIEW_WORKFLOW}/runs?branch=main&per_page=30`);
    const jobsOf = runId => github(GH_TOKEN, `repos/${GITHUB_REPOSITORY}/actions/runs/${runId}/jobs`).then(({jobs}) => jobs);
    const since = await reviewedBefore(runs, jobsOf, Number(GITHUB_RUN_ID));
    process.stdout.write(since ?? REVIEW_PUSHED_FROM ?? '');
  }
}
