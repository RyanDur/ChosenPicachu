import {defineConfig} from '@playwright/test';
import {empty, has} from '@ryandur/sand';

const stage = 'http://localhost:4517/ChosenPicachu/';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  testIgnore: '**/smoke.e2e.ts',
  retries: 2,
  workers: has(process.env.CI) ? 1 : undefined,
  timeout: 60_000,
  use: {
    baseURL: stage,
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'node scripts/lighthouse/server.mjs',
    url: stage,
    reuseExistingServer: empty(process.env.CI)
  },
  projects: [
    {name: 'chromium', use: {browserName: 'chromium'}},
    {name: 'firefox', use: {browserName: 'firefox'}},
    {name: 'webkit', use: {browserName: 'webkit'}}
  ]
});
