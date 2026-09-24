import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promptFor} from '../review/prompt.mjs';
import {deltaOf, leavesFeedback, plusOf, reviewIn, summaryOf, verdictOf} from '../review/report.mjs';
import {aDelta, aPlus, aSummary, review} from '../review/__test_support/feedback.mjs';

const placeOf = (text, needle) => {
  expect(text).toContain(needle);
  return text.indexOf(needle);
};

const answer = review => JSON.stringify({type: 'result', structured_output: review});

const feedbackSchema = () => JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../review/feedback.schema.json'), 'utf8'));

const violation = aDelta({door: 'structure', severity: 'violation', file: 'src/a.tsx', line: 3, happened: 'a div wraps a list'});
const concern = aDelta({
  door: 'presentation',
  severity: 'concern',
  file: 'src/b.css',
  line: 9,
  happened: 'a tag selector styles a button',
  why: 'every button on the site now wears it',
  change: 'give the button a class that names it',
  principle: 'Tag selectors are for resets only'
});
const note = aDelta({
  door: 'structure',
  happened: 'a section has no heading',
  change: 'name the section with a heading',
  principle: 'Sections name themselves through their headings'
});
const testNote = aDelta({door: 'tests', file: 'src/__tests__/c.spec.tsx', line: 4});
const interaction = aDelta({door: 'dynamic interaction'});
const design = aDelta({door: 'design', severity: 'concern'});
const plus = aPlus({
  door: 'structure',
  file: 'src/f.tsx',
  line: 5,
  happened: 'the friends list is a fieldset with a legend',
  why: 'the group names itself and the platform hands the name to a reader',
  principle: 'The right tag hands most of that over for free'
});
const testPlus = aPlus({door: 'tests'});

describe('the review prompt', () => {
  test('a full review sends the reviewer to the doors on the home page and scopes them to the whole of src', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('src/pages/Home/Structure.tsx');
    expect(prompt).toContain('src/pages/Home/Presentation.tsx');
    expect(prompt).toContain('src/pages/Home/DynamicInteraction.tsx');
    expect(prompt).toContain('The scope is the whole of src/');
  });

  test('a review of the changes names the two commits to diff', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('git diff abc def');
    expect(prompt).toContain('git log abc..def');
  });

  test('an unknown scope is refused by name', () => {
    expect(() => promptFor({scope: 'some'})).toThrow('no review scope named "some"; the scopes are full, changes, tests and design');
  });

  test('a design review asks the design QA alone for the whole site', () => {
    const prompt = promptFor({scope: 'design'});
    expect(prompt).toContain('scripts/review/design.md');
    expect(prompt).toContain('The scope is the whole site half');
    expect(prompt).toContain('Only design-qa has a half in this scope');
  });

  test('a review of the tests asks the tests QA alone', () => {
    const prompt = promptFor({scope: 'tests'});
    expect(prompt).toContain('The scope is every test in the app');
    expect(prompt).toContain('Only tests-qa has a half in this scope');
    expect(prompt).not.toContain('structure-qa');
  });

  test('a review of the changes sends all five QAs', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('five QAs hold one door each: structure-qa, presentation-qa, dynamic-interaction-qa, design-qa, tests-qa');
  });

  test('the review answers in the feedback stance: a summary, then plusses and deltas, each with what happened and why', () => {
    const prompt = promptFor({scope: 'changes', before: 'abc', after: 'def'});
    expect(prompt).toContain('the deltas ranked from what matters most to what matters least, one line each with the place, the cost and the change');
    expect(prompt).toContain('then held, one line; then deferred, one line, only if something was');
    expect(prompt).toContain('You take a feedback stance: plusses and deltas, each with its why.');
    expect(prompt).toContain('A **plus** is a choice in the code that holds a door up.');
    expect(prompt).toContain('A **delta** is a finding: something to change.');
    expect(prompt).toContain('Answer in the feedback stance');
  });

  test('the review is asked to write plainly, naming things and never narrating itself', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('One idea per sentence, and a sentence stays under twenty words.');
    expect(prompt).toContain('Name things by their names: the token, the test, the file, the class.');
    expect(prompt).toContain('Nothing about how the review was made');
  });

  test('the review carries the numbered writing rules: no em dashes, no metaphor nouns, no personified code, whole sentences', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('## How you write');
    expect(prompt).toContain('13. **No em dashes.**');
    expect(prompt).toContain('26. **No metaphor nouns.**');
    expect(prompt).toContain('32. **No mannered prose.**');
    expect(prompt).toContain('33. **Whole sentences.**');
    expect(placeOf(prompt, '## How you write')).toBeLessThan(placeOf(prompt, '## Your part'));
  });

  test('a violation carries a trace to what a person would see, or it is a concern', () => {
    expect(promptFor({scope: 'full'})).toContain('a delta whose trace you cannot make is a **concern**');
  });

  test('a delta the author recorded as not taken is answered by name, not raised again', () => {
    expect(promptFor({scope: 'full'})).toContain('answer that reason by name: accept it, or rebut it');
  });

  test('every entry says whether it stands on what was read or on an inference, and code is never evidence of its own intent', () => {
    const prompt = promptFor({scope: 'full'});
    expect(prompt).toContain('Every entry says what it stands on.');
    expect(prompt).toContain('Code is evidence of what it does, never of why it exists.');
    expect(prompt).toContain('A violation stands on what you read.');
    expect(prompt).toContain('A reason a commit message gives is a claim to check, not a conclusion to confirm.');
  });
});

