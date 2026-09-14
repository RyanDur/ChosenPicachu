import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promptFor} from '../review/prompt.mjs';
import {deltaOf, doorTable, leavesFeedback, plusOf, reviewIn, summaryOf, verdictOf} from '../review/report.mjs';
import {shapeOf} from '../review/agents.mjs';

const placeOf = (text, needle) => {
  expect(text).toContain(needle);
  return text.indexOf(needle);
};

const answer = (review) => JSON.stringify({type: 'result', structured_output: review});

const violation = {
  door: 'structure',
  severity: 'violation',
  file: 'src/a.tsx',
  line: 3,
  happened: 'a div wraps a list',
  why: 'with the styles off the list is a list no longer',
  change: 'let the ul stand on its own',
  principle: 'lists admit they are lists'
};
const concern = {
  door: 'presentation',
  severity: 'concern',
  file: 'src/b.css',
  line: 9,
  happened: 'a tag selector styles a button',
  why: 'every button on the site now wears it',
  change: 'give the button a class that names it',
  principle: 'Tag selectors are for resets only'
};
const note = {
  door: 'structure',
  severity: 'note',
  file: 'src/c.tsx',
  line: 1,
  happened: 'a section has no heading',
  why: 'a reader walking the headings skips it',
  change: 'name the section with a heading',
  principle: 'Sections name themselves through their headings'
};
const testNote = {
  door: 'tests',
  severity: 'note',
  file: 'src/__tests__/c.spec.tsx',
  line: 4,
  happened: 'a spec finds a button by class',
  why: 'a rename of the class breaks a test about behaviour',
  change: 'find the button by its role and name',
  principle: 'It finds by role, label and text, like every test'
};
const interaction = {
  door: 'dynamic interaction',
  severity: 'note',
  file: 'src/d.tsx',
  line: 7,
  happened: 'a handler is named for the act in progress',
  why: 'the reader cannot tell the event from the command',
  change: 'name it for what happened',
  principle: 'Events are what happened, so they are named in the past tense'
};
const design = {
  door: 'design',
  severity: 'concern',
  file: 'src/e.ts',
  line: 2,
  happened: 'two booleans stand where a union belongs',
  why: 'the type lets them disagree',
  change: 'one union of the cases',
  principle: 'A state is a union of its cases'
};
const plus = {
  door: 'structure',
  file: 'src/f.tsx',
  line: 5,
  happened: 'the friends list is a fieldset with a legend',
  why: 'the group names itself and the platform hands the name to a reader',
  principle: 'The right tag hands most of that over for free'
};
const testPlus = {
  door: 'tests',
  file: 'src/__tests__/f.spec.tsx',
  line: 8,
  happened: 'the group is found by its exact name',
  why: 'a name that absorbs a control fails the test',
  principle: 'The name says what the reader will believe when it passes'
};

const review = (plusses, deltas) => ({plusses, deltas});

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

  test('a review of the changes sends all five QAs', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('five QAs hold one door each: structure-qa, presentation-qa, dynamic-interaction-qa, design-qa, tests-qa');
  });

  test('the review answers in the feedback stance: plusses and deltas, each with what happened and why', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('You take a feedback stance: plusses and deltas, each with its why.');
    expect(prompt).toContain('A **plus** is a choice in the code that holds a door up.');
    expect(prompt).toContain('A **delta** is a finding: something to change.');
    expect(prompt).toContain('Answer in the feedback stance');
  });

  test('a violation carries a trace to what a person would see, or it is a concern', () => {
    expect(promptFor({scope: 'full'})).toContain('a delta whose trace you cannot make is a **concern**');
  });

  test('a delta the author recorded as not taken is answered by name, not raised again', () => {
    expect(promptFor({scope: 'full'})).toContain('answer that reason by name: accept it, or rebut it');
  });
});

