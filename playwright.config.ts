import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  retries: 2,
  timeout: 60_000,
  use: {
    baseURL: process.env.SMOKE_URL || 'https://ryandur.github.io/ChosenPicachu/'
  }
});
