import {empty, not} from '@ryandur/sand';

/**
 * @param {string} pathsSource
 */
export const staticRoutesOf = pathsSource =>
  [...pathsSource.matchAll(/= '(\/[^':]+)'/g)].map(match => match[1]);

export const baseOf = shell => {
  const match = shell.match(/(?:src|href)="([^"]*?)assets\//);
  if (match === null) throw new Error('the shell has no assets link to read the base from');
  return match[1];
};

export const closure = (manifest, key, seen = new Set()) => {
  if (seen.has(key)) return seen;
  if (not(Object.hasOwn(manifest, key))) throw new Error(`${key} is missing from the build manifest`);
  seen.add(key);
  (manifest[key].imports ?? []).forEach(dep => closure(manifest, dep, seen));
  return seen;
};

const keysStarting = (manifest, start) => Object.keys(manifest).filter(key => key.startsWith(start));

export const demosLinks = (manifest, base) => {
  const demosKey = Object.keys(manifest).find(key => key.endsWith('pages/Demos/DemosPage.tsx'));
  if (empty(demosKey)) throw new Error('the demos page is missing from the build manifest');
  const shellHolds = new Set([...keysStarting(manifest, 'src/entry.client.tsx'), ...keysStarting(manifest, 'src/root.tsx')]
    .flatMap(key => [...closure(manifest, key)]));
  const demos = [...keysStarting(manifest, 'src/pages/Demos/route.tsx'), demosKey]
    .reduce((seen, key) => closure(manifest, key, seen), new Set());
  return [...demos]
    .filter(key => !shellHolds.has(key))
    .map(key => `    <link rel="modulepreload" crossorigin href="${base}${manifest[key].file}">`);
};

/**
 * @param {string} shell
 * @param {string[]} links
 * @param {string} route
 */
export const preloaded = (shell, links, route) => route.startsWith('/demos/')
  ? shell.replace('</head>', `${links.join('\n')}\n  </head>`)
  : shell;

const escaped = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const headless = () => {
  throw new Error('the shell has no head for the build to list the page in');
};

/**
 * @param {string} shell
 * @param {{title: string, description: string}} listing
 */
export const listedIn = (shell, {title, description}) => shell.includes('</head>')
  ? shell.replace('</head>', `<title>${escaped(title)}</title><meta name="description" content="${escaped(description)}"/></head>`)
  : headless();
