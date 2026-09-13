import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const values = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'values.md'), 'utf8');

export const doors = [
  {name: 'structure', file: 'src/pages/Home/Structure.tsx', asks: 'what things are: the element chosen for the content, the landmarks and their names, the headings, the reading order with the styles off'},
  {name: 'presentation', file: 'src/pages/Home/Presentation.tsx', asks: 'how things show: structure in the component sheet, needs as shared words, the platform\'s own states before invented ones, constants in the sheet and only runtime values inline'},
  {name: 'dynamic-interaction', file: 'src/pages/Home/DynamicInteraction.tsx', asks: 'how things respond: state that holds only what cannot be derived, events named for what happened, pure transitions, the platform\'s behaviour before script, a keyboard twin for every gesture, changes that announce themselves'}
];

export const reading = ['Read', 'Grep', 'Glob', 'Bash(git diff:*)', 'Bash(git log:*)'];

export const qaOf = ({name, file, asks}) => ({
  description: `Reviews code against the ${name} door of the home page: ${asks}.`,
  prompt: [
    values,
    `## Your door`,
    `You hold the ${name} door. Read ${file} first and whole; it is your rubric, in the author's words. Review only what that door asks about: ${asks}.`,
    'The lead tells you the scope. Read every file in it whole, and any other file it leans on when you need the context.',
    'Answer with a JSON array of findings, each {door, severity, file, line, what, principle}, and nothing else. Your door is the door of every finding you make.'
  ].join('\n\n'),
  tools: reading,
  model: 'opus',
  maxTurns: 60
});

export const qaNames = doors.map(({name}) => `${name}-qa`);

export const agents = () => Object.fromEntries(doors.map(door => [`${door.name}-qa`, qaOf(door)]));

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(JSON.stringify(agents()));
}
