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

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

const plusses = (count) => `${count} ${count === 1 ? 'plus' : 'plusses'}`;

const placeOf = ({file, line}, commit) =>
  commit === undefined
    ? `\`${file}:${line}\``
    : `[${file}:${line}](https://github.com/${commit.repository}/blob/${commit.sha}/${file}#L${line})`;

const checkedFold = ({checked}) =>
  checked === undefined || checked === '' ? [] : ['<details><summary>what was checked</summary>', '', checked, '', '</details>', ''];

export const plusOf = (plus, commit) => [
  `##### + ${plus.door} · ${placeOf(plus, commit)}`,
  '',
  `**What happened:** ${plus.happened}`,
  '',
  `**Why it works:** ${plus.reasoning}`,
  '',
  ...checkedFold(plus),
  `> ${plus.principle}`
].join('\n');

export const entryOf = (delta, commit) => [
  `##### ${marks[delta.severity]} ${delta.severity} · ${placeOf(delta, commit)}`,
  '',
  `**What happened:** ${delta.happened}`,
  '',
  `**Why it matters:** ${delta.reasoning}`,
  '',
  `**Change:** ${delta.change}`,
  '',
  ...checkedFold(delta),
  `> ${delta.principle}`
].join('\n');

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
  plusses.length === 0 ? [] : ['### Plusses', '', plusses.map(plus => plusOf(plus, commit)).join('\n\n'), ''];

const deltasTold = (deltas, commit) => doors
  .map(door => ({door, found: deltas.filter(delta => delta.door === door).sort(bySeverity)}))
  .filter(({found}) => found.length > 0)
  .map(({door, found}) => [`#### ${door}`, ...found.map(delta => entryOf(delta, commit))].join('\n\n'));

export const summaryOf = (review, {commit} = {}) => {
  const {deltas} = review;
  if (deltas.length === 0) {
    return ['## The code holds up the home page', '', `${plusses(review.plusses.length)}, no deltas.`, '', ...plussesTold(review.plusses, commit)].join('\n');
  }
  const counts = severities
    .map(severity => ({severity, count: deltas.filter(delta => delta.severity === severity).length}))
    .filter(({count}) => count > 0)
    .map(({severity, count}) => plural(count, severity));
  return [
    '## The home page reviews the code',
    '',
    `${plusses(review.plusses.length)}. ${counts.join(', ')}.`,
    '',
    doorTable(review),
    '',
    ...plussesTold(review.plusses, commit),
    '### Deltas',
    '',
    deltasTold(deltas, commit).join('\n\n'),
    ''
  ].join('\n');
};

export const verdictOf = (deltas) => deltas.some(({severity}) => severity === 'violation') ? 1 : 0;

if (import.meta.url === `file://${process.argv[1]}`) {
  const review = reviewIn(readFileSync(process.stdin.fd, 'utf8'));
  const {GITHUB_REPOSITORY: repository, GITHUB_SHA: sha} = process.env;
  const commit = repository !== undefined && sha !== undefined ? {repository, sha} : undefined;
  const summary = summaryOf(review, {commit});
  process.stdout.write(summary);
  if (review.plusses.length + review.deltas.length > 0) {
    writeFileSync('review-comment.md', summary);
  }
  process.exitCode = verdictOf(review.deltas);
}
