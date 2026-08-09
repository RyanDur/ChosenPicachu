import {existsSync, readFileSync, writeFileSync} from 'node:fs';

const fromFile = existsSync('.env')
  ? Object.fromEntries(readFileSync('.env', 'utf8')
      .split('\n')
      .filter(line => line.includes('='))
      .map(line => {
        const at = line.indexOf('=');
        return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
      }))
  : {};

const pick = key => process.env[key] ?? fromFile[key] ?? '';

const env = {
  tradeFeed: pick('VITE_APP_TRADE_FEED'),
  tradeProduct: pick('VITE_APP_TRADE_PRODUCT'),
  tradeHistory: pick('VITE_APP_TRADE_HISTORY'),
  aicDomain: pick('VITE_APP_API_AIC'),
  harvardDomain: pick('VITE_APP_HARVARD_API'),
  harvardAPIKey: pick('VITE_APP_HARVARD_API_KEY'),
  vamDomain: pick('VITE_APP_VAM_API')
};

writeFileSync('public/env.js', `window.__env = ${JSON.stringify(env, null, 2)};\n`);
console.log('env.js written for', env.tradeProduct || '(empty env)');
