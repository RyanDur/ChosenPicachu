import {agents, qaNames, reading, reviewers, reviewersIn} from '../review/agents.mjs';
import {dispatch, promptFor} from '../review/prompt.mjs';

const two = `# Agents

Anything before the reviewers is prose for people.

## Reviewers

### structure
- rubric: \`src/pages/Home/Structure.tsx\`
- reviews: the site
- scopes: full, changes
- asks: what things are

### tests
- rubric: \`scripts/review/tests.md\`
- reviews: the tests
- scopes: full, changes, tests
- asks: what a test is for
`;

describe('the reviewers AGENTS.md names', () => {
  test('should read each reviewer\'s name, rubric, half, scopes and question', () => {
    expect(reviewersIn(two)).toEqual([
      {name: 'structure', file: 'src/pages/Home/Structure.tsx', reviews: 'site', scopes: ['full', 'changes'], asks: 'what things are'},
      {name: 'tests', file: 'scripts/review/tests.md', reviews: 'tests', scopes: ['full', 'changes', 'tests'], asks: 'what a test is for'}
    ]);
  });

  test('should drop a reviewer that AGENTS.md no longer names', () => {
    const one = two.slice(0, two.indexOf('### tests'));

    expect(reviewersIn(one).map(({name}) => name)).toEqual(['structure']);
  });

  test('should refuse an AGENTS.md that names no reviewers', () => {
    expect(() => reviewersIn('# Agents')).toThrow('AGENTS.md names no reviewers');
  });

  test('should name the line a reviewer is missing', () => {
    const unscoped = two.replace('- scopes: full, changes\n', '');

    expect(() => reviewersIn(unscoped)).toThrow('the structure reviewer in AGENTS.md has no scopes line');
  });

  test('should send every reviewer in a scope the scope, however many there are', () => {
    const six = ['a-qa', 'b-qa', 'c-qa', 'd-qa', 'e-qa', 'f-qa'];

    expect(dispatch(six)).toContain('a-qa, b-qa, c-qa, d-qa, e-qa and f-qa');
    expect(dispatch(six)).not.toContain('undefined');
  });

});

describe('the review\'s QAs', () => {
  test('every door gets its own QA that runs on opus and can only read', () => {
    const qas = agents();
    expect(Object.keys(qas)).toEqual(['structure-qa', 'presentation-qa', 'dynamic-interaction-qa', 'design-qa', 'tests-qa', 'tutorials-qa']);
    Object.values(qas).forEach(qa => {
      expect(qa.model).toBe('opus');
      expect(qa.tools).toEqual(reading);
      expect(qa.tools.some(tool => tool.startsWith('Edit') || tool.startsWith('Write'))).toBe(false);
    });
  });

  test('each QA carries the values and its own door', () => {
    const qas = agents();
    reviewers.forEach(({name, file}) => {
      const qa = qas[`${name}-qa`];
      expect(qa.prompt).toContain('# What every reviewer here holds');
      expect(qa.prompt).toContain(`You hold the ${name} door. Read ${file} first`);
      expect(qa.prompt).toContain('Corroborate before you report');
      expect(qa.prompt).toContain('Never invent a delta');
    });
  });

  test('the door QAs review the site and leave the tests to the tests QA', () => {
    const qas = agents();
    reviewers.filter(({reviews}) => reviews === 'site').forEach(({name}) => {
      expect(qas[`${name}-qa`].prompt).toContain('You review the site.');
      expect(qas[`${name}-qa`].prompt).toContain('report nothing on it');
    });
    expect(qas['tests-qa'].prompt).toContain('You review the tests.');
    expect(qas['tests-qa'].prompt).toContain('the only finding you make on the site is that a test is missing');
  });

  test('the tests QA is sent to the tests door and the test support', () => {
    const qas = agents();
    expect(qas['tests-qa'].prompt).toContain('scripts/review/tests.md');
    expect(qas['tests-qa'].prompt).toContain('every __test_support/ directory');
  });

  test('the tutorials QA is sent to the tutorials door and reviews the site', () => {
    const qa = agents()['tutorials-qa'];
    expect(qa.prompt).toContain('You hold the tutorials door. Read scripts/review/tutorials.md first');
    expect(qa.prompt).toContain('what a tutorial on the demos tab owes its reader');
    expect(qa.prompt).toContain('You review the site.');
  });

  test('the lead carries the values and splits the scope between the six QAs', () => {
    const lead = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(lead).toContain('# What every reviewer here holds');
    expect(lead).toContain('scripts/review/tests.md');
    expect(lead).toContain('The scope has two halves.');
    qaNames.forEach(name => expect(lead).toContain(name));
    expect(lead).toContain('git diff abc def');
  });

  test('the lead corroborates every finding that comes back', () => {
    const lead = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(lead).toContain('corroborate every plus and every delta yourself');
  });

  test('every QA answers in the shape the schema asks for', () => {
    Object.values(agents()).forEach(qa => {
      expect(qa.prompt).toContain('each plus {door, file, line, happened, why, evidence, checked, principle}');
      expect(qa.prompt).toContain('each delta {door, severity, file, line, happened, why, evidence, change, checked, principle}');
    });
  });
});
