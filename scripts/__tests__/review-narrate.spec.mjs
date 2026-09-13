import {narration, outcome} from '../review/narrate.mjs';

const assistant = (...content) => ({type: 'assistant', message: {content}});

describe('the review narration', () => {
  test('what the reviewer reads, searches and runs, one line each', () => {
    const told = narration(assistant(
      {type: 'tool_use', name: 'Read', input: {file_path: 'src/pages/Home/Structure.tsx'}},
      {type: 'tool_use', name: 'Grep', input: {pattern: 'aria-label', path: 'src'}},
      {type: 'tool_use', name: 'Glob', input: {pattern: 'src/**/*.css'}},
      {type: 'tool_use', name: 'Bash', input: {command: 'git diff abc def'}},
      {type: 'tool_use', name: 'Agent', input: {subagent_type: 'structure-qa', description: 'review the push for the structure door', prompt: '...'}},
      {type: 'tool_use', name: 'StructuredOutput', input: {findings: [{}, {}, {}]}}
    ));
    expect(told.split('\n')).toEqual([
      'reads src/pages/Home/Structure.tsx',
      'greps "aria-label" in src',
      'globs src/**/*.css',
      'runs git diff abc def',
      'asks structure-qa: review the push for the structure door',
      'answers with 3 findings'
    ]);
  });

  test('what the reviewer says, whitespace folded', () => {
    expect(narration(assistant({type: 'text', text: '  The banner\n  panel has no heading.  '}))).toBe('The banner panel has no heading.');
  });

  test('events that are not the reviewer speaking say nothing', () => {
    expect(narration({type: 'system', subtype: 'init'})).toBe('');
    expect(narration({type: 'user', message: {content: [{type: 'tool_result'}]}})).toBe('');
    expect(narration({type: 'rate_limit_event'})).toBe('');
  });

  test('the result says how long it took and how much it found', () => {
    expect(narration({type: 'result', is_error: false, num_turns: 12, structured_output: {findings: [{}, {}]}})).toBe('done in 12 turns: 2 findings');
  });

  test('a result that is an error says why, and fails the step', () => {
    const failed = {type: 'result', is_error: true, result: 'Credit balance is too low'};
    expect(narration(failed)).toBe('the review did not finish: Credit balance is too low');
    expect(outcome(failed)).toBe(1);
    expect(outcome(undefined)).toBe(1);
    expect(outcome({type: 'result', is_error: false})).toBe(0);
  });
});
