import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, join, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {empty, has, not} from '@ryandur/sand';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = join(root, 'src');
const aliases = {'@components': 'src/components', '@navigation': 'src/navigation', '@banners': 'src/banners', '@feedback': 'src/feedback', '@environment': 'src/environment', '@page': 'src/page', '@page-name': 'src/page-name', '@pages': 'src/pages', '@transport': 'src/transport'};
const code = /\.(ts|tsx)$/;
const indexNames = ['index.ts', 'index.tsx'];

/** @type {Record<string, string[]>} */
const exceptionsOnFile = JSON.parse(readFileSync(join(root, 'scripts/lint/structure-exceptions.json'), 'utf8'));
const routeModules = new Set([
  'src/root.tsx', 'src/routes.ts',
  ...[...readFileSync(join(src, 'routes.ts'), 'utf8').matchAll(/'(pages\/[^']+\.tsx)'/g)].map(([, path]) => `src/${path}`)
]);

/** @param {string} file */
const fromRoot = file => relative(root, file).split(sep).join('/');
/** @param {string} file */
const isIndex = file => indexNames.some(name => file.endsWith(`/${name}`));
/** @param {string} file */
const isTestPlace = file => /\/__tests__\/|\/__test_support\//.test(`/${file}`);
/** @param {string} path */
const isDirectory = path => existsSync(path) && statSync(path).isDirectory();
/** @param {string} directory */
const hasIndex = directory => indexNames.some(name => existsSync(join(directory, name)));

/**
 * @param {string} specifier
 * @param {string} fromFile
 * @return {{directory?: string, file?: string}}
 */
const resolved = (specifier, fromFile) => {
  const prefix = Object.keys(aliases).find(alias => specifier === alias || specifier.startsWith(`${alias}/`));
  const base = has(prefix) ? join(root, aliases[prefix], specifier.slice(prefix.length))
    : specifier.startsWith('.') ? join(dirname(fromFile), specifier) : '';
  if (specifier.includes('?') || base === '') return {};
  if (isDirectory(base)) return {directory: base};
  const file = ['.ts', '.tsx'].map(extension => base + extension).find(existsSync)
    ?? (code.test(base) && existsSync(base) ? base : undefined);
  if (not(has(file))) return {};
  return isIndex(file) ? {directory: dirname(file)} : {file};
};

/**
 * @param {string} directory
 * @param {string} file
 */
const inside = (directory, file) => not(relative(directory, file).startsWith('..'));

/**
 * @param {string} directory
 * @return {string[]}
 */
const sourceFiles = directory => readdirSync(directory, {withFileTypes: true}).flatMap(entry =>
  entry.isDirectory() ? sourceFiles(join(directory, entry.name))
    : code.test(entry.name) && not(entry.name.endsWith('.d.ts')) ? [join(directory, entry.name)] : []);

/** @param {string} names */
const namesIn = names => names.split(',')
  .map(name => name.replace(/^\s*type\s+/, '').split(/\s+as\s+/)[0].trim())
  .filter(name => name !== '');

/** @param {string} file */
const importsIn = file => [...readFileSync(file, 'utf8').matchAll(/(?:import|export)\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'([^']+)'/g)]
  .map(([, names, specifier]) => ({names: namesIn(names), specifier}));

/** @type {Map<string, Set<string>> | undefined} */
let wanted;

/**
 * @param {Map<string, Set<string>>} into
 * @param {string} file
 */
const noteWhatLeaves = (into, file) => importsIn(file).forEach(({names, specifier}) => {
  const {directory} = resolved(specifier, file);
  if (not(has(directory)) || inside(directory, file)) return;
  const needed = into.get(directory) ?? new Set();
  names.forEach(name => needed.add(name));
  into.set(directory, needed);
});

/** @param {string} directory */
const wantedFrom = directory => {
  if (not(has(wanted))) {
    wanted = new Map();
    sourceFiles(src).forEach(file => noteWhatLeaves(wanted, file));
  }
  return wanted.get(directory) ?? new Set();
};

/**
 * @param {string} rule
 * @param {string} file
 */
/**
 * @param {Record<string, string[]>} exceptions
 * @param {string} rule
 * @param {string} file
 */
const listed = (exceptions, rule, file) => (exceptions[rule] ?? []).includes(file);

/**
 * @param {string} name
 * @param {string} description
 * @param {(file: string, report: (node: object, why: string) => void) => Record<string, Function>} check
 */
