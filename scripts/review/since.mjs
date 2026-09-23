import {empty, has} from '@ryandur/sand';

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

/**
 * Where the review starts: a commit asked for by hand, else the last answered review, else the push's own range.
 * @param {{asked?: string, reviewed?: string, pushed?: string}} known
 */
export const startFor = ({asked, reviewed, pushed}) =>
  [asked, reviewed, pushed].map(sha => (sha ?? '').trim()).find(sha => has(sha));

const github = (token, path) => fetch(`https://api.github.com/${path}`, {
  headers: {Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json'}
}).then(response => {
  if (!response.ok) throw new Error(`${response.status} from ${path}`);
  return response.json();
});

const lastAnswered = async ({token, repository, workflow, runId}) => {
  try {
    const {workflow_runs: runs} = await github(token, `repos/${repository}/actions/workflows/${workflow}/runs?branch=main&per_page=30`);
    const jobsOf = id => github(token, `repos/${repository}/actions/runs/${id}/jobs`).then(({jobs}) => jobs);
    return await reviewedBefore(runs, jobsOf, Number(runId));
  } catch (trouble) {
    process.stderr.write(`the last answered review could not be found: ${trouble instanceof Error ? trouble.message : String(trouble)}\n`);
    return undefined;
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const {GH_TOKEN, GITHUB_REPOSITORY, GITHUB_RUN_ID, REVIEW_WORKFLOW, REVIEW_ASKED_FROM, REVIEW_PUSHED_FROM} = process.env;
  const asked = (REVIEW_ASKED_FROM ?? '').trim();
  const reviewed = has(asked)
    ? undefined
    : await lastAnswered({token: GH_TOKEN, repository: GITHUB_REPOSITORY, workflow: REVIEW_WORKFLOW, runId: GITHUB_RUN_ID});
  const start = startFor({asked, reviewed, pushed: REVIEW_PUSHED_FROM});
  if (empty(start)) {
    process.stderr.write('nowhere to start the review from\n');
    process.exit(1);
  }
  process.stdout.write(start);
}
