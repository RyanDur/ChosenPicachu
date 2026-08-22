import {copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'fs';

const paths = readFileSync('src/pages/Paths.ts', 'utf-8');
const staticRoutes = [...paths.matchAll(/= '(\/[^':]+)'/g)].map(([, route]) => route);

const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf-8'));
const shell = readFileSync('dist/index.html', 'utf-8');
const base = shell.match(/src="(.*?)assets\//)[1];

const closure = (key, seen = new Set()) => {
  if (manifest[key] === undefined || seen.has(key)) return seen;
  seen.add(key);
  (manifest[key].imports ?? []).forEach(dep => closure(dep, seen));
  return seen;
};

const alreadyInShell = closure('index.html');
const moduleOf = page => Object.keys(manifest).find(key => new RegExp(`pages/${page}/(index|routes)\\.tsx?$`).test(key));
const pageOf = route => route.startsWith('/demos/') ? 'Demos' : undefined;

const chunkLinks = route => {
  const page = pageOf(route);
  if (page === undefined) return [];
  return [...closure(moduleOf(page))]
    .filter(key => !alreadyInShell.has(key))
    .map(key => `    <link rel="modulepreload" crossorigin href="${base}${manifest[key].file}">`);
};

const preloaded = route => {
  const links = chunkLinks(route);
  if (links.length === 0) return shell;
  return shell.replace('</head>', `${links.join('\n')}\n  </head>`);
};

copyFileSync('dist/index.html', 'dist/404.html');
for (const route of staticRoutes) {
  mkdirSync(`dist${route}`, {recursive: true});
  writeFileSync(`dist${route}/index.html`, preloaded(route));
}
rmSync('dist/.vite', {recursive: true});
console.log(`SPA entry points: 404.html, ${staticRoutes.join(', ')}`);
