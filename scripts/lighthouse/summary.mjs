import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

const floorsFor = (url, {ci}) => {
  const matching = ci.assert.assertMatrix.find(({matchingUrlPattern}) => new RegExp(matchingUrlPattern).test(url));
  return Object.fromEntries(categories.map(category => {
    const rule = matching?.assertions[`categories:${category}`];
    return [category, Array.isArray(rule) ? rule[1].minScore : undefined];
  }));
};

const percent = (score) => `${Math.round(score * 100)}`;

const range = (runs, category) => {
  const scores = runs.map(({summary}) => summary[category]);
  const low = Math.min(...scores);
  const high = Math.max(...scores);
  return low === high ? percent(low) : `${percent(low)} to ${percent(high)}`;
};

export const scoreTable = (runs, floors) => {
  const representative = runs.find(({isRepresentativeRun}) => isRepresentativeRun) ?? runs[0];
  const rows = categories.map(category => {
    const score = representative.summary[category];
    const floor = floors[category];
    const held = floor === undefined ? '' : score >= floor ? 'holds' : 'below the floor';
    return `| ${category} | ${percent(score)} | ${range(runs, category)} | ${floor === undefined ? '' : percent(floor)} | ${held} |`;
  });
  return ['| category | score | across runs | floor | |', '| --- | ---: | ---: | ---: | --- |', ...rows].join('\n');
};

export const failuresList = (results) => {
  const failed = results.filter(({passed}) => !passed);
  if (failed.length === 0) {
    return '';
  }
  return ['', '### what fell short', '', ...failed.map(({auditId, auditTitle, expected, actual, operator}) =>
    `- **${auditId}** ${auditTitle ?? ''}: ${actual} ${operator} ${expected} expected`)].join('\n');
};

export const summaryOf = ({page, runs, rc, results = []}) => {
  const [{url}] = runs;
  return [
    `## lighthouse: ${page}`,
    '',
    `\`${url}\`, ${runs.length} run${runs.length === 1 ? '' : 's'}; the representative run counts.`,
    '',
    scoreTable(runs, floorsFor(url, rc)),
    failuresList(results),
    ''
  ].join('\n');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , page, resultsPath] = process.argv;
  const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
  const assertions = join(resultsPath, 'assertion-results.json');
  process.stdout.write(summaryOf({
    page,
    runs: read(join(resultsPath, 'manifest.json')),
    rc: read('lighthouserc.json'),
    results: existsSync(assertions) ? read(assertions) : []
  }));
}
