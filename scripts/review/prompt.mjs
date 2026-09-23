import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {not} from '@ryandur/sand';
import {design, doors, halves, qaNames, tests} from './agents.mjs';

const values = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'values.md'), 'utf8');

const rubric = [...doors.map(({file}) => file), 'src/pages/Home/TeeUp.tsx', design.file, tests.file];

const scopes = {
  full: {
    describe: () => 'The scope is the whole of src/ and e2e/: every page, component, sheet and spec.',
    asks: qaNames
  },
  changes: {
    describe: ({before, after}) =>
      `The scope is what this push changed: \`git diff ${before} ${after}\` is the change, each touched file is read whole, and any other file the change leans on may be read for context. \`git log ${before}..${after}\` says what each commit answers: a commit may quote an earlier finding and say how the change answers it.`,
    asks: qaNames
  },
  tests: {
    describe: () => 'The scope is every test in the app: the whole tests half, read whole, with the code under test read for context.',
    asks: [`${tests.name}-qa`]
  },
  design: {
    describe: () => 'The scope is the whole site half, read whole: every page, component, sheet and script that ships, with the tests read only for context.',
    asks: [`${design.name}-qa`]
  }
};

const count = ['one', 'two', 'three', 'four', 'five'];

const listed = names => `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

const dispatch = asks => asks.length === 1
  ? `Only ${asks[0]} has a half in this scope. Send it the scope, word for word, and ask for its door's plusses and deltas; the other QAs have nothing to review here.`
  : `${count[asks.length - 1]} QAs hold one door each: ${asks.join(', ')}. Send all ${count[asks.length - 1]} the scope, word for word, at the same time, and ask each for its door's plusses and deltas.`;

export const promptFor = ({scope, before, after}) => {
  const chosen = scopes[scope];
  if (not(Object.hasOwn(scopes, scope))) {
    throw new Error(`no review scope named "${scope}"; the scopes are ${listed(Object.keys(scopes))}`);
  }
  return [
    values,
    '## Your part',
    `You lead the review. Read the rubric first and whole, in the author's words: ${rubric.join(', ')}. Each door of the home page says what things are, how they show, or how they respond, then how the author organizes it, and ends with the test of the organization. The design door says how the code is shaped so that change stays cheap. The tests door says what a test is for.`,
    chosen.describe({before, after}),
    `The scope has two halves. ${halves.tests} ${halves.site} The three door QAs and the design QA review the site and the tests QA reviews the tests; each may read the other half for context. The site's QAs report nothing on the tests; the tests QA reports on the site only that a test is missing.`,
    dispatch(chosen.asks),
    'When they answer, corroborate every plus and every delta yourself before you keep it: open the file at the line, read the principle on its door, and keep it only if it holds. Merge what two QAs saw as one. Drop what does not hold and say nothing of it.',
    'Answer in the feedback stance, in the shape you were given. Open with a summary of the feedback, the tldr: a few sentences a person reads before opening any entry, giving your opinion of the feedback from what matters most to what matters least, and why, then what held. Then the plusses and the deltas that held, each saying what happened, why, and for a delta the change.'
  ].join('\n\n');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(promptFor({
    scope: process.env.REVIEW_SCOPE ?? 'changes',
    before: process.env.REVIEW_BEFORE,
    after: process.env.REVIEW_AFTER
  }));
}
