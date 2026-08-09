import {writeFileSync} from 'node:fs';

if (!process.env.VITE_APP_TRADE_FEED) {
  console.log('env.js untouched: no environment present, the desk owns its own');
  process.exit(0);
}

const env = {
  tradeFeed: process.env.VITE_APP_TRADE_FEED,
  tradeProduct: process.env.VITE_APP_TRADE_PRODUCT ?? '',
  tradeHistory: process.env.VITE_APP_TRADE_HISTORY ?? '',
  aicDomain: process.env.VITE_APP_API_AIC ?? '',
  harvardDomain: process.env.VITE_APP_HARVARD_API ?? '',
  harvardAPIKey: process.env.VITE_APP_HARVARD_API_KEY ?? '',
  vamDomain: process.env.VITE_APP_VAM_API ?? ''
};

writeFileSync('public/env.js', `window.__env = ${JSON.stringify(env, null, 2)};\n`);
console.log('env.js written from the environment');
