import {mkdtempSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promptFor} from '../review/prompt.mjs';
import {deltaOf, leavesFeedback, plusOf, reviewIn, summaryOf, unplaced, verdictOf} from '../review/report.mjs';
import {aDelta, aHabit, aPlus, review} from '../review/__test_support/feedback.mjs';

const placeOf = (text, needle) => {
  expect(text).toContain(needle);
  return text.indexOf(needle);
};

const answer = review => JSON.stringify({type: 'result', structured_output: review});

const feedbackSchema = () => JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../review/feedback.schema.json'), 'utf8'));

const violation = aDelta({door: 'structure', severity: 'violation', file: 'src/a.tsx', line: 3, happened: 'a div wraps a list'});
const concern = aDelta({
  door: 'presentation',
  severity: 'concern',
  file: 'src/b.css',
  line: 9,
  happened: 'a tag selector styles a button',
  why: 'every button on the site now wears it',
  change: 'give the button a class that names it',
  principle: 'Tag selectors are for resets only'
});
const note = aDelta({
  door: 'structure',
  happened: 'a section has no heading',
  change: 'name the section with a heading',
  principle: 'Sections name themselves through their headings'
});
const testNote = aDelta({door: 'tests', file: 'src/__tests__/c.spec.tsx', line: 4});
const interaction = aDelta({door: 'dynamic interaction'});
const plus = aPlus({
  door: 'structure',
  file: 'src/f.tsx',
  line: 5,
  happened: 'the friends list is a fieldset with a legend',
  why: 'the group names itself and the platform hands the name to a reader',
  principle: 'The right tag hands most of that over for free'
});
const testPlus = aPlus({door: 'tests'});

describe('the review prompt', () => {
  test('a full review sends the reviewer to the doors on the home page and scopes them to the whole of src', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('src/pages/Home/Structure.tsx');
    expect(prompt).toContain('src/pages/Home/Presentation.tsx');
    expect(prompt).toContain('src/pages/Home/DynamicInteraction.tsx');
    expect(prompt).toContain('The scope is the whole of src/');
  });

  test('a review of the changes names the two commits to diff', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('git diff abc def');
    expect(prompt).toContain('git log abc..def');
  });

  test('an unknown scope is refused by name', () => {
    expect(() => promptFor({scope: 'some'})).toThrow('no review scope named "some"; the scopes are full, changes, tests and design');
  });

  test('a design review asks the design QA alone for the whole site', () => {
    const prompt = promptFor({scope: 'design'});
    expect(prompt).toContain('scripts/review/design.md');
    expect(prompt).toContain('The scope is the whole site half');
    expect(prompt).toContain('Only design-qa has a half in this scope');
  });

  test('a review of the tests asks the tests QA alone', () => {
    const prompt = promptFor({scope: 'tests'});
    expect(prompt).toContain('The scope is every test in the app');
    expect(prompt).toContain('Only tests-qa has a half in this scope');
    expect(prompt).not.toContain('structure-qa');
  });

  test('a review of the changes sends all six QAs', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('The QAs hold one door each: structure-qa, presentation-qa, dynamic-interaction-qa, design-qa, tests-qa and tutorials-qa.');
  });

  test('the review answers in the feedback stance: habits first, then plusses and deltas, each with what happened and why', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('You report by habit. A habit is one rule from a door that two or more findings answer to');
    expect(prompt).toContain('Habits a visitor meets come before habits only the next reader meets.');
    expect(prompt).toContain('Give every plus and every delta that held the title of its habit, or leave the title unmatched when it fits none.');
    expect(prompt).toContain('Say what you deferred in one line, only if something was.');
    expect(prompt).toContain('You take a feedback stance: plusses and deltas, each with its why.');
    expect(prompt).toContain('A **plus** is a choice in the code that holds a door up.');
    expect(prompt).toContain('A **delta** is a finding: something to change.');
    expect(prompt).toContain('Answer in the feedback stance');
  });

  test('the lead opens for the owner of the site: an overview that says whether to ship, then the next steps, then each habit as its problem, why it matters and the fix', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('The lead writes for the person who owns the site and did not write the push.');
    expect(prompt).toContain('The overview comes first. It says what the push did, what the review found, and whether the push is fine to ship');
    expect(prompt).toContain('Each is one thing to do, in the order to do it, naming the file and what changes there.');
    expect(prompt).toContain('Its why says what the problem costs that person, which the problem alone does not say.');
    expect(prompt).toContain('Open with the overview');
  });

  test('the lead reads the tutorials door with the others', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('scripts/review/tutorials.md');
    expect(prompt).toContain('The tutorials door says what a tutorial on the demos tab owes its reader.');
  });

  test('the review is asked to write plainly, naming things and never narrating itself', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('One idea per sentence, and a sentence stays under twenty words.');
    expect(prompt).toContain('Name things by their names: the token, the test, the file, the class.');
    expect(prompt).toContain('Nothing about how the review was made');
  });

  test('the review carries the numbered writing rules: no em dashes, no metaphor nouns, no personified code, whole sentences', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('## How you write');
    expect(prompt).toContain('13. **No em dashes.**');
    expect(prompt).toContain('26. **No metaphor nouns.**');
    expect(prompt).toContain('32. **No mannered prose.**');
    expect(prompt).toContain('33. **Whole sentences.**');
    expect(placeOf(prompt, '## How you write')).toBeLessThan(placeOf(prompt, '## Your part'));
  });

  test('a violation carries a trace to what a person would see, or it is a concern', () => {
    expect(promptFor({scope: 'full'})).toContain('a delta whose trace you cannot make is a **concern**');
  });

  test('a delta the author recorded as not taken is answered by name, not raised again', () => {
    expect(promptFor({scope: 'full'})).toContain('answer that reason by name: accept it, or rebut it');
  });

  test('every entry says whether it stands on what was read or on an inference, and code is never evidence of its own intent', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('Every entry says what it stands on.');
    expect(prompt).toContain('Code is evidence of what it does, never of why it exists.');
    expect(prompt).toContain('A violation stands on what you read.');
    expect(prompt).toContain('A reason a commit message gives is a claim to check, not a conclusion to confirm.');
  });

  test('the reviewer says when a claim needs a run, and names the test or script that would settle it', () => {
    expect(promptFor({scope: 'full'})).toContain('You read and never run, so a claim that only a run would settle says so, and the change names the test or the script that would settle it.');
  });
});

