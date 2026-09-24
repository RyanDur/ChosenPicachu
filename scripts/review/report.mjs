import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {empty, has, maybe, not} from '@ryandur/sand';

const schema = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'feedback.schema.json'), 'utf8'));
const casesOf = kind => schema.$defs[kind]['enum'];
const severities = casesOf('severity');
const marks = {violation: '✖', concern: '▲', note: '○'};

export const reviewIn = answer => {
  const {structured_output: structured} = JSON.parse(answer);
  if (not(Array.isArray(structured?.habits)) || not(Array.isArray(structured?.plusses)) || not(Array.isArray(structured?.deltas))) {
    throw new Error('the review answered without habits, plusses and deltas; the structured output is missing');
  }
  const {habits, plusses, deltas, deferred} = structured;
  return {habits, plusses, deltas, ...(has(deferred) ? {deferred} : {})};
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

export const plusOf = (plus, commit) => folded(`+ ${plus.door} · ${lineOf(plus)}`, [
  `**Where:** ${placeOf(plus, commit)}`,
  '',
  `**What happened:** ${told(plus.happened)}`,
  '',
  `**Why it works:** ${told(plus.why)}`,
  '',
  ...checkedFold(plus),
  `> ${told(plus.principle)}`
]);

export const deltaOf = (delta, commit) => folded(`${marks[delta.severity]} ${delta.severity} · ${delta.door} · ${lineOf(delta)}`, [
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

const placesTold = (deltas, commit) =>
  [...deltas].sort(bySeverity).map(delta => `- ${marks[delta.severity]} ${placeOf(delta, commit)}. ${told(delta.happened)}`);

const keepsTold = (plusses, commit) =>
  plusses.map(plus => `- + ${placeOf(plus, commit)}. ${told(plus.happened)}`);

const entriesTold = (deltas, plusses, commit) => [
  ...[...deltas].sort(bySeverity).map(delta => deltaOf(delta, commit)),
  ...plusses.map(plus => plusOf(plus, commit))
].flatMap(entry => [entry, '']);

const gathered = (habit, {plusses, deltas}) => ({
  ...habit,
  deltas: deltas.filter(delta => delta.habit === habit.title),
  plusses: plusses.filter(plus => plus.habit === habit.title)
});

const habitTold = (habit, at, commit) => [
  `### ${at + 1}. ${told(habit.title)}`,
  '',
  told(habit.rule),
  '',
  ...(empty(habit.meet) ? [] : [`**What a person meets.** ${told(habit.meet)}`, '']),
  ...(habit.deltas.length === 0 ? [] : ['**Where.**', '', ...placesTold(habit.deltas, commit), '']),
  `**The fix, once.** ${told(habit.fix)}`,
  '',
  ...(habit.plusses.length === 0 ? [] : ['**Keep doing.**', '', ...keepsTold(habit.plusses, commit), '']),
  ...entriesTold(habit.deltas, habit.plusses, commit)
];

const strays = ({habits, plusses, deltas}) => {
  const titles = new Set(habits.map(({title}) => title));
  return {
    deltas: deltas.filter(({habit}) => not(titles.has(habit))),
    plusses: plusses.filter(({habit}) => not(titles.has(habit)))
  };
};

const straysTold = ({deltas, plusses}, commit) =>
  deltas.length + plusses.length === 0 ? [] : [
    '### One more thing',
    '',
    ...(deltas.length === 0 ? [] : ['**Where.**', '', ...placesTold(deltas, commit), '']),
    ...(plusses.length === 0 ? [] : ['**Keep doing.**', '', ...keepsTold(plusses, commit), '']),
    ...entriesTold(deltas, plusses, commit)
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

export const summaryOf = (review, {commit} = {}) => {
  const {habits, deltas, deferred} = review;
  return [
    deltas.length === 0 ? '## The code holds up the home page' : '## The home page reviews the code',
    '',
    `${countsOf(review)} ${plural(habits.length, 'habit')}.`,
    '',
    ...(habits.length === 0 ? [] : [...listed(habits, review), '']),
    ...(empty(deferred) ? [] : [`**Deferred:** ${told(deferred)}`, '']),
    ...habits.flatMap((habit, at) => [...habitTold(gathered(habit, review), at, commit), '']),
    ...straysTold(strays(review), commit)
  ].join('\n').trimEnd();
};

export const leavesFeedback = ({plusses, deltas}) => plusses.length + deltas.length > 0;

/** @param {{severity: string}[]} deltas */
export const verdictOf = deltas => deltas.some(({severity}) => severity === 'violation') ? 1 : 0;

if (import.meta.url === `file://${process.argv[1]}`) {
  const review = reviewIn(readFileSync(process.stdin.fd, 'utf8'));
  const {GITHUB_REPOSITORY: repository, GITHUB_SHA: sha} = process.env;
  const commit = has(repository) && has(sha) ? {repository, sha} : undefined;
  const summary = summaryOf(review, {commit});
  process.stdout.write(summary);
  if (leavesFeedback(review)) {
    writeFileSync('review-comment.md', summary);
  }
  process.exitCode = verdictOf(review.deltas);
}
