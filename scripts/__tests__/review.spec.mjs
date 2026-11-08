import {join} from 'node:path';
import {readFileSync} from 'node:fs';
import {findingsIn, summaryOf, verdictOf} from '../review/report.mjs';

const answered = findings => JSON.stringify({type: 'result', structured_output: {findings}});

const bug = {
  file: 'src/a.ts', line: 3, severity: 'violation', rubric: 'correctness',
  summary: 'A refused add is sent twice.', failure_scenario: 'Press Add twice while the first is in flight.'
};
const note = {
  file: 'src/b.tsx', line: 9, severity: 'note', rubric: 'scripts/review/voice.md',
  summary: 'The sentence stages its point.', failure_scenario: 'A reader waits for the point.'
};

describe('the findings Claude Code\'s review answers with', () => {
  test('should read the findings from the result a local run writes', () => {
    expect(findingsIn(answered([bug, note]))).toEqual([bug, note]);
  });

  test('should read the findings from the action\'s structured output', () => {
    expect(findingsIn(JSON.stringify({findings: [bug]}))).toEqual([bug]);
  });

  test('should read no findings from an empty list', () => {
    expect(findingsIn(answered([]))).toEqual([]);
  });

  test('should refuse an answer with no findings list', () => {
    expect(() => findingsIn(JSON.stringify({type: 'result', result: 'Looks good.'})))
      .toThrow('the review answered without a findings list');
  });

  test('should refuse a review that gave no structured output', () => {
    expect(() => findingsIn('')).toThrow('the review answered without a findings list');
  });

});

describe('the verdict', () => {
  test('should stop the push on a violation', () => {
    expect(verdictOf([note, bug])).toBe(1);
  });

  test('should let the push through with only concerns and notes', () => {
    expect(verdictOf([note])).toBe(0);
  });
});

describe('the comment', () => {
  const commit = {repository: 'RyanDur/ChosenPicachu', sha: 'def5678'};

  test('should say a push with a violation has something to fix before it ships', () => {
    expect(summaryOf([note, bug], {commit, subject: 'Add twice'}).split('\n')[0])
      .toBe('## “Add twice” has 1 violation to fix before it ships');
  });

  test('should say a push with no findings is fine to ship', () => {
    expect(summaryOf([], {commit}).split('\n')[0]).toBe('## This push is fine to ship, with nothing to change');
  });

  test('should list violations before notes, each linked to its line', () => {
    const told = summaryOf([note, bug], {commit});

    expect(told.indexOf('src/a.ts:3')).toBeLessThan(told.indexOf('src/b.tsx:9'));
    expect(told).toContain('https://github.com/RyanDur/ChosenPicachu/blob/def5678/src/a.ts#L3');
  });

  test('should keep markup in a finding as text', () => {
    const markup = {...note, summary: 'Use <dialog> here.'};

    expect(summaryOf([markup], {commit})).toContain('Use &lt;dialog&gt; here.');
  });
});

describe('the shape the review answers in', () => {
  test('should hold no apostrophe, since the workflow hands it to Claude Code inside single quotes', () => {
    const schema = readFileSync(join(import.meta.dirname, '../review/findings.schema.json'), 'utf8');

    expect(schema).not.toContain('\'');
  });
});
