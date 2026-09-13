import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/smoke.e2e.ts',
  retries: 2,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: process.env.SMOKE_URL ?? 'https://ryandur.github.io/ChosenPicachu/',
    trace: 'on-first-retry'
  },
  projects: [
    {name: 'chromium', use: {browserName: 'chromium'}},
    {name: 'firefox', use: {browserName: 'firefox'}},
    {name: 'webkit', use: {browserName: 'webkit'}}
  ]
});
