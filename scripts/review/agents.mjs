import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {not} from '@ryandur/sand';

const values = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'values.md'), 'utf8');
const schema = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'feedback.schema.json'), 'utf8'));

const leadsOwn = ['habit'];

export const shapeOf = kind => `{${Object.keys(schema.properties[kind].items.properties).filter(key => not(leadsOwn.includes(key))).join(', ')}}`;

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @param {string} markdown */
export const reviewersIn = markdown => {
  const listed = markdown.indexOf('\n## Reviewers');
  if (listed === -1) {
    throw new Error('AGENTS.md names no reviewers: it has no "## Reviewers" section');
  }
  return markdown.slice(listed).split('\n### ').slice(1).map(section => {
    const [name, ...lines] = section.split('\n');
    const field = key => (lines.find(line => line.startsWith(`- ${key}: `)) ?? '').slice(`- ${key}: `.length);
    return {
      name: name.trim(),
      file: field('rubric').replaceAll('`', ''),
      reviews: field('reviews').replace(/^the /, ''),
      scopes: field('scopes').split(',').map(scope => scope.trim()),
      asks: field('asks')
    };
  });
};

export const reviewers = reviewersIn(readFileSync(join(root, 'AGENTS.md'), 'utf8'));

export const halves = {
  tests: 'The tests are the spec files (*.spec.* and *.test.*), everything under e2e/, and every __test_support/ directory.',
  site: 'The site is everything else in the scope: pages, components, sheets and all that ships.'
};

export const reading = ['Read', 'Grep', 'Glob', 'Bash(git diff:*)', 'Bash(git log:*)'];

const half = reviews => reviews === 'tests'
  ? `${halves.tests} ${halves.site} You review the tests. Read the code under test for context and for what no test pins; the only finding you make on the site is that a test is missing.`
  : `${halves.site} ${halves.tests} You review the site. The tests are the tests QA's: read a spec only for context and report nothing on it.`;

export const qaOf = ({name, file, reviews, asks}) => ({
  description: `Reviews code against the ${name} door of the home page: ${asks}.`,
  prompt: [
    values,
    '## Your door',
    `You hold the ${name} door. Read ${file} first and whole; it is your rubric, in the author's words. Review only what that door asks about: ${asks}.`,
    `The lead tells you the scope. ${half(reviews)} Read every file in your half whole, and any other file it leans on when you need the context.`,
    `Answer in the feedback stance with one JSON object {plusses, deltas} and nothing else: each plus ${shapeOf('plusses')}, each delta ${shapeOf('deltas')}. Your door is the door of every plus and delta you make.`
  ].join('\n\n'),
  tools: reading,
  model: 'opus',
  maxTurns: 60
});

export const qaNames = reviewers.map(({name}) => `${name}-qa`);

export const agents = () => Object.fromEntries(reviewers.map(reviewer => [`${reviewer.name}-qa`, qaOf(reviewer)]));

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(JSON.stringify(agents()));
}
