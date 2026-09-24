import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {empty, has, maybe, not} from '@ryandur/sand';

const schema = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'feedback.schema.json'), 'utf8'));
const casesOf = kind => schema.$defs[kind]['enum'];
const doors = casesOf('door');
const severities = casesOf('severity');
const marks = {violation: '✖', concern: '▲', note: '○'};

export const reviewIn = answer => {
  const {structured_output: structured} = JSON.parse(answer);
  const summary = structured?.tldr;
  if (not(Array.isArray(summary?.ranked)) || not(typeof summary?.held === 'string') || not(Array.isArray(structured?.plusses)) || not(Array.isArray(structured?.deltas))) {
    throw new Error('the review answered without a summary, plusses and deltas; the structured output is missing');
  }
  return {tldr: summary, plusses: structured.plusses, deltas: structured.deltas};
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

export const plusOf = (plus, commit) => folded(`+ ${lineOf(plus)}`, [
  `**Where:** ${placeOf(plus, commit)}`,
  '',
  `**What happened:** ${told(plus.happened)}`,
  '',
  `**Why it works:** ${told(plus.why)}`,
  '',
  ...checkedFold(plus),
  `> ${told(plus.principle)}`
]);

export const deltaOf = (delta, commit) => folded(`${marks[delta.severity]} ${delta.severity} · ${lineOf(delta)}`, [
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

const byDoor = (entries, tell) => doors
  .map(door => ({door, own: entries.filter(entry => entry.door === door)}))
  .filter(({own}) => own.length > 0)
  .map(({door, own}) => [`#### ${door}`, ...own.map(tell)].join('\n\n'))
  .join('\n\n');

const plussesTold = (plusses, commit) =>
  plusses.length === 0 ? [] : ['### Plusses', '', byDoor(plusses, plus => plusOf(plus, commit)), ''];

const deltasTold = (deltas, commit) =>
  ['### Deltas', '', byDoor([...deltas].sort(bySeverity), delta => deltaOf(delta, commit)), ''];

const sentence = prose => prose.charAt(0).toUpperCase() + prose.slice(1);

const rankedTold = (ranked, commit) =>
  ranked.map((entry, at) => `${at + 1}. ${placeOf(entry, commit)}. ${told(sentence(entry.cost))} ${told(entry.change)}`);

const summaryTold = ({ranked, held, deferred}, commit) => [
  ...(ranked.length === 0 ? [] : [rankedTold(ranked, commit).join('\n'), '']),
  `**Held:** ${told(held)}`,
  '',
  ...(empty(deferred) ? [] : [`**Deferred:** ${told(deferred)}`, ''])
];

export const summaryOf = ({tldr, plusses, deltas}, {commit} = {}) => {
  if (deltas.length === 0) {
    return ['## The code holds up the home page', '', ...summaryTold(tldr, commit), `${plural(plusses.length, 'plus', 'plusses')}, no deltas.`, '', ...plussesTold(plusses, commit)].join('\n');
  }
  const counts = severities
    .map(severity => ({severity, count: deltas.filter(delta => delta.severity === severity).length}))
    .filter(({count}) => count > 0)
    .map(({severity, count}) => plural(count, severity));
  return [
    '## The home page reviews the code',
    '',
    ...summaryTold(tldr, commit),
    `${plural(plusses.length, 'plus', 'plusses')}. ${counts.join(', ')}.`,
    '',
    ...plussesTold(plusses, commit),
    ...deltasTold(deltas, commit)
  ].join('\n');
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
