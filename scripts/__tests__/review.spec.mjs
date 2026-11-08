import {findingsIn, findingsOnThePull, summaryOf, verdictOf} from '../review/report.mjs';

const answered = findings => JSON.stringify({
  type: 'result',
  result: `I reviewed the range.\n\n\`\`\`json\n${JSON.stringify(findings)}\n\`\`\`\n\nThat is all.`
});

const bug = {
  file: 'src/a.ts', line: 3, severity: 'violation', rubric: 'correctness',
  summary: 'A refused add is sent twice.', failure_scenario: 'Press Add twice while the first is in flight.'
};
const note = {
  file: 'src/b.tsx', line: 9, severity: 'note', rubric: 'scripts/review/voice.md',
  summary: 'The sentence stages its point.', failure_scenario: 'A reader waits for the point.'
};

describe('the findings Claude Code\'s review answers with', () => {
  test('should read the findings from the fenced JSON in its answer', () => {
    expect(findingsIn(answered([bug, note]))).toEqual([bug, note]);
  });

  test('should read the findings from the last answer in the action\'s execution file', () => {
    const execution = JSON.stringify([
      {type: 'system', subtype: 'init'},
      {type: 'assistant', message: {content: []}},
      JSON.parse(answered([bug]))
    ]);

    expect(findingsIn(execution)).toEqual([bug]);
  });

  test('should read no findings from an empty list', () => {
    expect(findingsIn(answered([]))).toEqual([]);
  });

  test('should refuse an answer with no findings list', () => {
    expect(() => findingsIn(JSON.stringify({type: 'result', result: 'Looks good.'})))
      .toThrow('the review answered without a findings list');
  });

  test('should count a finding with no severity as a concern', () => {
    const {severity: _, ...unsorted} = bug;

    expect(findingsIn(answered([unsorted]))[0].severity).toBe('concern');
  });
});

describe('the findings the review left on the pull request\'s lines', () => {
  const comment = (body, commit = 'def5678', path = 'src/a.ts', line = 3) => ({path, line, commit_id: commit, body});

  test('should read each line comment as a finding, its severity from its first word', () => {
    expect(findingsOnThePull(JSON.stringify([
      comment('**violation** (correctness)\n\nA refused add is sent twice.'),
      comment('**note** (scripts/review/voice.md)\n\nThe sentence stages its point.', 'def5678', 'src/b.tsx', 9)
    ]), 'def5678')).toEqual([
      {file: 'src/a.ts', line: 3, severity: 'violation', rubric: 'correctness', summary: 'A refused add is sent twice.'},
      {file: 'src/b.tsx', line: 9, severity: 'note', rubric: 'scripts/review/voice.md', summary: 'The sentence stages its point.'}
    ]);
  });

  test('should read the pages GitHub lists them in as one list', () => {
    const pages = JSON.stringify([[comment('**note** (correctness)\n\nOne.')], [comment('**note** (correctness)\n\nTwo.')]]);

    expect(findingsOnThePull(pages, 'def5678').map(({summary}) => summary)).toEqual(['One.', 'Two.']);
  });

  test('should read only the comments on the commit under review', () => {
    expect(findingsOnThePull(JSON.stringify([comment('**violation** (correctness)\n\nOld.', 'abc1234')]), 'def5678'))
      .toEqual([]);
  });

  test('should count a comment with no severity as a concern', () => {
    expect(findingsOnThePull(JSON.stringify([comment('A thought.')]), 'def5678')[0].severity).toBe('concern');
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
