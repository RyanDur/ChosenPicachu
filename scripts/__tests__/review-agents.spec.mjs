import {agents, doors, qaNames, reading, tests} from '../review/agents.mjs';
import {promptFor} from '../review/prompt.mjs';

describe('the review\'s QAs', () => {
  test('every door gets its own QA that runs on opus and can only read', () => {
    const qas = agents();
    expect(Object.keys(qas)).toEqual(['structure-qa', 'presentation-qa', 'dynamic-interaction-qa', 'tests-qa']);
    Object.values(qas).forEach(qa => {
      expect(qa.model).toBe('opus');
      expect(qa.tools).toEqual(reading);
      expect(qa.tools.some(tool => tool.startsWith('Edit') || tool.startsWith('Write'))).toBe(false);
    });
  });

  test('each QA carries the values and its own door', () => {
    const qas = agents();
    [...doors, tests].forEach(({name, file}) => {
      const qa = qas[`${name}-qa`];
      expect(qa.prompt).toContain('# What every reviewer here holds');
      expect(qa.prompt).toContain(`You hold the ${name} door. Read ${file} first`);
      expect(qa.prompt).toContain('Corroborate before you report');
      expect(qa.prompt).toContain('Never invent a finding');
    });
  });

  test('the door QAs review the site and leave the tests to the tests QA', () => {
    const qas = agents();
    doors.forEach(({name}) => {
      expect(qas[`${name}-qa`].prompt).toContain('You review the site.');
      expect(qas[`${name}-qa`].prompt).toContain('report nothing on it');
    });
    expect(qas['tests-qa'].prompt).toContain('You review the tests.');
    expect(qas['tests-qa'].prompt).toContain('the only finding you make on the site is that a test is missing');
  });

  test('the tests QA is sent to the tests door and the test support', () => {
    const qas = agents();
    expect(qas['tests-qa'].prompt).toContain('scripts/review/tests.md');
    expect(qas['tests-qa'].prompt).toContain('src/test-support/');
  });

  test('the lead carries the values and splits the scope between the four QAs', () => {
    const lead = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(lead).toContain('# What every reviewer here holds');
    expect(lead).toContain('scripts/review/tests.md');
    expect(lead).toContain('The scope has two halves.');
    qaNames.forEach(name => expect(lead).toContain(name));
    expect(lead).toContain('git diff abc def');
  });

  test('the lead corroborates every finding that comes back', () => {
    const lead = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(lead).toContain('corroborate every finding yourself');
  });
});
