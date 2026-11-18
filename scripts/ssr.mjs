import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {maybe} from '@ryandur/sand';
import {stageEnvironment} from './lighthouse/stage-environment.mjs';

const port = maybe(process.env.STAGE_PORT).orElse('4520');

// the Feedback slot and the chart's product are drawn into the page, and React throws a page away whose markup
// differs from what its script draws (#418), so the build takes them from the env.js the stage will serve
const {feedbackToken, tradeProduct} = stageEnvironment(Number(port));
const asTheStageServesIt = {
  ...process.env,
  VITE_APP_FEEDBACK_TOKEN: feedbackToken,
  VITE_APP_TRADE_PRODUCT: tradeProduct
};

const vite = join('node_modules', '.bin', 'vite');
execFileSync(vite, ['build', '--outDir', 'build-ssr/client'], {stdio: 'inherit', env: asTheStageServesIt});
execFileSync(vite, ['build', '--ssr', 'src/entry.server.tsx', '--outDir', 'build-ssr/server'],
  {stdio: 'inherit', env: asTheStageServesIt});

Object.assign(process.env, {STAGE_RENDER: 'on', STAGE_SITE: 'build-ssr/client', STAGE_PORT: port});
await import('./lighthouse/server.mjs');
