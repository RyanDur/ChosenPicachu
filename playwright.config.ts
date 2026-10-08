import {defineConfig} from '@playwright/test';
import {empty, has} from '@ryandur/sand';

const stage = 'http://localhost:4517/ChosenPicachu/';
const smoke = '**/smoke.e2e.ts';
// it reads served HTML through the request fixture and opens no browser, so one engine's run covers it
const browserless = '**/names.e2e.ts';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  testIgnore: smoke,
  retries: 0,
  workers: has(process.env.CI) ? 2 : undefined,
  timeout: 60_000,
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
    {name: 'chromium', use: {browserName: 'chromium'}},
    {name: 'firefox', use: {browserName: 'firefox'}, testIgnore: [smoke, browserless]},
    {name: 'webkit', use: {browserName: 'webkit'}, testIgnore: [smoke, browserless]}
  ]
});
