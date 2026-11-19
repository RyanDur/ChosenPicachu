const {defineConfig} = require('@playwright/test');
const {empty, has, maybe} = require('@ryandur/sand');

const {assertionPatience} = require('./e2e/__test_support/patience.json');
const devices = require('./e2e/__test_support/devices.json');
const stage = `http://localhost:${maybe(process.env.STAGE_PORT).orElse(4517)}/ChosenPicachu/`;
const smoke = '**/smoke.e2e.ts';
// it reads served HTML through the request fixture and opens no browser, so one engine's run covers it
const browserless = '**/names.e2e.ts';
// WebKit stalls the next page load after a worker has run every a11y page, so those pages get workers of their own
const a11y = '**/a11y.e2e.ts';
const readers = Object.entries(devices);
// a lookahead, so @phone doesn't also catch @phoneSideways
/** @param {string} reader */
const taggedFor = reader => new RegExp(`@${reader}(?![\\w-])`);
const taggedForAnyReader = taggedFor(`(${readers.map(([reader]) => reader).join('|')})`);
/** @typedef {import('@playwright/test').PlaywrightWorkerOptions['browserName']} BrowserName */
/** @type {{browserName: BrowserName, testIgnore: string | string[]}[]} */
const engines = [
  {browserName: 'chromium', testIgnore: smoke},
  {browserName: 'firefox', testIgnore: [smoke, browserless]},
  {browserName: 'webkit', testIgnore: [smoke, browserless, a11y]}
];

module.exports = defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  testIgnore: smoke,
  retries: 0,
  workers: has(process.env.CI) ? 2 : undefined,
  timeout: 60_000,
  expect: {timeout: assertionPatience},
  use: {
    baseURL: stage,
    contextOptions: {reducedMotion: 'reduce'},
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node scripts/lighthouse/server.mjs',
    url: stage,
    reuseExistingServer: empty(process.env.CI)
  },
  projects: [
    ...engines.flatMap(({browserName, testIgnore}) => [
      {name: browserName, use: {browserName}, testIgnore, grepInvert: taggedForAnyReader},
      ...readers.map(([reader, device]) => ({
        name: `${browserName}, ${reader}`,
        use: {browserName, ...device},
        testIgnore,
        grep: taggedFor(reader)
      }))
    ]),
    {name: 'webkit-a11y', use: {browserName: 'webkit'}, testMatch: a11y}
  ]
});
