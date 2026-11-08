import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {empty, maybe, not} from '@ryandur/sand';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @param {string} markdown */
export const reviewersIn = markdown => {
  if (not(markdown.includes('\n## Reviewers'))) {
    throw new Error('AGENTS.md names no reviewers: it has no "## Reviewers" section');
  }
  return markdown.slice(markdown.indexOf('\n## Reviewers')).split('\n### ').slice(1).map(section => {
    const [heading, ...lines] = section.split('\n');
    const name = heading.trim();
    const field = key => maybe(lines.find(line => line.startsWith(`- ${key}: `))).either(
      line => line.slice(`- ${key}: `.length),
      () => {
        throw new Error(`the ${name} reviewer in AGENTS.md has no ${key} line`);
      });
    return {name, file: field('rubric').replaceAll('`', ''), asks: field('asks')};
  });
};

/** @param {{before: string, after: string, pull?: string, reviewers: {file: string, asks: string}[]}} range */
export const askFor = ({before, after, pull, reviewers}) => [
  `Review with the code-review skill: call the Skill tool with skill "code-review" and args "high ${empty(pull) ? `${before}..${after}` : `--comment ${pull}`} --max-findings all".`,
  'Hold the change to this project\'s own standards as well as to correctness. Read each of these whole before',
  'reviewing, and report a finding against one only where its rule holds:',
  'AGENTS.md (the house rules), scripts/review/values.md and scripts/review/plain.md (how a finding is worded),',
  `${reviewers.map(({file, asks}) => `${file} (${asks})`).join('; ')}.`,
  'Give every finding two more fields: "severity", one of "violation" (a bug a reader meets, or a broken rule from',
  'AGENTS.md or a rubric), "concern" or "note"; and "rubric", the file whose rule it answers to, or "correctness".',
  'Answer with every finding in the structured output, an empty list when there are none.',
  ...empty(pull) ? [] : [
    'Post an inline comment for a violation or a concern only. A note goes in the structured output and the summary,',
    'never on a line, because every conversation on a line holds the merge until it is resolved.'
  ],
  ...empty(pull) ? [] : [
    'earlier-findings.json holds the conversations earlier reviews of this pull request started, each with its',
    'replies and whether it is resolved. A finding one of them already raised gets no new inline comment. Judge it',
    'by the code at the head. Leave it out of the structured output when the code no longer has the problem, or when',
    'that code is unchanged and its conversation holds the reviewer\'s "Agreed." to an argument that the code is',
    'right as it stands, or a ruling by the repository\'s people, a reply that says "Resolved by ruling.", whatever',
    'follows either.',
    'Otherwise keep it in, resolved or not.'
  ]
].join(' ');

if (import.meta.main) {
  const {REVIEW_BEFORE: before, REVIEW_AFTER: after = 'HEAD', REVIEW_PULL: pull} = process.env;
  if (empty(before)) {
    throw new Error('REVIEW_BEFORE names no commit to review from');
  }
  const reviewers = reviewersIn(readFileSync(join(root, 'AGENTS.md'), 'utf8'));
  process.stdout.write(askFor({before, after, pull, reviewers}));
}
