import {readFileSync} from 'node:fs';
import {empty, has, maybe, not} from '@ryandur/sand';

const severities = ['violation', 'concern', 'note'];

const fields = ['file', 'line', 'severity', 'rubric', 'summary', 'failure_scenario'];

const whole = finding => {
  const missing = fields.find(field => empty(finding[field]));
  if (has(missing)) {
    throw new Error(`the review answered with a finding that has no ${missing}`);
  }
  if (not(severities.includes(finding.severity))) {
    throw new Error(`the review answered with a severity of "${finding.severity}"`);
  }
  return finding;
};

/**
 * Reads the findings from the review's structured output: the action's `structured_output`, or the result message
 * that `claude --print --output-format json` writes, which carries it as `structured_output`.
 * @param {string} answer
 */
export const findingsIn = answer => {
  const output = empty(answer.trim()) ? {} : JSON.parse(answer);
  const {findings} = maybe(output.structured_output).orElse(output);
  if (not(Array.isArray(findings))) {
    throw new Error('the review answered without a findings list');
  }
  return findings.map(whole);
};

const bySeverity = (a, b) => severities.indexOf(a.severity) - severities.indexOf(b.severity);

const plural = (count, word) => `${count} ${count === 1 ? word : `${word}s`}`;

const asText = part => part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const told = prose => prose.split(/(`[^`]*`)/).map((part, index) => index % 2 === 1 ? part : asText(part)).join('');

const placeOf = ({file, line}, commit) => maybe(commit)
  .map(({repository, sha}) => `[\`${file}:${line}\`](https://github.com/${repository}/blob/${sha}/${file}#L${line})`)
  .orElse(`\`${file}:${line}\``);

const named = severity => `${severity[0].toUpperCase()}${severity.slice(1)}`;

const verdictTold = findings => {
  const stops = findings.filter(({severity}) => severity === 'violation');
  if (has(stops)) {
    return `has ${plural(stops.length, 'violation')} to fix before it ships`;
  }
  return empty(findings)
    ? 'is fine to ship, with nothing to change'
    : `is fine to ship, with ${plural(findings.length, 'thing')} to look at`;
};

const findingTold = (finding, at, commit) => [
  `#### ${at + 1}. ${named(finding.severity)} · ${asText(finding.rubric)}`,
  '',
  `**Where.** ${placeOf(finding, commit)}`,
  '',
  `**What.** ${told(finding.summary)}`,
  '',
  `**How it fails.** ${told(finding.failure_scenario)}`,
  ''
];

/**
 * @param {{file: string, line: number, severity: string, rubric: string, summary: string,
 *   failure_scenario: string}[]} findings
 */
export const summaryOf = (findings, {commit, subject} = {}) => [
  `## ${empty(subject) ? 'This push' : `“${told(subject)}”`} ${verdictTold(findings)}`,
  '',
  ...[...findings].sort(bySeverity).flatMap((finding, at) => findingTold(finding, at, commit))
].join('\n').trimEnd();

/** @param {{severity: string}[]} findings */
export const verdictOf = findings => findings.some(({severity}) => severity === 'violation') ? 1 : 0;

if (import.meta.filename === process.argv[1]) {
  const findings = findingsIn(readFileSync(process.stdin.fd, 'utf8'));
  const {GITHUB_REPOSITORY: repository, REVIEW_AFTER: sha, REVIEW_SUBJECT: subject} = process.env;
  const commit = has(repository) && has(sha) ? {repository, sha} : undefined;
  const summary = summaryOf(findings, {commit, subject});
  process.stdout.write(summary);
  process.exitCode = verdictOf(findings);
}