const ruleWith = (name, description, check) => ({
  meta: {type: 'problem', docs: {description}, schema: [{
    type: 'object', properties: {exceptions: {type: 'object'}}, additionalProperties: false
  }], messages: {
    broken: '{{why}}',
    mended: `{{file}} now keeps this rule: take it off the "${name}" list in scripts/lint/structure-exceptions.json`
  }},
  create: context => {
    const file = fromRoot(context.filename);
    // a spec passes its own list, so it never depends on which files the live list still holds
    /** @type {Record<string, string[]>} */
    const exceptions = context.options[0]?.exceptions ?? exceptionsOnFile;
    if (not(file.startsWith('src/')) || file.endsWith('.d.ts')) return {};
    /** @type {{node: object, why: string}[]} */
    const found = [];
    const visitors = check(file, (node, why) => found.push({node, why}));
    return {
      ...visitors,
      'Program:exit': program => {
        visitors['Program:exit']?.(program);
        if (listed(exceptions, name, file)) {
          if (empty(found)) context.report({node: program, messageId: 'mended', data: {file}});
          return;
        }
        found.forEach(({node, why}) => context.report({node, messageId: 'broken', data: {why}}));
      }
    };
  }
});

const typeDeclarations = new Set(['TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSDeclareFunction']);

/** @param {any} node */
const valuesExportedBy = node => {
  if (node.type !== 'ExportNamedDeclaration') return node.type === 'ExportDefaultDeclaration' || node.type === 'ExportAllDeclaration' ? 1 : 0;
  if (node.exportKind === 'type') return 0;
  if (has(node.declaration)) {
    if (typeDeclarations.has(node.declaration.type)) return 0;
    return node.declaration.type === 'VariableDeclaration' ? node.declaration.declarations.length : 1;
  }
  return node.specifiers.filter(specifier => specifier.exportKind !== 'type').length;
};

const oneExport = ruleWith('one-export', 'a file exports one module or one component, and its types', (file, report) => {
  if (isIndex(file) || routeModules.has(file)) return {};
  let count = 0;
  return {
    'ExportNamedDeclaration, ExportDefaultDeclaration, ExportAllDeclaration': node => {
      const values = valuesExportedBy(node);
      count += values;
      if (count > 1 && values > 0) report(node, 'a file exports one module or one component, and this is a second (AGENTS.md, Code style)');
    }
  };
});

const everyDirectoryHasAnIndex = ruleWith('has-index', 'every directory of code has an index', (file, report) => {
  const directory = dirname(join(root, file));
  // a route module is the framework's door, so a file that is one asks for no index beside it
  if (isTestPlace(file) || directory === src || routeModules.has(file)) return {};
  return {
    'Program:exit': program => {
      if (not(hasIndex(directory))) report(program, `${fromRoot(directory)} has no index.ts, and every directory of code has one`);
    }
  };
});

const throughIndex = ruleWith('through-index', 'code outside a directory imports from the directory, never from a file inside it', (file, report) => {
  const at = join(root, file);
  /** @param {any} node */
  const reach = node => {
    if (not(has(node.source))) return;
    const target = resolved(node.source.value, at);
    if (not(has(target.file)) || inside(dirname(target.file), at)) return;
    report(node, `${node.source.value} reaches past the index of ${fromRoot(dirname(target.file))}; import from the directory`);
  };
  return {ImportDeclaration: reach, ExportNamedDeclaration: reach, ExportAllDeclaration: reach};
});

const indexTopLevel = ruleWith('index-top-level', 'an index exports only what code outside its directory imports, from its own top level', (file, report) => {
  if (not(isIndex(file))) return {};
  const at = join(root, file);
  const directory = dirname(at);
  /** @param {any} node */
  const fromTopLevel = node => {
    if (not(has(node.source))) return true;
    const target = resolved(node.source.value, at);
    return has(target.file) && dirname(target.file) === directory;
  };
  return {
    'ExportNamedDeclaration, ExportAllDeclaration': node => {
      if (not(fromTopLevel(node))) {
        report(node, `an index exports only from its own directory's top level, not from ${node.source.value}`);
      } else if (node.type === 'ExportAllDeclaration') {
        report(node, 'an index names what it exports, so a reader sees what leaves the directory');
      } else {
        const needed = wantedFrom(directory);
        node.specifiers.filter(specifier => specifier.exportKind !== 'type' && not(needed.has(specifier.exported.name)))
          .forEach(specifier => report(specifier, `nothing outside ${fromRoot(directory)} imports ${specifier.exported.name}, so its index does not export it`));
      }
    }
  };
});

export const structure = {
  rules: {'one-export': oneExport, 'has-index': everyDirectoryHasAnIndex, 'through-index': throughIndex, 'index-top-level': indexTopLevel}
};
