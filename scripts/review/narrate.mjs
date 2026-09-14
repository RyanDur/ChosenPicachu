import {createInterface} from 'node:readline';
import {writeFileSync} from 'node:fs';

const said = (text) => text.replace(/\s+/g, ' ').trim();

const counted = (plusses, deltas) => `${plusses} ${plusses === 1 ? 'plus' : 'plusses'} and ${deltas} ${deltas === 1 ? 'delta' : 'deltas'}`;

const step = ({name, input}) => {
  switch (name) {
    case 'Read': return `reads ${input.file_path}`;
    case 'Grep': return `greps ${JSON.stringify(input.pattern)} in ${input.path ?? '.'}`;
    case 'Glob': return `globs ${input.pattern}`;
    case 'Bash': return `runs ${input.command}`;
    case 'Agent': return `asks ${input.subagent_type}: ${said(input.description ?? '')}`;
    case 'StructuredOutput': return `answers with ${counted(input.plusses?.length ?? 0, input.deltas?.length ?? 0)}`;
    default: return `${name} ${JSON.stringify(input).slice(0, 120)}`;
  }
};

export const narration = (event) => {
  if (event.type === 'assistant') {
    return event.message.content
      .map(block => block.type === 'text' ? said(block.text) : block.type === 'tool_use' ? step(block) : '')
      .filter(line => line !== '')
      .join('\n');
  }
  if (event.type === 'result') {
    return event.is_error
      ? `the review did not finish: ${said(String(event.result))}`
      : `done in ${event.num_turns} turns: ${counted(event.structured_output?.plusses?.length ?? 0, event.structured_output?.deltas?.length ?? 0)}`;
  }
  return '';
};

export const outcome = (result) => result === undefined || result.is_error ? 1 : 0;

if (import.meta.url === `file://${process.argv[1]}`) {
  let result;
  const lines = createInterface({input: process.stdin});
  lines.on('line', line => {
    const event = JSON.parse(line);
    if (event.type === 'result') {
      result = event;
      writeFileSync('review.json', line);
    }
    const told = narration(event);
    if (told !== '') {
      process.stdout.write(`${told}\n`);
    }
  });
  lines.on('close', () => {
    process.exitCode = outcome(result);
  });
}
