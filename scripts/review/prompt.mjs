import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {doors, halves, qaNames, tests} from './agents.mjs';

const values = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'values.md'), 'utf8');

const rubric = [...doors.map(({file}) => file), 'src/pages/Home/TeeUp.tsx', tests.file];

const scopes = {
  full: () => 'The scope is the whole of src/ and e2e/: every page, component, sheet and spec.',
  changes: ({before, after}) =>
    `The scope is what this push changed: \`git diff ${before} ${after}\` is the change, each touched file is read whole, and any other file the change leans on may be read for context. \`git log ${before}..${after}\` says what each commit answers: a commit may quote an earlier finding and say how the change answers it.`
};

export const promptFor = ({scope, before, after}) => {
  const describeScope = scopes[scope];
  if (describeScope === undefined) {
    throw new Error(`no review scope named "${scope}"; the scopes are ${Object.keys(scopes).join(' and ')}`);
  }
  return [
    values,
    '## Your part',
    `You lead the review. Read the rubric first and whole, in the author's words: ${rubric.join(', ')}. Each door of the home page says what things are, how they show, or how they respond, then how the author organizes it, and ends with the test of the organization. The tests door says what a test is for.`,
    describeScope({before, after}),
    `The scope has two halves. ${halves.tests} ${halves.site} The three door QAs review the site and the tests QA reviews the tests; each may read the other half for context. The door QAs report nothing on the tests; the tests QA reports on the site only that a test is missing.`,
    `Four QAs hold one door each: ${qaNames.join(', ')}. Send all four the scope, word for word, at the same time, and ask each for its door's findings.`,
    'When they answer, corroborate every finding yourself before you keep it: open the file at the line, read the principle on its door, and keep the finding only if it holds. Merge what two QAs saw as one. Drop what does not hold and say nothing of it.',
    'Answer with the findings that held, in the shape you were given.'
  ].join('\n\n');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(promptFor({
    scope: process.env.REVIEW_SCOPE ?? 'changes',
    before: process.env.REVIEW_BEFORE,
    after: process.env.REVIEW_AFTER
  }));
}
