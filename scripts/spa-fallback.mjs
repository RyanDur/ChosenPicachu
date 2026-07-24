import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'fs';

const paths = readFileSync('src/pages/Paths.ts', 'utf-8');
const staticRoutes = [...paths.matchAll(/= '(\/[^':]+)'/g)].map(([, route]) => route);

const manifest = JSON.parse(readFileSync('dist/.vite/manifest.json', 'utf-8'));
const routeModules = {
  '': ['src/pages/Home/component.tsx'],
  '/about': ['src/pages/About/component.tsx'],
  '/users': ['src/pages/Users/component.tsx'],
  '/gallery': [
    'src/pages/Gallery/ArtGalleryPage.tsx',
    'src/components/art-gallery/Search/index.tsx',
    'src/components/art-gallery/PageControl/index.tsx',
    'src/components/art-gallery/Nav/index.tsx'
  ],
  '/games': []
};

const chunkFiles = (moduleId, visited = new Set(), files = new Set()) => {
  const entry = manifest[moduleId];
  if (entry === undefined || visited.has(moduleId)) return files;
  visited.add(moduleId);
  files.add(entry.file);
  (entry.css ?? []).forEach(sheet => files.add(sheet));
  (entry.imports ?? []).forEach(dep => chunkFiles(dep, visited, files));
  return files;
};

const indexHtml = readFileSync('dist/index.html', 'utf-8');
const withPreloads = (moduleIds) => {
  if (moduleIds === undefined || moduleIds.length === 0) return indexHtml;
  const files = new Set();
  const visited = new Set();
  moduleIds.forEach(id => chunkFiles(id, visited, files));
  const links = [...files]
    .filter(file => !indexHtml.includes(file))
    .map(file => file.endsWith('.js')
      ? `    <link rel="modulepreload" href="/ChosenPicachu/${file}" />`
      : `    <link rel="preload" as="style" href="/ChosenPicachu/${file}" />`)
    .join('\n');
  return indexHtml.replace('  </head>', `${links}\n  </head>`);
};

writeFileSync('dist/index.html', withPreloads(routeModules['']));
copyFileSync('dist/index.html', 'dist/404.html');
for (const route of staticRoutes) {
  mkdirSync(`dist${route}`, {recursive: true});
  writeFileSync(`dist${route}/index.html`, withPreloads(routeModules[route]));
}
console.log(`SPA entry points: 404.html, ${staticRoutes.join(', ')} (chunk preloads injected)`);
