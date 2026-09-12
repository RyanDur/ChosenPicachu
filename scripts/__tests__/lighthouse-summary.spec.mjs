import {failuresList, scoreTable, summaryOf} from '../lighthouse/summary.mjs';

const rc = {ci: {assert: {assertMatrix: [
  {matchingUrlPattern: '.*/gallery/.*', assertions: {'categories:performance': ['error', {minScore: 0.85}], 'categories:seo': ['error', {minScore: 0.92}]}},
  {matchingUrlPattern: '^((?!/gallery/).)*$', assertions: {'categories:performance': ['error', {minScore: 0.85}], 'categories:accessibility': ['error', {minScore: 1}]}}
]}}};

const run = (summary, isRepresentativeRun = false) =>
  ({url: 'http://localhost:4517/ChosenPicachu/demos/', isRepresentativeRun, summary});

const runs = [
  run({performance: 0.75, accessibility: 1, 'best-practices': 1, seo: 1}),
  run({performance: 0.92, accessibility: 1, 'best-practices': 1, seo: 1}, true),
  run({performance: 0.88, accessibility: 0.96, 'best-practices': 1, seo: 1})
];

describe('the lighthouse summary', () => {
  test('the representative run scores, with the spread across runs and the floor beside it', () => {
    const table = scoreTable(runs, {performance: 0.85, accessibility: 1});
    expect(table).toContain('| performance | 92 | 75 to 92 | 85 | holds |');
    expect(table).toContain('| accessibility | 100 | 96 to 100 | 100 | holds |');
    expect(table).toContain('| best-practices | 100 | 100 |  |  |');
  });

  test('a score under its floor says so', () => {
    const table = scoreTable([run({performance: 0.8, accessibility: 1, 'best-practices': 1, seo: 1}, true)], {performance: 0.85});
    expect(table).toContain('| performance | 80 | 80 | 85 | below the floor |');
  });

  test('the floors come from the rc entry whose pattern matches the url', () => {
    const summary = summaryOf({page: 'demos', runs, rc});
    expect(summary).toContain('## lighthouse: demos');
    expect(summary).toContain('`http://localhost:4517/ChosenPicachu/demos/`, 3 runs');
    expect(summary).toContain('| accessibility | 100 | 96 to 100 | 100 | holds |');
    expect(summary).not.toContain('what fell short');
  });

  test('failed assertions are listed by audit', () => {
    const list = failuresList([
      {auditId: 'target-size', auditTitle: 'Touch targets have sufficient size', passed: false, expected: 1, actual: 0.9, operator: '>='},
      {auditId: 'categories:seo', passed: true, expected: 0.92, actual: 1, operator: '>='}
    ]);
    expect(list).toContain('### what fell short');
    expect(list).toContain('- **target-size** Touch targets have sufficient size: 0.9 >= 1 expected');
    expect(list).not.toContain('categories:seo');
  });
});
