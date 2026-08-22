export const baseOf = shell => {
  const match = shell.match(/src="(.*?)assets\//);
  if (match === null) throw new Error('the shell has no assets script tag to read the base from');
  return match[1];
};

export const closure = (manifest, key, seen = new Set()) => {
  if (seen.has(key)) return seen;
  if (manifest[key] === undefined) throw new Error(`${key} is missing from the build manifest`);
  seen.add(key);
  (manifest[key].imports ?? []).forEach(dep => closure(manifest, dep, seen));
  return seen;
};

export const demosLinks = (manifest, base) => {
  const demosKey = Object.keys(manifest).find(key => key.endsWith('pages/Demos/index.tsx'));
  if (demosKey === undefined) throw new Error('the demos page is missing from the build manifest');
  const shellHolds = closure(manifest, 'index.html');
  return [...closure(manifest, demosKey)]
    .filter(key => !shellHolds.has(key))
    .map(key => `    <link rel="modulepreload" crossorigin href="${base}${manifest[key].file}">`);
};

export const preloaded = (shell, links, route) => route.startsWith('/demos/')
  ? shell.replace('</head>', `${links.join('\n')}\n  </head>`)
  : shell;
