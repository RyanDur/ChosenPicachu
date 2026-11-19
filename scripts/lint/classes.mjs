import {empty, has, is, maybe, not} from '@ryandur/sand';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = join(root, 'src');

const folders = directory => [directory, ...readdirSync(directory, {withFileTypes: true})
  .filter(entry => entry.isDirectory()).flatMap(entry => folders(join(directory, entry.name)))];

const sheetsIn = found => found.flatMap(directory => readdirSync(directory).filter(name => name.endsWith('.css')).map(name => join(directory, name)));

const selectorsOf = sheet => [...readFileSync(sheet, 'utf8').replace(/\/\*[^]*?\*\//g, '').matchAll(/([^{};]+)\{/g)]
  .map(([, selector]) => selector.trim())
  .filter(selector => not(selector.startsWith('@')))
  .map(selector => selector.replace(/"[^"]*"|'[^']*'/g, ''));

const classesIn = selector => [...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(([, name]) => name);

const isShared = sheet => {
  const path = relative(src, sheet);
  return path.startsWith('styles/') || path === 'index.css';
};

const read = found => {
  /** @type {Set<string>} */
  const own = new Set();
  /** @type {Set<string>} */
  const shared = new Set();
  /** @type {Map<string, Set<string>>} */
  const bySheet = new Map();
  for (const sheet of found) {
    const names = new Set(selectorsOf(sheet).flatMap(classesIn));
    bySheet.set(sheet, names);
    names.forEach(name => (isShared(sheet) ? shared : own).add(name));
  }
  return {own, shared, bySheet};
};

const stampOf = paths => paths.map(path => `${path} ${maybe(statSync(path, {throwIfNoEntry: false})).map(({mtimeMs}) => mtimeMs).orElse(0)}`).join('\n');

let lastRead = {watched: [], stamp: '', classes: read([])};

// WebStorm's ESLint service keeps one process across branch switches,
// so the sheets are read again when a sheet or a folder changes.
const sheetClasses = () => {
  if (has(lastRead.watched) && stampOf(lastRead.watched) === lastRead.stamp) return lastRead.classes;
  const found = folders(src);
  const sheets = sheetsIn(found);
  const watched = [...found, ...sheets];
  lastRead = {watched, stamp: stampOf(watched), classes: read(sheets)};
  return lastRead.classes;
};

/** @param {string} directory */
const framedBesides = directory => readdirSync(directory)
  .filter(name => /\.tsx?$/.test(name))
  .flatMap(name => [...readFileSync(join(directory, name), 'utf8').matchAll(/import\s+\w+\s+from\s+'([^']+\.css)\?frame'/g)])
  .map(([, specifier]) => specifier.startsWith('@components/') ? join(src, 'components', specifier.slice('@components/'.length)) : join(directory, specifier));

/**
 * @param {string} directory
 * @returns {string[]}
 */
const homesOf = directory =>
  directory === src || not(directory.startsWith(src)) ? [src] : [directory, ...homesOf(dirname(directory))];

/** @param {string} file */
const nearbyOf = file => {
  const {shared, bySheet} = sheetClasses();
  const page = file.includes('.html/') ? file.slice(0, file.indexOf('.html/') + '.html'.length) : file;
  const directory = dirname(page);
  const near = new Set(shared);
  for (const [sheet, names] of bySheet) {
    const home = dirname(sheet);
    if (directory === home || directory.startsWith(home + '/')) names.forEach(name => near.add(name));
  }
  homesOf(directory).flatMap(framedBesides)
    .forEach(sheet => maybe(bySheet.get(sheet)).orElse(new Set()).forEach(name => near.add(name)));
  return near;
};
/**
 * @param {Set<string>} near
 * @param {string} prefix
 */
const opens = (near, prefix) => [...near].some(name => name.startsWith(prefix));

const htmlClass = '__htmlClass';

const wornClasses = (node, wear) => {
  if (not(node)) return;
  switch (node.type) {
    case 'Literal':
      if (typeof node.value === 'string') wear(node, node.value.split(/\s+/).filter(Boolean));
      return;
    case 'TemplateLiteral':
      node.quasis.forEach((quasi, at) => {
        const words = quasi.value.cooked.split(/\s+/);
        const tail = at < node.quasis.length - 1 ? maybe(words.pop()).orElse('') : '';
        if (has(tail)) wear(node, [], [tail]);
        wear(node, words.filter(Boolean));
      });
      return;
    case 'LogicalExpression':
      if (node.operator !== '&&') wornClasses(node.left, wear);
      wornClasses(node.right, wear);
      return;
    case 'ConditionalExpression':
      wornClasses(node.consequent, wear);
      wornClasses(node.alternate, wear);
      return;
    case 'CallExpression':
      if (node.callee.type === 'Identifier' && node.callee.name === 'classNames') node.arguments.forEach(argument => wornClasses(argument, wear));
      return;
    case 'ArrayExpression':
      node.elements.forEach(element => wornClasses(element, wear));
      return;
    case 'TSAsExpression':
      wornClasses(node.expression, wear);
      return;
    case 'ArrowFunctionExpression':
      wornClasses(node.body, wear);
  }
};

const firstWorn = node => {
  if (not(node)) return [];
  if (node.type === 'ArrowFunctionExpression') return firstWorn(node.body);
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value.split(/\s+/).filter(Boolean);
  if (node.type === 'CallExpression' && node.callee.name === 'classNames') {
    const statics = node.arguments.filter(argument => argument.type === 'Literal' && typeof argument.value === 'string');
    const [first] = node.arguments;
    return is(first) && first.type === 'Literal' ? statics.flatMap(argument => argument.value.split(/\s+/)) : [];
  }
  return [];
};

const classPositions = visit => ({
  JSXAttribute: node => {
    if (node.name.name !== 'className' || empty(node.value)) return;
    visit(node.value.type === 'JSXExpressionContainer' ? node.value.expression : node.value);
  },
  CallExpression: node => {
    const {callee} = node;
    if (callee.type === 'Identifier' && callee.name === htmlClass) visit(node.arguments[0]);
    if (callee.type === 'MemberExpression' && is(callee.object.property) && callee.object.property.name === 'classList' && ['add', 'remove', 'toggle'].includes(callee.property.name)) {
      node.arguments.slice(0, callee.property.name === 'toggle' ? 1 : undefined).forEach(visit);
    }
  }
});

const classDefined = {
  meta: {type: 'problem', messages: {
    undefined: '"{{name}}" is read by no sheet beside this file, above it, or in src/styles; a class an element wears is one a sheet near it reads',
    unopened: 'no class begins "{{prefix}}"; a class an element wears is one a sheet reads'
  }},
  create: context => {
    const near = nearbyOf(context.filename);
    return classPositions(node => wornClasses(node, (at, names, prefixes = []) => {
      names.filter(name => not(near.has(name))).forEach(name => context.report({node: at, messageId: 'undefined', data: {name}}));
      prefixes.filter(prefix => not(opens(near, prefix))).forEach(prefix => context.report({node: at, messageId: 'unopened', data: {prefix}}));
    }));
  }
};

const ownClassFirst = {
  meta: {type: 'problem', messages: {
    behind: '"{{name}}" is this element\'s own class and comes first, before the shared words it wears'
  }},
  create: context => {
    const {own} = sheetClasses();
    return classPositions(node => {
      const names = firstWorn(node);
      const mine = names.find(name => own.has(name));
      if (typeof mine === 'string' && not(own.has(names[0]))) context.report({node, messageId: 'behind', data: {name: mine}});
    });
  }
};

const html = {
  preprocess: text => [{
    text: text.split('\n').map(line => [...line.matchAll(/class="([^"]*)"/g)]
      .map(([, names]) => `${htmlClass}(${JSON.stringify(names)});`).join(' ')).join('\n'),
    filename: 'classes.htmlclasses'
  }],
  postprocess: messages => messages.flat()
};

export const classes = {
  rules: {'class-defined': classDefined, 'own-class-first': ownClassFirst},
  processors: {html}
};
