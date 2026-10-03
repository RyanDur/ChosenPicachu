import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {empty, has, maybe, not} from '@ryandur/sand';

const schema = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'feedback.schema.json'), 'utf8'));
const casesOf = kind => schema.$defs[kind]['enum'];
const severities = casesOf('severity');

export const reviewIn = answer => {
  const {structured_output: structured} = JSON.parse(answer);
  const lists = [structured?.nextSteps, structured?.habits, structured?.plusses, structured?.deltas];
  if (typeof structured?.overview !== 'string' || lists.some(list => not(Array.isArray(list)))) {
    throw new Error('the review answered without an overview, next steps, habits, plusses and deltas; the structured output is missing');
  }
  const {overview, nextSteps, habits, plusses, deltas, deferred} = structured;
  return {overview, nextSteps, habits, plusses, deltas, ...(has(deferred) ? {deferred} : {})};
};

const bySeverity = (a, b) => severities.indexOf(a.severity) - severities.indexOf(b.severity);

const plural = (count, word, words = `${word}s`) => `${count} ${count === 1 ? word : words}`;

const asText = part => part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const told = prose => prose.split(/(`[^`]*`)/).map((part, index) => index % 2 === 1 ? part : asText(part)).join('');

const placeOf = ({file, line}, commit) => maybe(commit)
  .map(({repository, sha}) => `[\`${file}:${line}\`](https://github.com/${repository}/blob/${sha}/${file}#L${line})`)
  .orElse(`\`${file}:${line}\``);

const checkedFold = ({checked}) =>
  empty(checked) ? [] : ['<details><summary>what was checked</summary>', '', told(checked), '', '</details>', ''];

const lineOf = ({file, line, evidence}) => asText(`${file}:${line}${evidence === 'inferred' ? ' · inferred' : ''}`);

const folded = (label, body) => [`<details><summary>${label}</summary>`, '', ...body, '', '</details>'].join('\n');

export const plusOf = (plus, commit) => folded(`keep · ${plus.door} · ${lineOf(plus)}`, [
  `**Where:** ${placeOf(plus, commit)}`,
  '',
  `**What happened:** ${told(plus.happened)}`,
  '',
  `**Why it works:** ${told(plus.why)}`,
  '',
  ...checkedFold(plus),
  `> ${told(plus.principle)}`
]);

export const deltaOf = (delta, commit) => folded(`${delta.severity} · ${delta.door} · ${lineOf(delta)}`, [
  `**Where:** ${placeOf(delta, commit)}`,
  '',
  `**What happened:** ${told(delta.happened)}`,
  '',
  `**Why it matters:** ${told(delta.why)}`,
  '',
  `**Change:** ${told(delta.change)}`,
  '',
  ...checkedFold(delta),
  `> ${told(delta.principle)}`
]);

const named = severity => `${severity[0].toUpperCase()}${severity.slice(1)}`;

const places = (deltas, commit) => deltas.length === 0 ? [] : [
  '**Where.**',
  '',
  ...[...deltas].sort(bySeverity).map(delta => `- **${named(delta.severity)}.** ${placeOf(delta, commit)}. ${told(delta.happened)}`),
  ''
];

const entries = (deltas, commit) => [...deltas].sort(bySeverity).flatMap(delta => [deltaOf(delta, commit), '']);

const keepTold = (plusses, commit, lead = '**Keep doing.**') => plusses.length === 0 ? [] : [
  lead,
  '',
  ...plusses.map(plus => `- ${placeOf(plus, commit)}. ${told(plus.happened)}`),
  '',
  ...plusses.flatMap(plus => [plusOf(plus, commit), ''])
];

const gathered = (habit, {plusses, deltas}) => ({
  ...habit,
  deltas: deltas.filter(delta => delta.habit === habit.title),
  plusses: plusses.filter(plus => plus.habit === habit.title)
});

const habitTold = (habit, at, commit) => [
  `#### ${at + 1}. ${told(habit.title)}`,
  '',
  `**Problem.** ${told(habit.problem)}`,
  '',
  ...places(habit.deltas, commit),
  `**Why it matters.** ${told(habit.why)}`,
  '',
  `**Next step.** ${told(habit.fix)}`,
  '',
  `> ${told(habit.rule)}`,
  '',
  ...entries(habit.deltas, commit),
  ...keepTold(habit.plusses, commit)
];

const strays = ({habits, plusses, deltas}) => {
  const titles = new Set(habits.map(({title}) => title));
  return {
    deltas: deltas.filter(({habit}) => not(titles.has(habit))),
    plusses: plusses.filter(({habit}) => not(titles.has(habit)))
  };
};

export const unplaced = review => {
  const {deltas, plusses} = strays(review);
  return deltas.length + plusses.length;
};

const aloneTold = (delta, at, commit) => [
  `#### ${at + 1}. ${named(delta.severity)} at \`${asText(`${delta.file}:${delta.line}`)}\``,
  '',
  `**Problem.** ${told(delta.happened)}`,
  '',
  `**Where.** ${placeOf(delta, commit)}${delta.evidence === 'inferred' ? ' · inferred' : ''}`,
  '',
  `**Why it matters.** ${told(delta.why)}`,
  '',
  `**Next step.** ${told(delta.change)}`,
  '',
  `> ${told(delta.principle)}`,
  '',
  ...checkedFold(delta)
];

const straysTold = ({deltas, plusses}, after, commit) => [
  ...[...deltas].sort(bySeverity).flatMap((delta, at) => aloneTold(delta, after + at, commit)),
  ...keepTold(plusses, commit, '#### Keep doing')
];

const listed = (habits, review) => habits
  .map(habit => gathered(habit, review))
  .map(({title, deltas, plusses}, at) => `${at + 1}. **${told(title)}.** ${plural(deltas.length, 'place')}, ${plusses.length} to keep.`);

const countsOf = ({plusses, deltas}) => {
  const bySeverityCount = severities
    .map(severity => ({severity, count: deltas.filter(delta => delta.severity === severity).length}))
    .filter(({count}) => count > 0)
    .map(({severity, count}) => plural(count, severity));
  return `${plural(plusses.length, 'plus', 'plusses')}. ${deltas.length === 0 ? 'No deltas' : bySeverityCount.join(', ')}.`;
};

const verdictTold = deltas => {
  const stops = deltas.filter(({severity}) => severity === 'violation').length;
  if (stops > 0) {
    return `has ${plural(stops, 'violation')} to fix before it ships`;
  }
  return deltas.length === 0 ? 'is fine to ship, with nothing to change' : `is fine to ship, with ${plural(deltas.length, 'thing')} to look at`;
};

const stepsTold = steps => [
  '### Next steps',
  '',
  ...(steps.length === 0 ? ['Nothing to do.'] : steps.map((step, at) => `${at + 1}. ${told(step)}`)),
  ''
];

export const summaryOf = (review, {commit, subject} = {}) => {
  const {overview, nextSteps, habits, deltas, deferred} = review;
  return [
    `## ${empty(subject) ? 'This push' : `“${told(subject)}”`} ${verdictTold(deltas)}`,
    '',
    told(overview),
    '',
    ...stepsTold(nextSteps),
    '### What the review found',
    '',
    `${countsOf(review)}${habits.length === 0 ? '' : ` ${plural(habits.length, 'habit')}.`}`,
    '',
    ...(habits.length < 2 ? [] : [...listed(habits, review), '']),
    ...(empty(deferred) ? [] : [`**Deferred:** ${told(deferred)}`, '']),
    ...habits.flatMap((habit, at) => [...habitTold(gathered(habit, review), at, commit), '']),
    ...straysTold(strays(review), habits.length, commit)
  ].join('\n').trimEnd();
};

export const leavesFeedback = ({plusses, deltas}) => plusses.length + deltas.length > 0;

/** @param {{severity: string}[]} deltas */
export const verdictOf = deltas => deltas.some(({severity}) => severity === 'violation') ? 1 : 0;

if (import.meta.url === `file://${process.argv[1]}`) {
  const review = reviewIn(readFileSync(process.stdin.fd, 'utf8'));
  const {GITHUB_REPOSITORY: repository, GITHUB_SHA: sha, REVIEW_SUBJECT: subject} = process.env;
  const commit = has(repository) && has(sha) ? {repository, sha} : undefined;
  const summary = summaryOf(review, {commit, subject});
  process.stdout.write(summary);
  if (unplaced(review) > 0) {
    process.stderr.write(`${plural(unplaced(review), 'entry', 'entries')} named a habit the review did not list\n`);
  }
  if (leavesFeedback(review)) {
    writeFileSync('review-comment.md', summary);
  }
  process.exitCode = verdictOf(review.deltas);
}
