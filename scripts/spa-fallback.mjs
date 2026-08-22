import {copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';

const paths = readFileSync('src/pages/Paths.ts', 'utf-8');
const staticRoutes = [...paths.matchAll(/= '(\/[^':]+)'/g)].map(([, route]) => route);

const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf-8'));
const shell = readFileSync('dist/index.html', 'utf-8');
const baseMatch = shell.match(/src="(.*?)assets\//);
if (baseMatch === null) throw new Error('dist/index.html has no assets script tag to read the base from');
const base = baseMatch[1];

const closure = (key, seen = new Set()) => {
  if (seen.has(key)) return seen;
  if (manifest[key] === undefined) throw new Error(`${key} is missing from the build manifest`);
  seen.add(key);
  (manifest[key].imports ?? []).forEach(dep => closure(dep, seen));
  return seen;
};

const demosKey = Object.keys(manifest).find(key => key.endsWith('pages/Demos/index.tsx'));
if (demosKey === undefined) throw new Error('the demos page is missing from the build manifest');
const shellHolds = closure('index.html');
const demosLinks = [...closure(demosKey)]
  .filter(key => !shellHolds.has(key))
  .map(key => `    <link rel="modulepreload" crossorigin href="${base}${manifest[key].file}">`);

const preloaded = route => route.startsWith('/demos/')
  ? shell.replace('</head>', `${demosLinks.join('\n')}\n  </head>`)
  : shell;

copyFileSync('dist/index.html', 'dist/404.html');
for (const route of staticRoutes) {
  mkdirSync(`dist${route}`, {recursive: true});
  writeFileSync(`dist${route}/index.html`, preloaded(route));
}
rmSync('dist/.vite', {recursive: true});
console.log(`SPA entry points: 404.html, ${staticRoutes.join(', ')}`);
