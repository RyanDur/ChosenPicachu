import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {audited} from './audited.mjs';

const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

const floorsFor = (url, {ci}) => {
  const matching = ci.assert.assertMatrix.find(({matchingUrlPattern}) => new RegExp(matchingUrlPattern).test(url));
  return Object.fromEntries(categories.map(category => {
    const rule = matching?.assertions[`categories:${category}`];
    return [category, Array.isArray(rule) ? rule[1].minScore : undefined];
  }));
};

const percent = score => `${Math.round(score * 100)}`;

const range = (runs, category) => {
  const scores = runs.map(({summary}) => summary[category]);
  const low = Math.min(...scores);
  const high = Math.max(...scores);
  return low === high ? percent(low) : `${percent(low)} to ${percent(high)}`;
};

const representativeOf = runs => runs.find(({isRepresentativeRun}) => isRepresentativeRun) ?? runs[0];

export const scoreTable = (runs, floors) => {
  const representative = representativeOf(runs);
  const rows = categories.map(category => {
    const score = representative.summary[category];
    const floor = floors[category];
    const held = floor === undefined ? '' : score >= floor ? 'holds' : 'below the floor';
    return `| ${category} | ${percent(score)} | ${range(runs, category)} | ${floor === undefined ? '' : percent(floor)} | ${held} |`;
  });
  return ['| category | score | across runs | floor | |', '| --- | ---: | ---: | ---: | --- |', ...rows].join('\n');
};

export const failuresList = results => {
  const failed = results.filter(({passed}) => !passed);
  if (failed.length === 0) {
    return '';
  }
  return ['', '### what fell short', '', ...failed.map(({auditId, auditTitle, expected, actual, operator}) =>
    `- **${auditId}** ${auditTitle ?? ''}: ${actual} ${operator} ${expected} expected`)].join('\n');
};

export const foldOf = ({page, runs, rc, results = []}) => {
  const [{url}] = runs;
  return [
    `<details><summary>${page} · ${url}, ${runs.length} run${runs.length === 1 ? '' : 's'}</summary>`,
    '',
    scoreTable(runs, floorsFor(url, rc)),
    failuresList(results),
    '',
    '</details>'
  ].join('\n');
};

const cell = (score, floor) =>
  floor !== undefined && score < floor ? `${percent(score)} (floor ${percent(floor)})` : percent(score);

const rowOf = ({page, runs, rc}) => {
  if (runs === undefined) {
    return `| ${page} | the audit did not run |  |  |  |`;
  }
  const {summary} = representativeOf(runs);
  const floors = floorsFor(runs[0].url, rc);
  return `| ${page} | ${categories.map(category => cell(summary[category], floors[category])).join(' | ')} |`;
};

export const pageTable = pages =>
  ['| page | performance | accessibility | best-practices | seo |', '| --- | ---: | ---: | ---: | ---: |', ...pages.map(rowOf)].join('\n');

export const summaryOf = pages => [
  '## lighthouse',
  '',
  'The representative run of each page counts. Open a page for the spread across runs and what fell short.',
  '',
  pageTable(pages),
  '',
  pages.filter(({runs}) => runs !== undefined).map(foldOf).join('\n\n'),
  ''
].join('\n');

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , reportsDir] = process.argv;
  const read = file => JSON.parse(readFileSync(file, 'utf8'));
  const rc = read('lighthouserc.json');
  const reported = page => {
    const manifest = join(reportsDir, `lighthouse-${page}`, 'manifest.json');
    const assertions = join(reportsDir, `lighthouse-${page}`, 'assertion-results.json');
    return existsSync(manifest)
      ? {page, runs: read(manifest), rc, results: existsSync(assertions) ? read(assertions) : []}
      : {page};
  };
  process.stdout.write(summaryOf(audited().map(({page}) => reported(page))));
}
