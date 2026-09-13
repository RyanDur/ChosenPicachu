import {readFileSync, writeFileSync} from 'node:fs';

const doors = ['structure', 'presentation', 'dynamic interaction', 'design', 'tests'];
const severities = ['violation', 'concern', 'note'];
const marks = {violation: '✖', concern: '▲', note: '○'};

export const findingsIn = (answer) => {
  const {structured_output: structured} = JSON.parse(answer);
  if (structured === undefined || !Array.isArray(structured.findings)) {
    throw new Error('the review answered without findings; the structured output is missing');
  }
  return structured.findings;
};

const bySeverity = (a, b) => severities.indexOf(a.severity) - severities.indexOf(b.severity);

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

const placeOf = ({file, line}, commit) =>
  commit === undefined
    ? `\`${file}:${line}\``
    : `[${file}:${line}](https://github.com/${commit.repository}/blob/${commit.sha}/${file}#L${line})`;

const told = (what) => {
  const [body, ...trail] = what.split(/(?=\bChecked\b)/);
  return {body: body.trim(), checked: trail.join('').trim()};
};

export const entryOf = (finding, commit) => {
  const {body, checked} = told(finding.what);
  const heading = `#### ${marks[finding.severity]} ${finding.severity} · ${placeOf(finding, commit)}`;
  const trail = checked === '' ? [] : ['<details><summary>what was checked</summary>', '', checked, '', '</details>'];
  return [heading, '', body, '', ...trail, ...(checked === '' ? [] : ['']), `> ${finding.principle}`].join('\n');
};

export const doorTable = (findings) => {
  const rows = doors
    .filter(door => findings.some(finding => finding.door === door))
    .map(door => {
      const own = findings.filter(finding => finding.door === door);
      const counts = severities.map(severity => own.filter(finding => finding.severity === severity).length);
      return `| ${door} | ${counts.join(' | ')} |`;
    });
  return ['| door | violations | concerns | notes |', '| --- | ---: | ---: | ---: |', ...rows].join('\n');
};

export const summaryOf = (findings, commit) => {
  if (findings.length === 0) {
    return '## The code holds up the home page\n\nNo findings.\n';
  }
  const counts = severities
    .map(severity => ({severity, count: findings.filter(finding => finding.severity === severity).length}))
    .filter(({count}) => count > 0)
    .map(({severity, count}) => plural(count, severity));
  const sections = doors
    .map(door => ({door, found: findings.filter(finding => finding.door === door).sort(bySeverity)}))
    .filter(({found}) => found.length > 0)
    .map(({door, found}) => [`### ${door}`, ...found.map(finding => entryOf(finding, commit))].join('\n\n'));
  return ['## The home page reviews the code', '', `${counts.join(', ')}.`, '', doorTable(findings), '', sections.join('\n\n'), ''].join('\n');
};

export const verdictOf = (findings) => findings.some(({severity}) => severity === 'violation') ? 1 : 0;

if (import.meta.url === `file://${process.argv[1]}`) {
  const findings = findingsIn(readFileSync(process.stdin.fd, 'utf8'));
  const {GITHUB_REPOSITORY: repository, GITHUB_SHA: sha} = process.env;
  const commit = repository !== undefined && sha !== undefined ? {repository, sha} : undefined;
  const summary = summaryOf(findings, commit);
  process.stdout.write(summary);
  if (findings.length > 0) {
    writeFileSync('review-comment.md', summary);
  }
  process.exitCode = verdictOf(findings);
}
