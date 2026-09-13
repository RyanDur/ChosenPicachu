import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {failuresList, foldOf, pageTable, scoreTable, summaryOf} from '../lighthouse/summary.mjs';

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

  test('a page folds its runs behind its name, with the floors from the rc entry whose pattern matches the url', () => {
    const fold = foldOf({page: 'demos', runs, rc});
    expect(fold).toMatch(/^<details><summary>demos · http:\/\/localhost:4517\/ChosenPicachu\/demos\/, 3 runs<\/summary>/);
    expect(fold).toContain('| accessibility | 100 | 96 to 100 | 100 | holds |');
    expect(fold).not.toContain('what fell short');
    expect(fold).toMatch(/<\/details>$/);
  });

  test('every page is a row of representative scores, a score under its floor naming the floor', () => {
    const table = pageTable([
      {page: 'demos', runs, rc},
      {page: 'gallery', runs: [run({performance: 0.8, accessibility: 1, 'best-practices': 1, seo: 1}, true)], rc},
      {page: 'users'}
    ]);
    expect(table).toContain('| page | performance | accessibility | best-practices | seo |');
    expect(table).toContain('| demos | 92 | 100 | 100 | 100 |');
    expect(table).toContain('| gallery | 80 (floor 85) | 100 | 100 | 100 |');
    expect(table).toContain('| users | the audit did not run |  |  |  |');
  });

  test('the run summary is the table of pages, then a fold for each page that was audited', () => {
    const summary = summaryOf([{page: 'demos', runs, rc}, {page: 'users'}]);
    expect(summary).toContain('## lighthouse');
    expect(summary.indexOf('| demos | 92 |')).toBeLessThan(summary.indexOf('<details><summary>demos'));
    expect(summary).not.toContain('<details><summary>users');
  });

  test('node reads the downloaded reports the way the workflow lays them out, one directory per page', () => {
    const reports = mkdtempSync(join(tmpdir(), 'lighthouse-reports-'));
    mkdirSync(join(reports, 'lighthouse-demos'));
    writeFileSync(join(reports, 'lighthouse-demos', 'manifest.json'), JSON.stringify(runs));

    const printed = execFileSync(process.execPath, ['--import', './scripts/node/imports-like-vite.mjs', 'scripts/lighthouse/summary.mjs', reports], {encoding: 'utf8'});

    expect(printed).toContain('| demos | 92 | 100 | 100 | 100 |');
    expect(printed).toContain('| home | the audit did not run |  |  |  |');
    expect(printed).toContain('<details><summary>demos ·');
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
