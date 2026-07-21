import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  use: {
    baseURL: process.env.SMOKE_URL || 'https://ryandur.github.io/ChosenPicachu/'
  }
});
