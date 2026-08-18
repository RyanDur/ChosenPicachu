import {defineConfig} from '@playwright/test';

const smokeUrl = process.env.SMOKE_URL;

export default defineConfig({
  testDir: './e2e/media',
  testMatch: '**/*.capture.ts',
  retries: 0,
  workers: 1,
  timeout: 120_000,
  use: {
    baseURL: smokeUrl || 'https://ryandur.github.io/ChosenPicachu/',
    viewport: {width: 1000, height: 760}
  },
  webServer: smokeUrl ? {
    command: 'npm run preview',
    url: smokeUrl,
    reuseExistingServer: true
  } : undefined,
  projects: [
    {name: 'chromium', use: {browserName: 'chromium'}}
  ]
});