describe('the review report', () => {
  test('reads the plusses and deltas the reviewer structured', () => {
    const summary = aSummary({ranked: [{file: 'src/a.tsx', line: 3, cost: 'a div wraps a list.', change: 'Drop the div.'}]});
    expect(reviewIn(answer(review([plus], [note], summary)))).toEqual({tldr: summary, plusses: [plus], deltas: [note]});
  });

  test('a review with neither plusses nor deltas is still read', () => {
    expect(reviewIn(answer(review([], [], aSummary({held: 'nothing to say'}))))).toEqual({tldr: aSummary({held: 'nothing to say'}), plusses: [], deltas: []});
  });

  test('an answer without a summary is refused', () => {
    expect(() => reviewIn(JSON.stringify({type: 'result', structured_output: {plusses: [], deltas: []}})))
      .toThrow('structured output is missing');
    expect(() => reviewIn(JSON.stringify({type: 'result', structured_output: {tldr: 'prose', plusses: [], deltas: []}})))
      .toThrow('structured output is missing');
  });

  test('an answer without structured plusses and deltas is refused', () => {
    expect(() => reviewIn(JSON.stringify({
      type: 'result',
      result: 'prose'
    }))).toThrow('structured output is missing');
    expect(() => reviewIn(JSON.stringify({
      type: 'result',
      structured_output: {findings: []}
    }))).toThrow('structured output is missing');
  });

  test('no deltas reads as the code holding up, with the plusses still told', () => {
    const summary = summaryOf(review([plus], [], aSummary({held: 'All of it holds.'})));
    expect(summary).toContain('## The code holds up the home page');
    expect(summary).toContain('**Held:** All of it holds.');
    expect(summary).toContain('1 plus, no deltas.');
    expect(summary).toContain('the friends list is a fieldset with a legend');
  });

  test('the summary ranks the deltas one line each, place then cost then change, before any entry opens', () => {
    const summary = summaryOf(review([plus], [violation, concern], aSummary({
      ranked: [
        {file: 'src/a.tsx', line: 3, cost: 'a reader is told of a list twice.', change: 'Drop the div.'},
        {file: 'src/b.css', line: 9, cost: 'every button wears the rule.', change: 'Name the button.'}
      ],
      held: 'The list markup holds.'
    })));
    expect(placeOf(summary, '1. `src/a.tsx:3`. A reader is told of a list twice. Drop the div.'))
      .toBeLessThan(placeOf(summary, '2. `src/b.css:9`. Every button wears the rule. Name the button.'));
    expect(placeOf(summary, '**Held:** The list markup holds.')).toBeLessThan(placeOf(summary, '<details>'));
  });

  test('a deferred line follows what held only when something was deferred', () => {
    expect(summaryOf(review([], [note], aSummary({deferred: 'The accordions are the author\'s.'})))).toContain('**Deferred:** The accordions are the author\'s.');
    expect(summaryOf(review([], [note]))).not.toContain('**Deferred:**');
  });

  test('a ranked place links to the line at the reviewed commit when the commit is known', () => {
    const summary = summaryOf(review([], [violation], aSummary({ranked: [{file: 'src/a.tsx', line: 3, cost: 'a cost.', change: 'a change.'}]})), {commit: {repository: 'RyanDur/ChosenPicachu', sha: 'abc123'}});
    expect(summary).toContain('1. [`src/a.tsx:3`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/a.tsx#L3). A cost. a change.');
  });

  test('the summary stays words on the page', () => {
    expect(summaryOf(review([], [note], aSummary({held: 'wrap it in <b>bold</b>'})))).toContain('wrap it in &lt;b&gt;bold&lt;/b&gt;');
  });

  test('plusses and deltas are counted, deltas by severity', () => {
    expect(summaryOf(review([plus, testPlus], [testNote, note, concern, violation, interaction])))
      .toContain('2 plusses. 1 violation, 1 concern, 3 notes.');
  });

  test('a review with no plusses says so and opens no Plusses section', () => {
    const summary = summaryOf(review([], [note]));
    expect(summary).toContain('0 plusses. 1 note.');
    expect(summary).not.toContain('### Plusses');
  });

  test('deltas are grouped by door, worst door and worst delta first', () => {
    const summary = summaryOf(review([], [testNote, note, concern, violation, interaction, design]));
    expect(placeOf(summary, '#### structure')).toBeLessThan(placeOf(summary, '#### presentation'));
    expect(placeOf(summary, '#### presentation')).toBeLessThan(placeOf(summary, '#### dynamic interaction'));
    expect(placeOf(summary, '#### dynamic interaction')).toBeLessThan(placeOf(summary, '#### design'));
    expect(placeOf(summary, '#### design')).toBeLessThan(placeOf(summary, '#### tests'));
    expect(placeOf(summary, 'a div wraps a list')).toBeLessThan(placeOf(summary, 'a section has no heading'));
  });

  test('plusses come before the deltas, each under its door, so the headings nest the same way on both sides', () => {
    const summary = summaryOf(review([testPlus, plus], [design]));
    expect(placeOf(summary, '### Plusses')).toBeLessThan(placeOf(summary, '#### structure'));
    expect(placeOf(summary, '#### structure')).toBeLessThan(placeOf(summary, '#### tests'));
    expect(placeOf(summary, '#### tests')).toBeLessThan(placeOf(summary, '### Deltas'));
    expect(placeOf(summary, '### Deltas')).toBeLessThan(placeOf(summary, '#### design'));
  });

  test('a delta folds away under its mark and place, and opens on where, what happened, why it matters, the change, and the door\'s words', () => {
    const entry = deltaOf(concern);
    expect(entry).toMatch(/^<details><summary>▲ concern · src\/b\.css:9<\/summary>\n/);
    expect(entry).toMatch(/\n<\/details>$/);
    expect(placeOf(entry, '**Where:** `src/b.css:9`')).toBeLessThan(placeOf(entry, '**What happened:**'));
    expect(placeOf(entry, '**What happened:** a tag selector styles a button')).toBeLessThan(placeOf(entry, '**Why it matters:** every button on the site now wears it'));
    expect(placeOf(entry, '**Why it matters:**')).toBeLessThan(placeOf(entry, '**Change:** give the button a class that names it'));
    expect(entry).toContain('> Tag selectors are for resets only');
  });

  test('a plus folds away under its place, and opens on where, what happened, why it works, and the door\'s words', () => {
    const entry = plusOf(plus);
    expect(entry).toMatch(/^<details><summary>\+ src\/f\.tsx:5<\/summary>\n/);
    expect(entry).toMatch(/\n<\/details>$/);
    expect(placeOf(entry, '**Where:** `src/f.tsx:5`')).toBeLessThan(placeOf(entry, '**What happened:**'));
    expect(placeOf(entry, '**What happened:** the friends list is a fieldset with a legend')).toBeLessThan(placeOf(entry, '**Why it works:** the group names itself'));
    expect(entry).toContain('> The right tag hands most of that over for free');
  });

  test('the place links to the line at the reviewed commit when the commit is known', () => {
    const commit = {repository: 'RyanDur/ChosenPicachu', sha: 'abc123'};
    const summary = summaryOf(review([plus], [violation, testNote]), {commit});
    expect(summary).toContain('[`src/a.tsx:3`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/a.tsx#L3)');
    expect(summary).toContain('[`src/f.tsx:5`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/f.tsx#L5)');
    expect(summary).toContain('[`src/__tests__/c.spec.tsx:4`](https://github.com/RyanDur/ChosenPicachu/blob/abc123/src/__tests__/c.spec.tsx#L4)');
  });

  test('what the reviewer checked folds away under the entry', () => {
    expect(deltaOf({
      ...note,
      checked: 'read the file whole'
    })).toContain('**Change:** name the section with a heading\n\n<details><summary>what was checked</summary>\n\nread the file whole\n\n</details>\n\n> Sections');
    expect(plusOf({
      ...plus,
      checked: 'read the legend'
    })).toContain('<details><summary>what was checked</summary>\n\nread the legend\n\n</details>');
    expect(deltaOf(note)).not.toContain('what was checked');
    expect(plusOf(plus)).not.toContain('what was checked');
  });

  test('a place with a tag in its name stays words in the fold', () => {
    expect(deltaOf({...note, file: 'src/<odd>.tsx'}).split('\n')[0]).toContain('src/&lt;odd&gt;.tsx:1');
  });

  test('a tag the reviewer writes in any field stays words on the page, and a code span keeps its angle brackets', () => {
    const tagged = field => `${field} says <b>${field}</b> & more`;
    const escaped = field => `${field} says &lt;b&gt;${field}&lt;/b&gt; &amp; more`;
    const plusEntry = plusOf({
      ...plus,
      happened: tagged('happened'),
      why: tagged('why'),
      checked: tagged('checked'),
      principle: tagged('principle')
    });
    ['happened', 'why', 'checked', 'principle'].forEach(field => expect(plusEntry).toContain(escaped(field)));
    const deltaEntry = deltaOf({
      ...note,
      happened: tagged('happened'),
      why: tagged('why'),
      change: tagged('change'),
      checked: tagged('checked'),
      principle: tagged('principle')
    });
    ['happened', 'why', 'change', 'checked', 'principle'].forEach(field => expect(deltaEntry).toContain(escaped(field)));
    expect(plusEntry).not.toContain('<b>');
    expect(deltaEntry).not.toContain('<b>');
    expect(plusOf({
      ...plus,
      why: 'reads `<ul>` whole & <b>more</b>'
    })).toContain('reads `<ul>` whole &amp; &lt;b&gt;more&lt;/b&gt;');
  });

  test('every severity the schema allows has a mark in its fold', () => {
    feedbackSchema().$defs.severity['enum'].forEach(severity => {
      const fold = deltaOf({...note, severity}).split('\n')[0];
      expect(fold).toMatch(new RegExp(`^<details><summary>\\S ${severity} · `));
    });
  });

  test('an inferred entry says so beside its place', () => {
    expect(deltaOf({...concern, evidence: 'inferred'})).toMatch(/^<details><summary>▲ concern · src\/b\.css:9 · inferred<\/summary>\n/);
    expect(plusOf({...plus, evidence: 'inferred'})).toMatch(/^<details><summary>\+ src\/f\.tsx:5 · inferred<\/summary>\n/);
  });

  test('a review with plusses and no deltas still leaves its feedback on the commit, and an empty one leaves none', () => {
    expect(leavesFeedback(review([plus], []))).toBe(true);
    expect(leavesFeedback(review([], [note]))).toBe(true);
    expect(leavesFeedback(review([], []))).toBe(false);
  });

  test('the schema the review answers in names every field the report tells, and the doors and severities once', () => {
    const schema = feedbackSchema();
    expect(schema.required).toEqual(['tldr', 'plusses', 'deltas']);
    expect(schema.properties.tldr.required).toEqual(['ranked', 'held']);
    expect(schema.properties.tldr.properties.ranked.items.required).toEqual(['file', 'line', 'cost', 'change']);
    expect(Object.keys(schema.properties.tldr.properties)).toContain('deferred');
    expect(schema.properties.plusses.items.required).toEqual(expect.arrayContaining(['door', 'file', 'line', 'happened', 'why', 'evidence', 'principle']));
    expect(Object.keys(schema.properties.plusses.items.properties)).toContain('checked');
    expect(schema.properties.deltas.items.required).toEqual(expect.arrayContaining(['door', 'severity', 'file', 'line', 'happened', 'why', 'evidence', 'change', 'principle']));
    expect(Object.keys(schema.properties.deltas.items.properties)).toContain('checked');
    expect(schema.properties.plusses.items.properties.door).toEqual({$ref: '#/$defs/door'});
    expect(schema.properties.deltas.items.properties.door).toEqual({$ref: '#/$defs/door'});
    expect(schema.properties.deltas.items.properties.severity).toEqual({$ref: '#/$defs/severity'});
    expect(schema.properties.plusses.items.properties.evidence).toEqual({$ref: '#/$defs/evidence'});
    expect(schema.properties.deltas.items.properties.evidence).toEqual({$ref: '#/$defs/evidence'});
    expect(schema.$defs.door['enum']).toEqual(['structure', 'presentation', 'dynamic interaction', 'design', 'tests']);
    expect(schema.$defs.severity['enum']).toEqual(['violation', 'concern', 'note']);
    expect(schema.$defs.evidence['enum']).toEqual(['read', 'inferred']);
  });

  test('only a violation fails the job', () => {
    expect(verdictOf([note, concern])).toBe(0);
    expect(verdictOf([note, violation])).toBe(1);
  });
});
