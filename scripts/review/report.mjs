import {readFileSync, writeFileSync} from 'node:fs';

const doors = ['structure', 'presentation', 'dynamic interaction', 'tests'];
const severities = ['violation', 'concern', 'note'];

export const findingsIn = (answer) => {
    const {structured_output: structured} = JSON.parse(answer);
    if (structured === undefined || !Array.isArray(structured.findings)) {
        throw new Error('the review answered without findings; the structured output is missing');
    }
    return structured.findings;
};

const bySeverity = (a, b) => severities.indexOf(a.severity) - severities.indexOf(b.severity);

const line = ({severity, file, line: at, what, principle}) =>
    `- **${severity}** \`${file}:${at}\` ${what}\n  _${principle}_`;

export const summaryOf = (findings) => {
    if (findings.length === 0) {
        return '## The code holds up the home page\n\nNo findings.\n';
    }
    const doorSections = doors
        .map(door => ({door, found: findings.filter(finding => finding.door === door).sort(bySeverity)}))
        .filter(({found}) => found.length > 0)
        .map(({door, found}) => `### ${door}\n\n${found.map(line).join('\n')}`);
    const counts = severities
        .map(severity => ({severity, count: findings.filter(finding => finding.severity === severity).length}))
        .filter(({count}) => count > 0)
        .map(({severity, count}) => `${count} ${severity}${count === 1 ? '' : 's'}`);
    return `## The home page reviews the code\n\n${counts.join(', ')}.\n\n${doorSections.join('\n\n')}\n`;
};

export const verdictOf = (findings) => findings.some(({severity}) => severity === 'violation') ? 1 : 0;

if (import.meta.url === `file://${process.argv[1]}`) {
    const findings = findingsIn(readFileSync(process.stdin.fd, 'utf8'));
    const summary = summaryOf(findings);
    process.stdout.write(summary);
    if (findings.length > 0) {
        writeFileSync('review-comment.md', summary);
    }
    process.exitCode = verdictOf(findings);
}
