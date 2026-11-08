import {askFor, reviewersIn} from '../review/ask.mjs';

const two = `# Agents

Anything before the reviewers is prose for people.

## Reviewers

### structure
- rubric: \`src/pages/Practice/structure/StructurePractice.tsx\`
- asks: what things are

### tests
- rubric: \`scripts/review/tests.md\`
- asks: what a test is for
`;

describe('the reviewers AGENTS.md names', () => {
  test('should read each reviewer\'s name, rubric and question', () => {
    expect(reviewersIn(two)).toEqual([
      {name: 'structure', file: 'src/pages/Practice/structure/StructurePractice.tsx', asks: 'what things are'},
      {name: 'tests', file: 'scripts/review/tests.md', asks: 'what a test is for'}
    ]);
  });

  test('should drop a reviewer that AGENTS.md no longer names', () => {
    const one = two.slice(0, two.indexOf('### tests'));

    expect(reviewersIn(one).map(({name}) => name)).toEqual(['structure']);
  });

  test('should refuse an AGENTS.md that names no reviewers', () => {
    expect(() => reviewersIn('# Agents')).toThrow('AGENTS.md names no reviewers');
  });

  test('should refuse a reviewer with no rubric', () => {
    expect(() => reviewersIn('# Agents\n\n## Reviewers\n\n### voice\n- asks: how the prose reads\n'))
      .toThrow('the voice reviewer in AGENTS.md has no rubric line');
  });
});

describe('what the review is asked', () => {
  const asked = askFor({before: 'abc1234', after: 'def5678', reviewers: reviewersIn(two)});

  test('should ask Claude Code\'s own review for the pushed range', () => {
    expect(asked).toContain('args "high abc1234..def5678 --max-findings all"');
  });

  test('should ask for a pull request by its number, with its findings left on its lines', () => {
    const onThePull = askFor({before: 'abc1234', after: 'def5678', pull: '412', reviewers: reviewersIn(two)});

    expect(onThePull).toContain('args "high --comment 412 --max-findings all"');
  });

  test('should name every reviewer\'s rubric, to be read whole', () => {
    expect(asked).toContain('src/pages/Practice/structure/StructurePractice.tsx (what things are)');
    expect(asked).toContain('scripts/review/tests.md (what a test is for)');
  });

  test('should ask for a severity and a rubric on every finding', () => {
    expect(asked).toContain('"severity"');
    expect(asked).toContain('"rubric"');
  });
});
