import {promptFor} from '../review/prompt.mjs';
import {findingsIn, summaryOf, verdictOf} from '../review/report.mjs';

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
    test('sends the reviewer to the doors on the home page first', () => {
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

    test('findings are counted and grouped by door, worst first', () => {
        const summary = summaryOf([testNote, note, concern, violation, interaction]);
        expect(summary).toContain('1 violation, 1 concern, 3 notes.');
        expect(summary.indexOf('### structure')).toBeLessThan(summary.indexOf('### presentation'));
        expect(summary.indexOf('### presentation')).toBeLessThan(summary.indexOf('### dynamic interaction'));
        expect(summary.indexOf('### dynamic interaction')).toBeLessThan(summary.indexOf('### tests'));
        expect(summary.indexOf('### dynamic interaction')).toBeLessThan(summary.indexOf('a handler is named for the act in progress'));
        expect(summary.indexOf('a div wraps a list')).toBeLessThan(summary.indexOf('a section has no heading'));
        expect(summary).toContain('`src/b.css:9`');
        expect(summary).toContain('_Tag selectors are for resets only_');
        expect(summary).toContain('`src/__tests__/c.spec.tsx:4`');
    });

    test('only a violation fails the job', () => {
        expect(verdictOf([note, concern])).toBe(0);
        expect(verdictOf([note, violation])).toBe(1);
    });
});
