import {empty, not} from '@ryandur/sand';

/**
 * @param {string} pathsSource
 */
export const staticRoutesOf = pathsSource =>
  [...pathsSource.matchAll(/= '(\/[^':]+)'/g)].map(match => match[1]);

export const baseOf = shell => {
  const match = shell.match(/src="(.*?)assets\//);
  if (match === null) throw new Error('the shell has no assets script tag to read the base from');
  return match[1];
};

export const closure = (manifest, key, seen = new Set()) => {
  if (seen.has(key)) return seen;
  if (not(Object.hasOwn(manifest, key))) throw new Error(`${key} is missing from the build manifest`);
  seen.add(key);
  (manifest[key].imports ?? []).forEach(dep => closure(manifest, dep, seen));
  return seen;
};

export const demosLinks = (manifest, base) => {
  const demosKey = Object.keys(manifest).find(key => key.endsWith('pages/Demos/index.tsx'));
  if (empty(demosKey)) throw new Error('the demos page is missing from the build manifest');
  const shellHolds = closure(manifest, 'index.html');
  return [...closure(manifest, demosKey)]
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
const untagged = tag => {
  throw new Error(`index.html has no one-line ${tag} tag for the build to fill`);
};
/**
 * @param {string} html
 * @param {string} tag
 * @param {RegExp} found
 * @param {string} written
 */
const filled = (html, tag, found, written) => found.test(html) ? html.replace(found, written) : untagged(tag);

/**
 * @param {string} shell
 * @param {{title: string, description: string}} listing
 */
export const listedIn = (shell, {title, description}) => {
  const titled = filled(shell, 'title', /<title>[^<]*<\/title>/, `<title>${escaped(title)}</title>`);
  return filled(titled, 'description', /<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${escaped(description)}"/>`);
};
