import {readFileSync} from 'node:fs';
import {empty, has, maybe, not} from '@ryandur/sand';

const severities = ['violation', 'concern', 'note'];

const fenced = /```json\s*\n([\s\S]*?)\n```/;

const lastAnswer = parsed => Array.isArray(parsed)
  ? maybe(parsed.findLast(({type}) => type === 'result')).orElse({})
  : parsed;

export const findingsIn = answer => {
  const {result} = lastAnswer(JSON.parse(answer));
  const listed = maybe(fenced.exec(result ?? '')).map(([, json]) => JSON.parse(json)).orElse(undefined);
  if (not(Array.isArray(listed))) {
    throw new Error('the review answered without a findings list');
  }
  return listed.map(finding => ({...finding, severity: severities.includes(finding.severity) ? finding.severity : 'concern'}));
};

const opening = /^\*\*(\w+)\*\*(?:\s*\(([^)]*)\))?\s*/;

const findingOf = ({path, line, body}) => {
  const [first = '', named = '', rubric] = opening.exec(body) ?? [];
  return {
    file: path,
    line,
    severity: severities.includes(named) ? named : 'concern',
    rubric: rubric ?? 'correctness',
    summary: body.slice(first.length).trim()
  };
};

/**
 * The review leaves its findings on the pull request's lines, each opening with its severity in bold.
 * @param {string} comments the pull request's line comments, as GitHub lists them
 * @param {string} commit the head under review
 */
export const findingsOnThePull = (comments, commit) => JSON.parse(comments).flat()
  .filter(({commit_id: on}) => on === commit)
  .map(findingOf);

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
  `#### ${at + 1}. ${named(finding.severity)} · ${asText(finding.rubric ?? 'correctness')}`,
  '',
  `**Where.** ${placeOf(finding, commit)}`,
  '',
  `**What.** ${told(finding.summary ?? '')}`,
  '',
  `**How it fails.** ${told(finding.failure_scenario ?? '')}`,
  ''
];

/**
 * @param {{file: string, line: number, severity: string, rubric?: string, summary?: string,
 *   failure_scenario?: string}[]} findings
 */
export const summaryOf = (findings, {commit, subject} = {}) => [
  `## ${empty(subject) ? 'This push' : `“${told(subject)}”`} ${verdictTold(findings)}`,
  '',
  ...[...findings].sort(bySeverity).flatMap((finding, at) => findingTold(finding, at, commit))
].join('\n').trimEnd();

/** @param {{severity: string}[]} findings */
export const verdictOf = findings => findings.some(({severity}) => severity === 'violation') ? 1 : 0;

if (import.meta.url === `file://${process.argv[1]}`) {
  const {GITHUB_REPOSITORY: repository, GITHUB_SHA: sha, REVIEW_SUBJECT: subject, REVIEW_AFTER: head} = process.env;
  const read = readFileSync(process.stdin.fd, 'utf8');
  const findings = empty(head) ? findingsIn(read) : findingsOnThePull(read, head);
  const commit = has(repository) && has(sha) ? {repository, sha} : undefined;
  const summary = summaryOf(findings, {commit, subject});
  process.stdout.write(summary);
  process.exitCode = verdictOf(findings);
}
