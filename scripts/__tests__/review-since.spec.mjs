import {reviewedBefore} from '../review/since.mjs';

const run = (id, head_sha) => ({id, head_sha});

const jobsBy = verdicts => runId => Promise.resolve(verdicts[runId] ?? []);

describe('where the review starts', () => {
  test('starts from the newest run whose review reached a verdict, red or green', async () => {
    const runs = [run(3, 'c3'), run(2, 'c2'), run(1, 'c1')];
    const jobs = jobsBy({2: [{name: 'review', conclusion: 'failure'}], 1: [{name: 'review', conclusion: 'success'}]});

    expect(await reviewedBefore(runs, jobs, 3)).toBe('c2');
  });

  test('skips a run whose review was cancelled before it answered', async () => {
    const runs = [run(3, 'c3'), run(2, 'c2'), run(1, 'c1')];
    const jobs = jobsBy({2: [{name: 'review', conclusion: 'cancelled'}], 1: [{name: 'review', conclusion: 'success'}]});

    expect(await reviewedBefore(runs, jobs, 3)).toBe('c1');
  });

  test('never starts from the run that is asking', async () => {
    const runs = [run(3, 'c3'), run(2, 'c2')];
    const jobs = jobsBy({3: [{name: 'review', conclusion: 'success'}], 2: [{name: 'review', conclusion: 'success'}]});

    expect(await reviewedBefore(runs, jobs, 3)).toBe('c2');
  });

  test('has nowhere to start when no review ever answered', async () => {
    const runs = [run(2, 'c2'), run(1, 'c1')];

    expect(await reviewedBefore(runs, jobsBy({1: [{name: 'build_test', conclusion: 'success'}]}), 2)).toBeUndefined();
  });
});
