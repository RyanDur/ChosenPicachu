import {promptFor} from '../review/prompt.mjs';
import {doorTable, entryOf, findingsIn, summaryOf, verdictOf} from '../review/report.mjs';

const placeOf = (text, needle) => {
  expect(text).toContain(needle);
  return text.indexOf(needle);
};

const answer = (findings) => JSON.stringify({type: 'result', structured_output: {findings}});

const violation = {
  door: 'structure',
  severity: 'violation',
  file: 'src/a.tsx',
  line: 3,
  what: 'a div wraps a list',
  principle: 'lists admit they are lists'
};
const concern = {
  door: 'presentation',
  severity: 'concern',
  file: 'src/b.css',
  line: 9,
  what: 'a tag selector styles a button',
  principle: 'Tag selectors are for resets only'
};
const note = {
  door: 'structure',
  severity: 'note',
  file: 'src/c.tsx',
  line: 1,
  what: 'a section has no heading',
  principle: 'Sections name themselves through their headings'
};
const testNote = {
  door: 'tests',
  severity: 'note',
  file: 'src/__tests__/c.spec.tsx',
  line: 4,
  what: 'a spec finds a button by class',
  principle: 'It finds by role, label and text, like every test'
};
const interaction = {
  door: 'dynamic interaction',
  severity: 'note',
  file: 'src/d.tsx',
  line: 7,
  what: 'a handler is named for the act in progress',
  principle: 'Events are what happened, so they are named in the past tense'
};

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
    expect(() => promptFor({scope: 'some'})).toThrow('no review scope named "some"; the scopes are full, changes and tests');
  });

  test('a review of the tests asks the tests QA alone', () => {
    const prompt = promptFor({scope: 'tests'});
    expect(prompt).toContain('The scope is every test in the app');
    expect(prompt).toContain('Only tests-qa has a half in this scope');
    expect(prompt).not.toContain('structure-qa');
  });

  test('a review of the changes sends all four QAs', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('four QAs hold one door each: structure-qa, presentation-qa, dynamic-interaction-qa, tests-qa');
  });
});

describe('the review report', () => {
  test('reads the findings the reviewer structured', () => {
    expect(findingsIn(answer([note]))).toEqual([note]);
  });

  test('an answer without structured findings is refused', () => {
    expect(() => findingsIn(JSON.stringify({
      type: 'result',
      result: 'prose'
    }))).toThrow('structured output is missing');
  });

  test('no findings reads as the code holding up', () => {
    expect(summaryOf([])).toContain('No findings');
  });

  test('findings are counted by severity', () => {
    expect(summaryOf([testNote, note, concern, violation, interaction])).toContain('1 violation, 1 concern, 3 notes.');
  });

  test('findings are grouped by door, worst door and worst finding first', () => {
    const summary = summaryOf([testNote, note, concern, violation, interaction]);
    expect(placeOf(summary, '### structure')).toBeLessThan(placeOf(summary, '### presentation'));
    expect(placeOf(summary, '### presentation')).toBeLessThan(placeOf(summary, '### dynamic interaction'));
    expect(placeOf(summary, '### dynamic interaction')).toBeLessThan(placeOf(summary, '### tests'));
    expect(placeOf(summary, '### dynamic interaction')).toBeLessThan(placeOf(summary, 'a handler is named for the act in progress'));
    expect(placeOf(summary, 'a div wraps a list')).toBeLessThan(placeOf(summary, 'a section has no heading'));
  });

  test('the doors are tallied in a table before the prose', () => {
    const findings = [testNote, note, concern, violation, interaction];
    const summary = summaryOf(findings);
    expect(placeOf(summary, '| structure | 1 | 0 | 1 |')).toBeLessThan(placeOf(summary, '### structure'));
    expect(doorTable(findings)).toContain('| structure | 1 | 0 | 1 |');
    expect(doorTable(findings)).toContain('| presentation | 0 | 1 | 0 |');
    expect(doorTable(findings)).toContain('| tests | 0 | 0 | 1 |');
  });

  test('a door nobody found anything in gets no row', () => {
    expect(doorTable([note])).toContain('| structure | 0 | 0 | 1 |');
    expect(doorTable([note])).not.toContain('presentation');
  });

  test('a finding is a heading with its mark, its place, its words, and the door\'s words quoted', () => {
    const entry = entryOf(concern);
    expect(entry).toContain('#### ▲ concern · `src/b.css:9`');
    expect(entry).toContain('\n\na tag selector styles a button\n\n');
    expect(entry).toContain('> Tag selectors are for resets only');
  });

  test('the place links to the line at the reviewed commit when the commit is known', () => {
    const entry = entryOf(violation, {repository: 'RyanDur/ChosenPicachu', sha: 'abc123'});
    expect(entry).toContain('[src/a.tsx:3](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/a.tsx#L3)');
  });

  test('what the reviewer checked folds away under the finding', () => {
    const entry = entryOf({...note, what: 'a section has no heading. Checked: read the file whole.'});
    expect(entry).toContain('a section has no heading.\n\n<details><summary>what was checked</summary>\n\nChecked: read the file whole.\n\n</details>');
    expect(entryOf(note)).not.toContain('<details>');
  });

  test('only a violation fails the job', () => {
    expect(verdictOf([note, concern])).toBe(0);
    expect(verdictOf([note, violation])).toBe(1);
  });
});
