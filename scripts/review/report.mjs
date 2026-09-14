import {readFileSync, writeFileSync} from 'node:fs';

const doors = ['structure', 'presentation', 'dynamic interaction', 'design', 'tests'];
const severities = ['violation', 'concern', 'note'];
const marks = {violation: '✖', concern: '▲', note: '○'};

export const reviewIn = (answer) => {
  const {structured_output: structured} = JSON.parse(answer);
  if (structured === undefined || !Array.isArray(structured.plusses) || !Array.isArray(structured.deltas)) {
    throw new Error('the review answered without plusses and deltas; the structured output is missing');
  }
  return {plusses: structured.plusses, deltas: structured.deltas};
};

const bySeverity = (a, b) => severities.indexOf(a.severity) - severities.indexOf(b.severity);

const plural = (count, word, words = `${word}s`) => `${count} ${count === 1 ? word : words}`;

const placeOf = ({file, line}, commit) =>
  commit === undefined
    ? `\`${file}:${line}\``
    : `[${file}:${line}](https://github.com/${commit.repository}/blob/${commit.sha}/${file}#L${line})`;

const checkedFold = ({checked}) =>
  checked === undefined || checked === '' ? [] : ['<details><summary>what was checked</summary>', '', checked, '', '</details>', ''];

export const plusOf = (plus, commit) => [
  `##### + ${placeOf(plus, commit)}`,
  '',
  `**What happened:** ${plus.happened}`,
  '',
  `**Why it works:** ${plus.why}`,
  '',
  ...checkedFold(plus),
  `> ${plus.principle}`
].join('\n');

export const deltaOf = (delta, commit) => [
  `##### ${marks[delta.severity]} ${delta.severity} · ${placeOf(delta, commit)}`,
  '',
  `**What happened:** ${delta.happened}`,
  '',
  `**Why it matters:** ${delta.why}`,
  '',
  `**Change:** ${delta.change}`,
  '',
  ...checkedFold(delta),
  `> ${delta.principle}`
].join('\n');

const byDoor = (entries, told) => doors
  .map(door => ({door, own: entries.filter(entry => entry.door === door)}))
  .filter(({own}) => own.length > 0)
  .map(({door, own}) => [`#### ${door}`, ...own.map(told)].join('\n\n'))
  .join('\n\n');

export const doorTable = ({plusses, deltas}) => {
  const rows = doors
    .filter(door => [...plusses, ...deltas].some(entry => entry.door === door))
    .map(door => {
      const own = deltas.filter(delta => delta.door === door);
      const counts = severities.map(severity => own.filter(delta => delta.severity === severity).length);
      return `| ${door} | ${plusses.filter(plus => plus.door === door).length} | ${counts.join(' | ')} |`;
    });
  return ['| door | plusses | violations | concerns | notes |', '| --- | ---: | ---: | ---: | ---: |', ...rows].join('\n');
};

const plussesTold = (plusses, commit) =>
  plusses.length === 0 ? [] : ['### Plusses', '', byDoor(plusses, plus => plusOf(plus, commit)), ''];

const deltasTold = (deltas, commit) =>
  ['### Deltas', '', byDoor([...deltas].sort(bySeverity), delta => deltaOf(delta, commit)), ''];

export const summaryOf = ({plusses, deltas}, {commit} = {}) => {
  if (deltas.length === 0) {
    return ['## The code holds up the home page', '', `${plural(plusses.length, 'plus', 'plusses')}, no deltas.`, '', ...plussesTold(plusses, commit)].join('\n');
  }
  const counts = severities
    .map(severity => ({severity, count: deltas.filter(delta => delta.severity === severity).length}))
    .filter(({count}) => count > 0)
    .map(({severity, count}) => plural(count, severity));
  return [
    '## The home page reviews the code',
    '',
    `${plural(plusses.length, 'plus', 'plusses')}. ${counts.join(', ')}.`,
    '',
    doorTable({plusses, deltas}),
    '',
    ...plussesTold(plusses, commit),
    ...deltasTold(deltas, commit)
  ].join('\n');
};

export const leavesFeedback = ({plusses, deltas}) => plusses.length + deltas.length > 0;

export const verdictOf = (deltas) => deltas.some(({severity}) => severity === 'violation') ? 1 : 0;

if (import.meta.url === `file://${process.argv[1]}`) {
  const review = reviewIn(readFileSync(process.stdin.fd, 'utf8'));
  const {GITHUB_REPOSITORY: repository, GITHUB_SHA: sha} = process.env;
  const commit = repository !== undefined && sha !== undefined ? {repository, sha} : undefined;
  const summary = summaryOf(review, {commit});
  process.stdout.write(summary);
  if (leavesFeedback(review)) {
    writeFileSync('review-comment.md', summary);
  }
  process.exitCode = verdictOf(review.deltas);
}
