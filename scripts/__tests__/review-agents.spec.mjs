import {agents, doors, qaNames, reading} from '../review/agents.mjs';
import {promptFor} from '../review/prompt.mjs';

describe('the review\'s QAs', () => {
  test('one QA per door, on opus, reading only', () => {
    const qas = agents();
    expect(Object.keys(qas)).toEqual(['structure-qa', 'presentation-qa', 'dynamic-interaction-qa']);
    Object.values(qas).forEach(qa => {
      expect(qa.model).toBe('opus');
      expect(qa.tools).toEqual(reading);
      expect(qa.tools.some(tool => tool.startsWith('Edit') || tool.startsWith('Write'))).toBe(false);
    });
  });

  test('each QA carries the values and its own door', () => {
    const qas = agents();
    doors.forEach(({name, file}) => {
      const qa = qas[`${name}-qa`];
      expect(qa.prompt).toContain('# What every reviewer here holds');
      expect(qa.prompt).toContain(`You hold the ${name} door. Read ${file} first`);
      expect(qa.prompt).toContain('Corroborate before you report');
    });
  });

  test('the lead carries the values, sends the three QAs the scope, and corroborates what comes back', () => {
    const lead = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(lead).toContain('# What every reviewer here holds');
    qaNames.forEach(name => expect(lead).toContain(name));
    expect(lead).toContain('git diff abc def');
    expect(lead).toContain('corroborate every finding yourself');
  });
});
