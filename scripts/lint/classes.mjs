import {readFileSync, readdirSync} from 'node:fs';
import {dirname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = join(root, 'src');

const sheets = directory => readdirSync(directory, {withFileTypes: true}).flatMap(entry =>
  entry.isDirectory() ? sheets(join(directory, entry.name)) : entry.name.endsWith('.css') ? [join(directory, entry.name)] : []);

const selectorsOf = sheet => [...readFileSync(sheet, 'utf8').replace(/\/\*[^]*?\*\//g, '').matchAll(/([^{};]+)\{/g)]
  .map(([, selector]) => selector.trim())
  .filter(selector => !selector.startsWith('@'))
  .map(selector => selector.replace(/"[^"]*"|'[^']*'/g, ''));

const classesIn = selector => [...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(([, name]) => name);

const isShared = sheet => {
  const path = relative(src, sheet);
  return path.startsWith('styles/') || path === 'index.css';
};

/** @type {Set<string>} */
const own = new Set();
/** @type {Set<string>} */
const shared = new Set();
for (const sheet of sheets(src)) {
  const into = isShared(sheet) ? shared : own;
  selectorsOf(sheet).flatMap(classesIn).forEach(name => into.add(name));
}
const defined = name => own.has(name) || shared.has(name);
/** @param {string} prefix */
const opens = prefix => [...own, ...shared].some(name => name.startsWith(prefix));

const htmlClass = '__htmlClass';

const wornClasses = (node, wear) => {
  switch (node?.type) {
    case 'Literal':
      if (typeof node.value === 'string') wear(node, node.value.split(/\s+/).filter(Boolean));
      return;
    case 'TemplateLiteral':
      node.quasis.forEach((quasi, at) => {
        const words = quasi.value.cooked.split(/\s+/);
        const tail = at < node.quasis.length - 1 ? words.pop() ?? '' : '';
        if (tail.length > 0) wear(node, [], [tail]);
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
  }
};

const firstWorn = node => {
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value.split(/\s+/).filter(Boolean);
  if (node?.type === 'CallExpression' && node.callee.name === 'classNames') {
    const statics = node.arguments.filter(argument => argument.type === 'Literal' && typeof argument.value === 'string');
    return node.arguments[0]?.type === 'Literal' ? statics.flatMap(argument => argument.value.split(/\s+/)) : undefined;
  }
  return undefined;
};

const classPositions = visit => ({
  JSXAttribute: node => {
    if (node.name.name !== 'className' || node.value === null) return;
    visit(node.value.type === 'JSXExpressionContainer' ? node.value.expression : node.value);
  },
  CallExpression: node => {
    const {callee} = node;
    if (callee.type === 'Identifier' && callee.name === htmlClass) visit(node.arguments[0]);
    if (callee.type === 'MemberExpression' && callee.object.property?.name === 'classList' && ['add', 'remove', 'toggle'].includes(callee.property.name)) {
      node.arguments.slice(0, callee.property.name === 'toggle' ? 1 : undefined).forEach(visit);
    }
  }
});

const classDefined = {
  meta: {type: 'problem', messages: {
    undefined: '"{{name}}" is read by no selector; a class an element wears is one a sheet reads',
    unopened: 'no class begins "{{prefix}}"; a class an element wears is one a sheet reads'
  }},
  create: context => classPositions(node => wornClasses(node, (at, names, prefixes = []) => {
    names.filter(name => !defined(name)).forEach(name => context.report({node: at, messageId: 'undefined', data: {name}}));
    prefixes.filter(prefix => !opens(prefix)).forEach(prefix => context.report({node: at, messageId: 'unopened', data: {prefix}}));
  }))
};

const ownClassFirst = {
  meta: {type: 'problem', messages: {
    behind: '"{{name}}" is this element\'s own class and comes first, before the shared words it wears'
  }},
  create: context => classPositions(node => {
    const names = firstWorn(node);
    const mine = names?.find(name => own.has(name));
    if (typeof mine === 'string' && !own.has(names[0])) context.report({node, messageId: 'behind', data: {name: mine}});
  })
};

const html = {
  preprocess: text => [{
    text: text.split('\n').map(line => [...line.matchAll(/class="([^"]*)"/g)]
      .map(([, names]) => `${htmlClass}(${JSON.stringify(names)});`).join(' ')).join('\n'),
    filename: 'classes.htmlclasses'
  }],
  postprocess: messages => messages.flat()
};

export default {
  rules: {'class-defined': classDefined, 'own-class-first': ownClassFirst},
  processors: {html}
};
