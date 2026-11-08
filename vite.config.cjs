const {mkdirSync, readFileSync, writeFileSync} = require('node:fs');
const {execSync} = require('node:child_process');
const {join, relative} = require('node:path');
const {defineConfig} = require('vitest/config');
const {loadEnv} = require('vite');
const {rolldown} = require('rolldown');
const {usersServer} = require('./src/pages/Users/usersServer/usersServer.ts');
const {practiceDrawings, squeezed} = require('./src/pages/Practice/practiceDrawings.ts');
const {browserslistToTargets, transform} = require('lightningcss');
const browserslist = require('browserslist');
const react = require('@vitejs/plugin-react').default;
const svgr = require('vite-plugin-svgr');
const {has} = require('@ryandur/sand');
const autoprefixer = require('autoprefixer');

/** @param {string} path */
const at = path => join(__dirname, path);

const aliases = {
  '@env': at('./src/env.ts'),
  '@pages': at('./src/pages'),
  '@frame': at('./src/frame'),
  '@components': at('./src/components'),
  '@transport': at('./src/transport'),
  '@__test_support': at('./src/__test_support')
};

/** @returns {import('vite').Plugin} */
const frameScript = () => ({
  name: 'frame-script',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source.endsWith('.ts?frame')) {
      const resolved = await this.resolve(source.slice(0, -'?frame'.length), importer, {skipSelf: true});
      if (has(resolved)) {
        return '\0framejs' + resolved.id + '.js';
      }
    }
  },
  async load(id) {
    if (id.startsWith('\0framejs')) {
      const path = id.slice('\0framejs'.length, -'.js'.length);
      // the frame is bundled outside Vite, which is what fills in import.meta.env, and it runs only in the browser
      const bundle = await rolldown({input: path, resolve: {alias: aliases}, transform: {define: {'import.meta.env.SSR': 'false'}}, logLevel: 'silent'});
      const {output} = await bundle.generate({format: 'esm'});
      output[0].moduleIds
        .filter(module => !module.startsWith('\0'))
        .forEach(module => this.addWatchFile(module));
      return `export default ${JSON.stringify(output[0].code)};`;
    }
  }
});

/** @returns {import('vite').Plugin} */
const rawCss = () => ({
  name: 'raw-css',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source.endsWith('.css?raw')) {
      const resolved = await this.resolve(source.slice(0, -'?raw'.length), importer, {skipSelf: true});
      if (has(resolved)) {
        return '\0rawcss' + resolved.id + '.js';
      }
    }
  },
  load(id) {
    if (id.startsWith('\0rawcss')) {
      const path = id.slice('\0rawcss'.length, -'.js'.length);
      this.addWatchFile(path);
      return `export default ${JSON.stringify(readFileSync(path, 'utf8'))};`;
    }
  }
});

const builtCommit = () => {
  try {
    return process.env.GITHUB_SHA ?? execSync('git rev-parse HEAD', {encoding: 'utf8'}).trim();
  } catch {
    return 'main';
  }
};