describe('the review report', () => {
  test('reads the plusses and deltas the reviewer structured', () => {
    expect(reviewIn(answer(review([plus], [note])))).toEqual({plusses: [plus], deltas: [note]});
  });

  test('an answer without structured plusses and deltas is refused', () => {
    expect(() => reviewIn(JSON.stringify({type: 'result', result: 'prose'}))).toThrow('structured output is missing');
    expect(() => reviewIn(JSON.stringify({type: 'result', structured_output: {findings: []}}))).toThrow('structured output is missing');
  });

  test('no deltas reads as the code holding up, with the plusses still told', () => {
    const summary = summaryOf(review([plus], []));
    expect(summary).toContain('## The code holds up the home page');
    expect(summary).toContain('1 plus, no deltas.');
    expect(summary).toContain('the friends list is a fieldset with a legend');
  });

  test('plusses and deltas are counted, deltas by severity', () => {
    expect(summaryOf(review([plus, testPlus], [testNote, note, concern, violation, interaction])))
      .toContain('2 plusses. 1 violation, 1 concern, 3 notes.');
  });

  test('deltas are grouped by door, worst door and worst delta first', () => {
    const summary = summaryOf(review([], [testNote, note, concern, violation, interaction, design]));
    expect(placeOf(summary, '#### structure')).toBeLessThan(placeOf(summary, '#### presentation'));
    expect(placeOf(summary, '#### presentation')).toBeLessThan(placeOf(summary, '#### dynamic interaction'));
    expect(placeOf(summary, '#### dynamic interaction')).toBeLessThan(placeOf(summary, '#### design'));
    expect(placeOf(summary, '#### design')).toBeLessThan(placeOf(summary, '#### tests'));
    expect(placeOf(summary, 'a div wraps a list')).toBeLessThan(placeOf(summary, 'a section has no heading'));
  });

  test('plusses come before the deltas, each under its door, so the headings nest the same way on both sides', () => {
    const summary = summaryOf(review([testPlus, plus], [design]));
    expect(placeOf(summary, '### Plusses')).toBeLessThan(placeOf(summary, '#### structure'));
    expect(placeOf(summary, '#### structure')).toBeLessThan(placeOf(summary, '#### tests'));
    expect(placeOf(summary, '#### tests')).toBeLessThan(placeOf(summary, '### Deltas'));
    expect(placeOf(summary, '### Deltas')).toBeLessThan(placeOf(summary, '#### design'));
    expect(summary).not.toContain('### Plusses\n\n#####');
  });

  test('the doors are tallied in a table before the prose, plusses beside the severities', () => {
    const told = review([plus, testPlus], [testNote, note, concern, violation, interaction]);
    const summary = summaryOf(told);
    expect(placeOf(summary, '| structure | 1 | 1 | 0 | 1 |')).toBeLessThan(placeOf(summary, '### Plusses'));
    expect(doorTable(told)).toContain('| door | plusses | violations | concerns | notes |');
    expect(doorTable(told)).toContain('| presentation | 0 | 0 | 1 | 0 |');
    expect(doorTable(told)).toContain('| tests | 1 | 0 | 0 | 1 |');
  });

  test('a door nobody said anything about gets no row', () => {
    expect(doorTable(review([], [note]))).toContain('| structure | 0 | 0 | 0 | 1 |');
    expect(doorTable(review([], [note]))).not.toContain('presentation');
    expect(doorTable(review([testPlus], []))).toContain('| tests | 1 | 0 | 0 | 0 |');
  });

  test('a delta is a heading with its mark and place, then what happened, why it matters, the change, and the door\'s words', () => {
    const entry = deltaOf(concern);
    expect(entry).toContain('##### ▲ concern · `src/b.css:9`');
    expect(placeOf(entry, '**What happened:** a tag selector styles a button')).toBeLessThan(placeOf(entry, '**Why it matters:** every button on the site now wears it'));
    expect(placeOf(entry, '**Why it matters:**')).toBeLessThan(placeOf(entry, '**Change:** give the button a class that names it'));
    expect(entry).toContain('> Tag selectors are for resets only');
  });

  test('a plus is a heading with its place, then what happened, why it works, and the door\'s words', () => {
    const entry = plusOf(plus);
    expect(entry).toContain('##### + `src/f.tsx:5`');
    expect(placeOf(entry, '**What happened:** the friends list is a fieldset with a legend')).toBeLessThan(placeOf(entry, '**Why it works:** the group names itself'));
    expect(entry).toContain('> The right tag hands most of that over for free');
  });

  test('the place links to the line at the reviewed commit when the commit is known', () => {
    const commit = {repository: 'RyanDur/ChosenPicachu', sha: 'abc123'};
    const summary = summaryOf(review([plus], [violation]), {commit});
    expect(summary).toContain('[src/a.tsx:3](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/a.tsx#L3)');
    expect(summary).toContain('[src/f.tsx:5](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/f.tsx#L5)');
  });

  test('what the reviewer checked folds away under the entry', () => {
    expect(deltaOf({...note, checked: 'read the file whole'})).toContain('**Change:** name the section with a heading\n\n<details><summary>what was checked</summary>\n\nread the file whole\n\n</details>\n\n> Sections');
    expect(plusOf({...plus, checked: 'read the legend'})).toContain('<details><summary>what was checked</summary>\n\nread the legend\n\n</details>');
    expect(deltaOf(note)).not.toContain('<details>');
    expect(plusOf(plus)).not.toContain('<details>');
  });

  test("a tag the reviewer writes in its prose stays words on the page, and a code span keeps its angle brackets", () => {
    const entry = plusOf({...plus, happened: 'renders it inside <details><summary>what was checked</summary>, shared by both', why: 'reads `<ul>` whole & more'});
    expect(entry).toContain('renders it inside &lt;details&gt;&lt;summary&gt;what was checked&lt;/summary&gt;, shared by both');
    expect(entry).not.toContain('<details>');
    expect(entry).toContain('reads `<ul>` whole &amp; more');
    expect(deltaOf({...note, checked: 'opened <main> whole'})).toContain('<details><summary>what was checked</summary>\n\nopened &lt;main&gt; whole\n\n</details>');
  });

  test('a review with plusses and no deltas still leaves its feedback on the commit, and an empty one leaves none', () => {
    expect(leavesFeedback(review([plus], []))).toBe(true);
    expect(leavesFeedback(review([], [note]))).toBe(true);
    expect(leavesFeedback(review([], []))).toBe(false);
  });

  test('the schema the review answers in names every field the report tells, and the doors and severities once', () => {
    const schema = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../review/feedback.schema.json'), 'utf8'));
    expect(schema.properties.plusses.items.required).toEqual(expect.arrayContaining(['door', 'file', 'line', 'happened', 'why', 'principle']));
    expect(Object.keys(schema.properties.plusses.items.properties)).toContain('checked');
    expect(schema.properties.deltas.items.required).toEqual(expect.arrayContaining(['door', 'severity', 'file', 'line', 'happened', 'why', 'change', 'principle']));
    expect(Object.keys(schema.properties.deltas.items.properties)).toContain('checked');
    expect(schema.properties.plusses.items.properties.door).toEqual({$ref: '#/$defs/door'});
    expect(schema.properties.deltas.items.properties.door).toEqual({$ref: '#/$defs/door'});
    expect(schema.properties.deltas.items.properties.severity).toEqual({$ref: '#/$defs/severity'});
    expect(schema.$defs.door['enum']).toEqual(['structure', 'presentation', 'dynamic interaction', 'design', 'tests']);
    expect(schema.$defs.severity['enum']).toEqual(['violation', 'concern', 'note']);
  });

  test('only a violation fails the job', () => {
    expect(verdictOf([note, concern])).toBe(0);
    expect(verdictOf([note, violation])).toBe(1);
  });
});
