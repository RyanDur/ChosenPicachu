import {copyFileSync, readFileSync} from 'fs';

const paths = readFileSync('src/pages/Paths.ts', 'utf-8');
const staticRoutes = [...paths.matchAll(/= '(\/[^':]+)'/g)].map(([, route]) => route);

copyFileSync('dist/index.html', 'dist/404.html');
for (const route of staticRoutes) {
  copyFileSync('dist/index.html', `dist${route}`);
}
console.log(`SPA entry points: 404.html, ${staticRoutes.join(', ')}`);
