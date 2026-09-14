import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const values = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'values.md'), 'utf8');
const schema = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'feedback.schema.json'), 'utf8'));

export const shapeOf = kind => `{${Object.keys(schema.properties[kind].items.properties).join(', ')}}`;

export const doors = [
  {
    name: 'structure',
    file: 'src/pages/Home/Structure.tsx',
    asks: 'what things are: the element chosen for the content, the landmarks and their names, the headings, the reading order with the styles off'
  },
  {
    name: 'presentation',
    file: 'src/pages/Home/Presentation.tsx',
    asks: 'how things show: structure in the component sheet, needs as shared words, the platform\'s own states before invented ones, constants in the sheet and only runtime values inline'
  },
  {
    name: 'dynamic-interaction',
    file: 'src/pages/Home/DynamicInteraction.tsx',
    asks: 'how things respond: state that holds only what cannot be derived, events named for what happened, pure transitions, the platform\'s behaviour before script, a keyboard twin for every gesture, changes that announce themselves'
  }
];

export const tests = {
  name: 'tests',
  file: 'scripts/review/tests.md',
  asks: 'what a test is for: readable, worth having, pinning behaviour and not implementation, at the right level, against the real thing, and whether a test is missing; Beck\'s properties for unit tests, Dodds\' practice for component specs, Fowler\'s journeys and Playwright\'s practices for e2e, Fowler\'s page objects beside their owner'
};

export const design = {
  name: 'design',
  file: 'scripts/review/design.md',
  asks: 'how the code is shaped so that change stays cheap: where a thing lives on the app continuum, what the types allow and forbid, and how failure travels on the two tracks of a Result; a functional core under an imperative shell'
};

export const halves = {
  tests: 'The tests are the spec files (*.spec.* and *.test.*), everything under e2e/, every __test_support/ directory and src/test-support/.',
  site: 'The site is everything else in the scope: pages, components, sheets and all that ships.'
};

export const reading = ['Read', 'Grep', 'Glob', 'Bash(git diff:*)', 'Bash(git log:*)'];

const half = name => name === tests.name
  ? `${halves.tests} ${halves.site} You review the tests. Read the code under test for context and for what no test pins; the only finding you make on the site is that a test is missing.`
  : `${halves.site} ${halves.tests} You review the site. The tests are the tests QA's: read a spec only for context and report nothing on it.`;

export const qaOf = ({name, file, asks}) => ({
  description: `Reviews code against the ${name} door of the home page: ${asks}.`,
  prompt: [
    values,
    '## Your door',
    `You hold the ${name} door. Read ${file} first and whole; it is your rubric, in the author's words. Review only what that door asks about: ${asks}.`,
    `The lead tells you the scope. ${half(name)} Read every file in your half whole, and any other file it leans on when you need the context.`,
    `Answer in the feedback stance with one JSON object {plusses, deltas} and nothing else: each plus ${shapeOf('plusses')}, each delta ${shapeOf('deltas')}. Your door is the door of every plus and delta you make.`
  ].join('\n\n'),
  tools: reading,
  model: 'opus',
  maxTurns: 60
});

export const qaNames = [...doors, design, tests].map(({name}) => `${name}-qa`);

export const agents = () => Object.fromEntries([...doors, design, tests].map(door => [`${door.name}-qa`, qaOf(door)]));

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(JSON.stringify(agents()));
}
