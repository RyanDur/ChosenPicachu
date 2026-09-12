import {createInterface} from 'node:readline';
import {writeFileSync} from 'node:fs';

const said = (text) => text.replace(/\s+/g, ' ').trim();

const step = ({name, input}) => {
  switch (name) {
    case 'Read': return `reads ${input.file_path}`;
    case 'Grep': return `greps ${JSON.stringify(input.pattern)} in ${input.path ?? '.'}`;
    case 'Glob': return `globs ${input.pattern}`;
    case 'Bash': return `runs ${input.command}`;
    case 'StructuredOutput': return `answers with ${input.findings?.length ?? 0} findings`;
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
    const findings = event.structured_output?.findings?.length;
    return event.is_error
      ? `the review did not finish: ${said(String(event.result))}`
      : `done in ${event.num_turns} turns: ${findings ?? 'no'} findings`;
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
