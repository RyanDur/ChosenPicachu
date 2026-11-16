const {defineConfig} = require('@playwright/test');
const {maybe} = require('@ryandur/sand');

module.exports = defineConfig({
  testDir: './e2e',
  testMatch: '**/smoke.e2e.ts',
  retries: 2,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: maybe(process.env.SMOKE_URL).orElse('https://ryandur.github.io/ChosenPicachu/'),
    trace: 'on-first-retry'
  },
  projects: [
    {name: 'chromium', use: {browserName: 'chromium'}},
    {name: 'firefox', use: {browserName: 'firefox'}},
    {name: 'webkit', use: {browserName: 'webkit'}}
  ]
});