/** @returns {import('vite').Plugin} */
const sample = () => {
  const commit = builtCommit();
  let root = process.cwd();
  return {
    name: 'sample',
    enforce: 'pre',
    configResolved(config) {
      root = config.root;
    },
    async resolveId(source, importer) {
      if (source.endsWith('?sample')) {
        const resolved = await this.resolve(source.slice(0, -'?sample'.length), importer, {skipSelf: true});
        if (has(resolved)) {
          return '\0sample' + resolved.id + '.js';
        }
      }
    },
    load(id) {
      if (id.startsWith('\0sample')) {
        const file = id.slice('\0sample'.length, -'.js'.length);
        this.addWatchFile(file);
        const path = relative(root, file);
        return `export default ${JSON.stringify({
          text: readFileSync(file, 'utf8'),
          path,
          url: `https://github.com/RyanDur/ChosenPicachu/blob/${commit}/${path}`
        })};`;
      }
    }
  };
};

/** @returns {import('vite').Plugin} */
const frameCss = () => ({
  name: 'frame-css',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source.endsWith('.css?frame')) {
      const resolved = await this.resolve(source.slice(0, -'?frame'.length), importer, {skipSelf: true});
      if (has(resolved)) {
        return '\0framecss' + resolved.id + '.js';
      }
    }
  },
  load(id) {
    if (id.startsWith('\0framecss')) {
      const path = id.slice('\0framecss'.length, -'.js'.length);
      this.addWatchFile(path);
      const {code} =
        transform({filename: path, code: readFileSync(path), targets: browserslistToTargets(browserslist())});
      return `export default ${JSON.stringify(code.toString())};`;
    }
  }
});

// a drawing loaded as an image cannot read the page's style sheets, so its frames are written as files carrying the
// site's own
/** @returns {import('vite').Plugin} */
const drawings = () => {
  const siteSheets = ['./src/styles/reset.css', './src/styles/colors.css', './src/styles/spacing.css', './src/styles/typography.css',
    './src/styles/drawing.css'].map(at);
  const drawn = Object.entries(practiceDrawings).map(([name, {sheet, frames}]) => ({name, sheet: at(`./${sheet}`), frames}));
  const sheets = [...siteSheets, ...drawn.map(({sheet}) => sheet)];
  const folder = at('./src/pages/Practice/drawings/');
  const draw = () => {
    mkdirSync(folder, {recursive: true});
    drawn.forEach(({name, sheet, frames}) => {
      const {wide, stacked} = frames(squeezed([...siteSheets, sheet].map(read => readFileSync(read, 'utf8')).join('')));
      writeFileSync(`${folder}${name}-wide.svg`, wide);
      writeFileSync(`${folder}${name}-stacked.svg`, stacked);
    });
  };
  return {
    name: 'drawings',
    buildStart: draw,
    configureServer(server) {
      server.watcher.add(sheets);
      server.watcher.on('change', changed => {
        if (sheets.includes(changed)) draw();
      });
    }
  };
};

/** @returns {import('vite').Plugin} */
const usersServerPlugin = () => {
  const worker = at('./backend/users/worker.ts');
  const script = usersServer.script;
  const built = async () => {
    const bundle = await rolldown({input: worker, resolve: {alias: aliases}, logLevel: 'silent'});
    const {output} = await bundle.generate({format: 'iife'});
    return output[0].code;
  };
  return {
    name: 'users-server',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if ((request.url ?? '').split('?')[0].endsWith(`/${script}`)) {
          response.setHeader('content-type', 'text/javascript');
          response.end(await built());
          return;
        }
        next();
      });
    },
    async generateBundle() {
      if (this.environment.name === 'client') this.emitFile({type: 'asset', fileName: script, source: await built()});
    }
  };
};

/**
 * @param {Record<string, string>} env
 * @returns {import('vite').Plugin}
 */
const runtimeEnv = env => {
  const values = {
    tradeFeed: env.VITE_APP_TRADE_FEED ?? '',
    tradeProduct: env.VITE_APP_TRADE_PRODUCT ?? '',
    tradeHistory: env.VITE_APP_TRADE_HISTORY ?? '',
    aicDomain: env.VITE_APP_API_AIC ?? '',
    aicPictures: env.VITE_APP_AIC_PICTURES ?? '',
    harvardDomain: env.VITE_APP_HARVARD_API ?? '',
    harvardAPIKey: env.VITE_APP_HARVARD_API_KEY ?? '',
    vamDomain: env.VITE_APP_VAM_API ?? '',
    vamPictures: env.VITE_APP_VAM_PICTURES ?? '',
    clevelandDomain: env.VITE_APP_CLEVELAND_API ?? '',
    usersDomain: env.VITE_APP_USERS_API ?? '',
    feedbackToken: env.VITE_APP_FEEDBACK_TOKEN ?? '',
    feedbackEndpoint: env.VITE_APP_FEEDBACK_ENDPOINT ?? 'https://api.github.com/graphql'
  };
  const body = `window.__env = ${JSON.stringify(values, null, 2)};\n`;
  return {
    name: 'runtime-env',
    config: () => ({define: {__BUILT_ENV__: JSON.stringify(values)}}),
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if ((request.url ?? '').split('?')[0].endsWith('/env.js')) {
          response.setHeader('content-type', 'text/javascript');
          response.end(body);
          return;
        }
        next();
      });
    },
    generateBundle() {
      if (this.environment.name === 'client') this.emitFile({type: 'asset', fileName: 'env.js', source: body});
    }
  };
};

/**
 * @typedef {object} Prerender
 * @property {string[]} pages
 * @property {(path: string) => Promise<{html: string}>} page
 * @property {() => Promise<string>} fallback
 */

/** @returns {import('vite').Plugin} */
const pagesAsPublished = () => ({
  name: 'pages-as-published',
  configureServer(server) {
    const base = server.config.base;
    server.middlewares.use(async (request, response, next) => {
      const url = request.url ?? '/';
      if (request.method !== 'GET' || !url.startsWith(base) || !(request.headers.accept ?? '').includes('text/html')) {
        next();
        return;
      }
      try {
        /** @type {Prerender} */
        const prerender = (await server.ssrLoadModule('/src/entry.server.tsx')).prerender;
        const path = `/${url.slice(base.length).split('?')[0]}`;
        const published = prerender.pages.includes(path);
        const html = published ? (await prerender.page(path)).html : await prerender.fallback();
        const entry = published ? 'entry.client.tsx' : 'entry.fallback.tsx';
        response.setHeader('content-type', 'text/html');
        response.end(html.replace('</body>',
          `<script type="module" src="${base}@id/@vitejs/plugin-react/preamble"></script>` +
          `<script type="module" src="${base}src/${entry}"></script></body>`));
      } catch (error) {
        next(error);
      }
    });
  }
});

// https://vitejs.dev/config/
module.exports = defineConfig(({mode}) => ({
  base: '/ChosenPicachu/',
  css: {
    postcss: {plugins: [autoprefixer()]}
  },
  resolve: {
    alias: aliases
  },
  build: {
    cssCodeSplit: false,
    manifest: true,
    outDir: 'build/client',
    rolldownOptions: {input: ['src/entry.client.tsx', 'src/entry.fallback.tsx']}
  },
  plugins: [
    drawings(), rawCss(), sample(), frameCss(), frameScript(), usersServerPlugin(),
    runtimeEnv(loadEnv(mode, process.cwd())), pagesAsPublished(), react(), svgr({
    // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {exportType: 'default', ref: true, svgo: false, titleProp: true},
      include: '**/*.svg'
    })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    slowTestThreshold: 200
  }
}));
