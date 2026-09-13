import {countTable, failuresList, outcomesIn, summaryOf} from '../playwright/summary.mjs';

const outcome = (projectName, status, message) => ({projectName, status, results: [{status, error: message === undefined ? undefined : {message}}]});

const report = {
  suites: [{
    title: 'a11y.e2e.ts',
    file: 'a11y.e2e.ts',
    specs: [
      {title: 'the home page has no accessibility violations', tests: [outcome('chromium', 'expected'), outcome('webkit', 'expected')]},
      {title: 'the feed dot glows live', tests: [outcome('chromium', 'unexpected', 'Error: expect(received).toBe(expected)\n\nExpected: "rgb(180, 219, 192)"')]}
    ],
    suites: [{
      title: 'the price card',
      specs: [{title: 'wears its ink', tests: [outcome('chromium', 'flaky'), outcome('webkit', 'skipped')]}]
    }]
  }]
};

describe('the playwright summary', () => {
  test('every test is found, however deep the suite, named by its path', () => {
    const outcomes = outcomesIn(report);
    expect(outcomes).toHaveLength(5);
    expect(outcomes.map(({title}) => title)).toContain('the price card › wears its ink');
  });

  test('the counts stand by browser', () => {
    const table = countTable(outcomesIn(report));
    expect(table).toContain('| chromium | 1 | 1 | 1 | 0 |');
    expect(table).toContain('| webkit | 1 | 0 | 0 | 1 |');
  });

  test('what fell short is listed with the first line of its error', () => {
    expect(failuresList(outcomesIn(report))).toContain('- **the feed dot glows live** in chromium: Error: expect(received).toBe(expected)');
  });

  test('nothing fell short reads as every one passed', () => {
    const clean = {suites: [{title: 'a.e2e.ts', file: 'a.e2e.ts', specs: [{title: 'stands', tests: [outcome('chromium', 'expected')]}]}]};
    expect(summaryOf('journeys', clean)).toContain('## journeys: 1 tests, every one passed');
    expect(summaryOf('journeys', clean)).not.toContain('what fell short');
  });

  test('the heading counts what fell short', () => {
    expect(summaryOf('smoke', report)).toContain('## smoke: 5 tests, 1 fell short');
  });
});
