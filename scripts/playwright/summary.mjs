import {empty, maybe} from '@ryandur/sand';
import {readFileSync} from 'node:fs';

const saidBy = results => maybe(results.map(({error}) => maybe(error).mBind(({message}) => maybe(message)).orElse(''))
  .find(message => message !== '')).orElse('');

const outcomesOf = (spec, path) => maybe(spec.tests).orElse([]).map(test => ({
  title: [...path, spec.title].join(' › '),
  browser: test.projectName,
  status: test.status,
  said: saidBy(maybe(test.results).orElse([]))
}));

const outcomesUnder = (suite, path) => [
  ...maybe(suite.specs).orElse([]).flatMap(spec => outcomesOf(spec, path)),
  ...maybe(suite.suites).orElse([]).flatMap(describe => outcomesUnder(describe, [...path, describe.title]))
];

export const outcomesIn = report => maybe(report.suites).orElse([]).flatMap(file => outcomesUnder(file, []));

const counted = (outcomes, status) => outcomes.filter(outcome => outcome.status === status).length;

export const countTable = outcomes => {
  const browsers = [...new Set(outcomes.map(({browser}) => browser))];
  const rows = browsers.map(browser => {
    const own = outcomes.filter(outcome => outcome.browser === browser);
    return `| ${browser} | ${counted(own, 'expected')} | ${counted(own, 'unexpected')} | ${counted(own, 'flaky')} | ${counted(own, 'skipped')} |`;
  });
  return ['| browser | passed | failed | flaky | skipped |', '| --- | ---: | ---: | ---: | ---: |', ...rows].join('\n');
};

const firstLine = said => maybe(said.split('\n').map(line => line.trim()).find(line => line !== '')).orElse('');

export const failuresList = outcomes => {
  const fell = outcomes.filter(({status}) => status === 'unexpected');
  if (empty(fell)) {
    return '';
  }
  return ['', '### what fell short', '', ...fell.map(({title, browser, said}) =>
    `- **${title}** in ${browser}: ${firstLine(said)}`)].join('\n');
};

export const summaryOf = (name, report) => {
  const outcomes = outcomesIn(report);
  const verdict = counted(outcomes, 'unexpected') === 0 ? 'every one passed' : `${counted(outcomes, 'unexpected')} fell short`;
  return [`## ${name}: ${outcomes.length} tests, ${verdict}`, '', countTable(outcomes), failuresList(outcomes), ''].join('\n');
};

if (import.meta.main) {
  const [, , name, reportPath] = process.argv;
  process.stdout.write(summaryOf(name, JSON.parse(readFileSync(reportPath, 'utf8'))));
}
