import {defineConfig} from '@playwright/test';

const unnamed = (): never => {
  throw new Error('LOOKS_BEFORE names the dist to compare against: node scripts/looks/before.mjs main');
};

const before = process.env.LOOKS_BEFORE ?? unnamed();

export default defineConfig({
  testDir: './e2e/looks',
  testMatch: '**/*.looks.ts',
  retries: 0,
  timeout: 300_000,
  use: {contextOptions: {reducedMotion: 'reduce'}},
  webServer: [
    {command: 'node scripts/lighthouse/server.mjs', env: {STAGE_PORT: '4530', STAGE_DIST: before}, url: 'http://localhost:4530/ChosenPicachu/', reuseExistingServer: false},
    {command: 'node scripts/lighthouse/server.mjs', env: {STAGE_PORT: '4531'}, url: 'http://localhost:4531/ChosenPicachu/', reuseExistingServer: false}
  ],
  projects: [
    {name: 'chromium', use: {browserName: 'chromium'}},
    {name: 'firefox', use: {browserName: 'firefox'}},
    {name: 'webkit', use: {browserName: 'webkit'}}
  ]
});