describe('the review report', () => {
  const heading = aHabit();
  const naming = aHabit({title: 'a landmark is named for what it holds', rule: 'The structure door: every landmark gets a name and no two names collide.', fix: 'Name it for what it holds.'});
  const named = traits => aDelta({habit: naming.title, ...traits});

  test('reads the overview, next steps, habits, plusses and deltas the reviewer structured', () => {
    const told = {...review([plus], [note], [heading]), overview: 'The push adds a list of friends.', nextSteps: ['Name the section in src/somewhere.tsx.']};
    expect(reviewIn(answer(told))).toEqual(told);
    const deferring = review([plus], [note], [heading], 'the accordions are the author\'s');
    expect(reviewIn(answer(deferring))).toEqual(deferring);
    expect(deferring.deferred).toBe('the accordions are the author\'s');
  });

  test('a review with neither plusses nor deltas is still read', () => {
    expect(reviewIn(answer(review([], [], [])))).toEqual(review([], [], []));
  });

  test('an answer without an overview or without next steps is refused', () => {
    const {overview: _overview, ...unopened} = review([], [], []);
    const {nextSteps: _nextSteps, ...unstepped} = review([], [], []);
    expect(() => reviewIn(answer(unopened))).toThrow('structured output is missing');
    expect(() => reviewIn(answer(unstepped))).toThrow('structured output is missing');
  });

  test('an answer without habits is refused', () => {
    expect(() => reviewIn(JSON.stringify({type: 'result', structured_output: {plusses: [], deltas: []}})))
      .toThrow('structured output is missing');
    expect(() => reviewIn(JSON.stringify({type: 'result', structured_output: {habits: 'prose', plusses: [], deltas: []}})))
      .toThrow('structured output is missing');
  });

  test('an answer without structured plusses and deltas is refused', () => {
    expect(() => reviewIn(JSON.stringify({type: 'result', result: 'prose'}))).toThrow('structured output is missing');
    expect(() => reviewIn(JSON.stringify({type: 'result', structured_output: {findings: []}}))).toThrow('structured output is missing');
  });

  test('the heading names the push and says whether it ships', () => {
    const headingOf = (deltas, subject) => summaryOf(review([], deltas, [heading]), {subject}).split('\n')[0];
    expect(headingOf([], 'Name the friends list')).toBe('## “Name the friends list” is fine to ship, with nothing to change');
    expect(headingOf([note, concern], 'Name the friends list')).toBe('## “Name the friends list” is fine to ship, with 2 things to look at');
    expect(headingOf([note], 'Name the friends list')).toBe('## “Name the friends list” is fine to ship, with 1 thing to look at');
    expect(headingOf([note, violation], 'Name the friends list')).toBe('## “Name the friends list” has 1 violation to fix before it ships');
    expect(headingOf([note])).toBe('## This push is fine to ship, with 1 thing to look at');
  });

  test('the summary opens on the overview, then the next steps in order, then what the review found', () => {
    const summary = summaryOf({
      ...review([plus], [violation, note], [heading]),
      overview: 'The push adds a list of friends. One list is wrapped in a div, so it does not ship yet.',
      nextSteps: ['In src/a.tsx, make the wrapper a list.', 'In src/somewhere.tsx, give the section a heading.']
    });
    const at = needle => placeOf(summary, needle);
    expect(at('## This push has 1 violation to fix before it ships')).toBeLessThan(at('The push adds a list of friends. One list is wrapped in a div, so it does not ship yet.'));
    expect(at('One list is wrapped in a div')).toBeLessThan(at('### Next steps'));
    expect(at('### Next steps')).toBeLessThan(at('1. In src/a.tsx, make the wrapper a list.'));
    expect(at('1. In src/a.tsx, make the wrapper a list.')).toBeLessThan(at('2. In src/somewhere.tsx, give the section a heading.'));
    expect(at('2. In src/somewhere.tsx,')).toBeLessThan(at('### What the review found'));
    expect(at('### What the review found')).toBeLessThan(at('1 plus. 1 violation, 1 note. 1 habit.'));
    expect(at('1 plus. 1 violation, 1 note. 1 habit.')).toBeLessThan(at('#### 1. a section is named by its heading'));
  });

  test('a review with no next steps says there is nothing to do', () => {
    expect(summaryOf(review([plus], [], [heading]))).toContain('### Next steps\n\nNothing to do.\n');
  });

  test('no deltas reads as fine to ship, with the plusses still told under their habit', () => {
    const summary = summaryOf(review([plus], [], [heading]));
    expect(summary).toContain('## This push is fine to ship, with nothing to change');
    expect(summary).toContain('1 plus. No deltas. 1 habit.');
    expect(summary).toContain('- `src/f.tsx:5`. the friends list is a fieldset with a legend');
  });

  test('a single habit is not listed above its own section', () => {
    expect(summaryOf(review([plus], [note], [heading]))).not.toContain('1. **a section is named by its heading.**');
  });

  test('two or more habits are listed in the order given, each with its places and what to keep', () => {
    const summary = summaryOf(review([plus], [violation, note, named({file: 'src/n.tsx', line: 2})], [naming, heading]));
    expect(placeOf(summary, '1. **a landmark is named for what it holds.** 1 place, 0 to keep.'))
      .toBeLessThan(placeOf(summary, '2. **a section is named by its heading.** 2 places, 1 to keep.'));
    expect(placeOf(summary, '2. **a section is named by its heading.**')).toBeLessThan(placeOf(summary, '#### 1. a landmark is named for what it holds'));
  });

  test('a habit tells its problem, where by severity in words, why it matters and the next step, then the door\'s rule, the entries, and what to keep', () => {
    const summary = summaryOf(review([plus], [note, violation], [heading]));
    const at = needle => placeOf(summary, needle);
    expect(at('#### 1. a section is named by its heading')).toBeLessThan(at('**Problem.** A reader who walks the page by headings never finds the section.'));
    expect(at('**Problem.**')).toBeLessThan(at('**Where.**'));
    expect(at('**Where.**')).toBeLessThan(at('- **Violation.** `src/a.tsx:3`. a div wraps a list'));
    expect(at('- **Violation.** `src/a.tsx:3`.')).toBeLessThan(at('- **Note.** `src/somewhere.tsx:1`. a section has no heading'));
    expect(at('- **Note.** `src/somewhere.tsx:1`.')).toBeLessThan(at('**Why it matters.** The section is skipped by anyone who does not read from the top.'));
    expect(at('**Why it matters.**')).toBeLessThan(at('**Next step.** Give each section a heading that names it.'));
    expect(at('**Next step.**')).toBeLessThan(at('> The structure door: sections name themselves through their headings.'));
    expect(at('> The structure door:')).toBeLessThan(at('<details><summary>violation · structure · src/a.tsx:3</summary>'));
    expect(at('<details><summary>violation')).toBeLessThan(at('<details><summary>note · structure · src/somewhere.tsx:1</summary>'));
    expect(at('<details><summary>note')).toBeLessThan(at('**Keep doing.**'));
    expect(at('**Keep doing.**')).toBeLessThan(at('- `src/f.tsx:5`. the friends list is a fieldset with a legend'));
    expect(at('- `src/f.tsx:5`.')).toBeLessThan(at('<details><summary>keep · structure · src/f.tsx:5</summary>'));
  });

  test('a severity is told in words, never by a mark', () => {
    const summary = summaryOf(review([plus], [note, concern, violation], [heading]));
    ['✖', '▲', '○'].forEach(mark => expect(summary).not.toContain(mark));
  });

  test('a habit with nothing to keep leaves that part out', () => {
    const summary = summaryOf(review([], [note], [heading]));
    expect(summary).not.toContain('**Keep doing.**');
    expect(summary).toContain('**Where.**');
    expect(summary).toContain('**Next step.**');
  });

  test('a habit with nothing to change and something to keep leaves the places out', () => {
    const summary = summaryOf(review([plus], [], [heading]));
    expect(summary).not.toContain('**Where.**');
    expect(summary).toContain('**Keep doing.**');
  });

  test('a finding that fits no habit is told on its own after the habits: its problem, where, why it matters and the next step, in the open', () => {
    const stray = aDelta({habit: 'nothing of the sort', severity: 'concern', file: 'src/s.tsx', line: 7, happened: 'a stray thing', why: 'it costs a reader', change: 'put it right', principle: 'the door says so', checked: 'read the file'});
    const summary = summaryOf(review([], [note, stray], [heading]));
    const at = needle => placeOf(summary, needle);
    expect(at('#### 1. a section is named by its heading')).toBeLessThan(at('#### 2. Concern at `src/s.tsx:7`'));
    expect(at('#### 2. Concern at `src/s.tsx:7`')).toBeLessThan(at('**Problem.** a stray thing'));
    expect(at('**Problem.** a stray thing')).toBeLessThan(at('**Where.** `src/s.tsx:7`'));
    expect(at('**Where.** `src/s.tsx:7`')).toBeLessThan(at('**Why it matters.** it costs a reader'));
    expect(at('**Why it matters.** it costs a reader')).toBeLessThan(at('**Next step.** put it right'));
    expect(at('**Next step.** put it right')).toBeLessThan(at('<details><summary>what was checked</summary>\n\nread the file'));
    expect(summary).not.toContain('<details><summary>concern · structure · src/s.tsx:7');
  });

  test('findings that fit no habit are told worst first, and say when they are inferred', () => {
    const alone = traits => aDelta({habit: 'nothing of the sort', ...traits});
    const summary = summaryOf(review([], [alone({file: 'src/n.tsx'}), alone({severity: 'violation', file: 'src/v.tsx', evidence: 'inferred'})], []), {commit: {repository: 'RyanDur/ChosenPicachu', sha: 'abc123'}});
    expect(placeOf(summary, '#### 1. Violation at `src/v.tsx:1`')).toBeLessThan(placeOf(summary, '#### 2. Note at `src/n.tsx:1`'));
    expect(summary).toContain('**Where.** [`src/v.tsx:1`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/v.tsx#L1) · inferred');
  });

  test('a plus that fits no habit stands under keep doing, after the findings', () => {
    const summary = summaryOf(review([aPlus({habit: 'nothing of the sort', file: 'src/k.tsx', line: 8, happened: 'a stray keep'})], [note], [heading]));
    expect(placeOf(summary, '#### 1. a section is named by its heading')).toBeLessThan(placeOf(summary, '#### Keep doing\n\n- `src/k.tsx:8`. a stray keep'));
    expect(summaryOf(review([], [note], [heading]))).not.toContain('#### Keep doing');
  });

  test('a review with no habits leaves them out of the count', () => {
    expect(summaryOf(review([], [aDelta({habit: 'nothing of the sort'})], []))).toContain('0 plusses. 1 note.\n');
  });

  test('the run says on stderr how many entries named a habit the review did not list', () => {
    const stray = aDelta({habit: 'nothing of the sort'});
    const script = join(dirname(fileURLToPath(import.meta.url)), '../review/report.mjs');
    const run = spawnSync(process.execPath, [script], {input: answer(review([], [note, stray], [heading])), cwd: mkdtempSync(join(tmpdir(), 'review-')), encoding: 'utf8'});

    expect(run.status).toBe(0);
    expect(run.stderr).toBe('1 entry named a habit the review did not list\n');
    expect(run.stdout).toContain('#### 2. Note at `src/somewhere.tsx:1`');
  });

  test('the run heads the summary with the subject it is given', () => {
    const script = join(dirname(fileURLToPath(import.meta.url)), '../review/report.mjs');
    const run = spawnSync(process.execPath, [script], {
      input: answer(review([], [note], [heading])),
      cwd: mkdtempSync(join(tmpdir(), 'review-')),
      env: {...process.env, REVIEW_SUBJECT: 'Name the friends list'},
      encoding: 'utf8'
    });

    expect(run.stdout.split('\n')[0]).toBe('## “Name the friends list” is fine to ship, with 1 thing to look at');
  });

  test('the entries whose habit matches none are counted, so the run can say so', () => {
    const stray = aDelta({habit: 'nothing of the sort'});
    expect(unplaced(review([aPlus({habit: 'nothing of the sort'})], [note, stray], [heading]))).toBe(2);
    expect(unplaced(review([plus], [note], [heading]))).toBe(0);
  });

  test('a deferred line follows the counts only when something was deferred', () => {
    const summary = summaryOf(review([], [note], [heading], 'The accordions are the author\'s.'));
    expect(placeOf(summary, '0 plusses. 1 note. 1 habit.')).toBeLessThan(placeOf(summary, '**Deferred:** The accordions are the author\'s.'));
    expect(placeOf(summary, '**Deferred:**')).toBeLessThan(placeOf(summary, '#### 1.'));
    expect(summaryOf(review([], [note], [heading]))).not.toContain('**Deferred:**');
  });

  test('a place under a habit links to the line at the reviewed commit when the commit is known', () => {
    const summary = summaryOf(review([plus], [violation], [heading]), {commit: {repository: 'RyanDur/ChosenPicachu', sha: 'abc123'}});
    expect(summary).toContain('- **Violation.** [`src/a.tsx:3`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/a.tsx#L3). a div wraps a list');
    expect(summary).toContain('- [`src/f.tsx:5`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/f.tsx#L5). the friends list is a fieldset with a legend');
  });

  test('the summary stays words on the page', () => {
    const summary = summaryOf({
      ...review([], [note], [aHabit({title: 'bold <b>words</b>', rule: 'a <i>rule</i>', fix: 'fix <u>it</u>', problem: 'meet <em>it</em>', why: 'costs <s>this</s>'})], 'defer <b>this</b>'),
      overview: 'an <h1>overview</h1>',
      nextSteps: ['a <a>step</a>']
    }, {subject: 'a <p>subject</p>'});
    ['bold &lt;b&gt;words&lt;/b&gt;', 'a &lt;i&gt;rule&lt;/i&gt;', 'fix &lt;u&gt;it&lt;/u&gt;', 'meet &lt;em&gt;it&lt;/em&gt;', 'costs &lt;s&gt;this&lt;/s&gt;', 'defer &lt;b&gt;this&lt;/b&gt;', 'an &lt;h1&gt;overview&lt;/h1&gt;', 'a &lt;a&gt;step&lt;/a&gt;', 'a &lt;p&gt;subject&lt;/p&gt;']
      .forEach(escaped => expect(summary).toContain(escaped));
  });

  test('plusses and deltas are counted, deltas by severity, and the habits counted after', () => {
    expect(summaryOf(review([plus, testPlus], [testNote, note, concern, violation, interaction], [heading, naming])))
      .toContain('2 plusses. 1 violation, 1 concern, 3 notes. 2 habits.');
  });

  test('a review with no plusses says so', () => {
    expect(summaryOf(review([], [note], [heading]))).toContain('0 plusses. 1 note. 1 habit.');
  });

  test('a delta folds away under its severity, door and place, and opens on where, what happened, why it matters, the change, and the door\'s words', () => {
    const entry = deltaOf(concern);
    expect(entry).toMatch(/^<details><summary>concern · presentation · src\/b\.css:9<\/summary>\n/);
    expect(entry).toMatch(/\n<\/details>$/);
    expect(placeOf(entry, '**Where:** `src/b.css:9`')).toBeLessThan(placeOf(entry, '**What happened:**'));
    expect(placeOf(entry, '**What happened:** a tag selector styles a button')).toBeLessThan(placeOf(entry, '**Why it matters:** every button on the site now wears it'));
    expect(placeOf(entry, '**Why it matters:**')).toBeLessThan(placeOf(entry, '**Change:** give the button a class that names it'));
    expect(entry).toContain('> Tag selectors are for resets only');
  });

  test('a plus folds away under keep, its door and place, and opens on where, what happened, why it works, and the door\'s words', () => {
    const entry = plusOf(plus);
    expect(entry).toMatch(/^<details><summary>keep · structure · src\/f\.tsx:5<\/summary>\n/);
    expect(entry).toMatch(/\n<\/details>$/);
    expect(placeOf(entry, '**Where:** `src/f.tsx:5`')).toBeLessThan(placeOf(entry, '**What happened:**'));
    expect(placeOf(entry, '**What happened:** the friends list is a fieldset with a legend')).toBeLessThan(placeOf(entry, '**Why it works:** the group names itself'));
    expect(entry).toContain('> The right tag hands most of that over for free');
  });

  test('the fold links to the line at the reviewed commit when the commit is known', () => {
    const commit = {repository: 'RyanDur/ChosenPicachu', sha: 'abc123'};
    expect(deltaOf(violation, commit)).toContain('**Where:** [`src/a.tsx:3`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/a.tsx#L3)');
    expect(plusOf(plus, commit)).toContain('**Where:** [`src/f.tsx:5`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/f.tsx#L5)');
    expect(deltaOf(testNote, commit)).toContain('**Where:** [`src/__tests__/c.spec.tsx:4`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/__tests__/c.spec.tsx#L4)');
  });

  test('what the reviewer checked folds away under the entry', () => {
    expect(deltaOf({
      ...note,
      checked: 'read the file whole'
    })).toContain('**Change:** name the section with a heading\n\n<details><summary>what was checked</summary>\n\nread the file whole\n\n</details>\n\n> Sections');
    expect(plusOf({
      ...plus,
      checked: 'read the legend'
    })).toContain('<details><summary>what was checked</summary>\n\nread the legend\n\n</details>');
    expect(deltaOf(note)).not.toContain('what was checked');
    expect(plusOf(plus)).not.toContain('what was checked');
  });

  test('a place with a tag in its name stays words in the fold', () => {
    expect(deltaOf({...note, file: 'src/<odd>.tsx'}).split('\n')[0]).toContain('src/&lt;odd&gt;.tsx:1');
  });

  test('a tag the reviewer writes in any field stays words on the page, and a code span keeps its angle brackets', () => {
    const tagged = field => `${field} says <b>${field}</b> & more`;
    const escaped = field => `${field} says &lt;b&gt;${field}&lt;/b&gt; &amp; more`;
    const plusEntry = plusOf({
      ...plus,
      happened: tagged('happened'),
      why: tagged('why'),
      checked: tagged('checked'),
      principle: tagged('principle')
    });
    ['happened', 'why', 'checked', 'principle'].forEach(field => expect(plusEntry).toContain(escaped(field)));
    const deltaEntry = deltaOf({
      ...note,
      happened: tagged('happened'),
      why: tagged('why'),
      change: tagged('change'),
      checked: tagged('checked'),
      principle: tagged('principle')
    });
    ['happened', 'why', 'change', 'checked', 'principle'].forEach(field => expect(deltaEntry).toContain(escaped(field)));
    expect(plusEntry).not.toContain('<b>');
    expect(deltaEntry).not.toContain('<b>');
    expect(plusOf({
      ...plus,
      why: 'reads `<ul>` whole & <b>more</b>'
    })).toContain('reads `<ul>` whole &amp; &lt;b&gt;more&lt;/b&gt;');
  });

  test('every severity the schema allows names itself at the head of its fold', () => {
    feedbackSchema().$defs.severity['enum'].forEach(severity => {
      const fold = deltaOf({...note, severity}).split('\n')[0];
      expect(fold).toMatch(new RegExp(`^<details><summary>${severity} · `));
    });
  });

  test('an inferred entry says so beside its place', () => {
    expect(deltaOf({...concern, evidence: 'inferred'})).toMatch(/^<details><summary>concern · presentation · src\/b\.css:9 · inferred<\/summary>\n/);
    expect(plusOf({...plus, evidence: 'inferred'})).toMatch(/^<details><summary>keep · structure · src\/f\.tsx:5 · inferred<\/summary>\n/);
  });

  test('a review with plusses and no deltas still leaves its feedback on the commit, and an empty one leaves none', () => {
    expect(leavesFeedback(review([plus], []))).toBe(true);
    expect(leavesFeedback(review([], [note]))).toBe(true);
    expect(leavesFeedback(review([], []))).toBe(false);
  });

  test('the schema the review answers in names every field the report tells, and the doors and severities once', () => {
    const schema = feedbackSchema();
    expect(schema.required).toEqual(['overview', 'nextSteps', 'habits', 'plusses', 'deltas']);
    expect(schema.properties.overview).toEqual({type: 'string'});
    expect(schema.properties.nextSteps).toEqual({type: 'array', items: {type: 'string'}});
    expect(schema.properties.habits.items.required).toEqual(['title', 'rule', 'problem', 'why', 'fix']);
    expect(Object.keys(schema.properties)).toContain('deferred');
    expect(schema.properties.plusses.items.required).toEqual(expect.arrayContaining(['door', 'habit', 'file', 'line', 'happened', 'why', 'evidence', 'principle']));
    expect(Object.keys(schema.properties.plusses.items.properties)).toContain('checked');
    expect(schema.properties.deltas.items.required).toEqual(expect.arrayContaining(['door', 'habit', 'severity', 'file', 'line', 'happened', 'why', 'evidence', 'change', 'principle']));
    expect(Object.keys(schema.properties.deltas.items.properties)).toContain('checked');
    expect(schema.properties.plusses.items.properties.door).toEqual({$ref: '#/$defs/door'});
    expect(schema.properties.deltas.items.properties.door).toEqual({$ref: '#/$defs/door'});
    expect(schema.properties.deltas.items.properties.severity).toEqual({$ref: '#/$defs/severity'});
    expect(schema.properties.plusses.items.properties.evidence).toEqual({$ref: '#/$defs/evidence'});
    expect(schema.properties.deltas.items.properties.evidence).toEqual({$ref: '#/$defs/evidence'});
    expect(schema.$defs.door['enum']).toEqual(['structure', 'presentation', 'dynamic interaction', 'design', 'tests', 'tutorials']);
    expect(schema.$defs.severity['enum']).toEqual(['violation', 'concern', 'note']);
    expect(schema.$defs.evidence['enum']).toEqual(['read', 'inferred']);
  });

  test('only a violation fails the job', () => {
    expect(verdictOf([note, concern])).toBe(0);
    expect(verdictOf([note, violation])).toBe(1);
    expect(verdictOf([])).toBe(0);
  });
});
