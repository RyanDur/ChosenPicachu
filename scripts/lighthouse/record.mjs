import {chromium} from 'playwright';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const site = 'https://ryandur.github.io/ChosenPicachu/';
const fixtures = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');
const assetCap = 6;
const frameCap = 120;

const localized = {
  'https://api.vam.ac.uk/v2': '/vam',
  'https://api.artic.edu/api/v1/artworks': '/aic',
  'https://api.harvardartmuseums.org/object': '/harvard',
  'https://api.exchange.coinbase.com': '/trade-history'
};

const rest = new Map();
const frames = [];

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('response', async response => {
  const url = response.url();
  const prefix = Object.keys(localized).find(domain => url.startsWith(domain));
  if (!prefix) return;
  const key = url.replace(prefix, localized[prefix]);
  rest.set(key, {
    contentType: response.headers()['content-type'] ?? 'application/json',
    body: await response.text()
  });
});

page.on('websocket', socket => socket.on('framereceived', frame => {
  if (frames.length < frameCap) frames.push(frame.payload.toString());
}));

console.log('recording the gallery…');
await page.goto(`${site}gallery/?tab=vam`);
await page.waitForSelector('figure.frame img', {timeout: 30_000});
await page.waitForTimeout(2000);

console.log('recording the feed…');
await page.goto(`${site}demos/?tab=tables`);
await page.waitForSelector('.aggregations .column-name', {timeout: 30_000});
await page.waitForTimeout(6000);

await page.goto(`${site}demos/?tab=dragAndDrop`);
await page.waitForSelector('.sortable-list .draggable', {timeout: 30_000});
await page.waitForTimeout(2000);

await browser.close();

console.log('localizing the gallery images…');
mkdirSync(join(fixtures, 'assets'), {recursive: true});
const bases = new Map();
for (const entry of rest.values()) {
  for (const [, base] of entry.body.matchAll(/"(https:\/\/framemark\.vam\.ac\.uk\/collections\/[^"]*?\/)"/g)) {
    if (!bases.has(base)) bases.set(base, bases.size % assetCap);
  }
}
for (const [base, slot] of [...bases].filter(([, slot], at) => at < assetCap && slot === at)) {
  for (const size of [400, 800]) {
    const image = await fetch(`${base}full/!${size},${size}/0/default.jpg`);
    writeFileSync(join(fixtures, 'assets', `vam-${slot}-${size}.jpg`),
      Buffer.from(await image.arrayBuffer()));
  }
}
for (const [key, entry] of rest) {
  for (const [base, slot] of bases) {
    entry.body = entry.body.replaceAll(base, `/vam-image/${slot}/`);
  }
  rest.set(key, entry);
}

writeFileSync(join(fixtures, 'rest.json'),
  JSON.stringify([...rest].map(([key, entry]) => ({key, ...entry})), null, 2));
writeFileSync(join(fixtures, 'frames.json'), JSON.stringify(frames, null, 2));
console.log(`recorded ${rest.size} responses, ${frames.length} frames, ${Math.min(bases.size, assetCap)} images`);
