import {relative} from 'node:path';
import {empty, has, not} from '@ryandur/sand';

const functionTypes = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration']);
const wrapperTypes = new Set(['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression', 'ParenthesizedExpression']);
const memoizers = new Set(['useCallback', 'memo']);
const definitionTypes = new Set(['Variable', 'FunctionName']);

/**
 * @param {any} node
 * @returns {any}
 */
const unwrapped = node => has(node) && wrapperTypes.has(node.type) ? unwrapped(node.expression) : node;

/**
 * @param {any} node
 * @returns {any}
 */
const functionIn = node => {
  const value = unwrapped(node);
  if (empty(value)) return undefined;
  if (functionTypes.has(value.type)) return value;
  const memoized = value.type === 'CallExpression' && value.callee.type === 'Identifier' && memoizers.has(value.callee.name);
  return memoized ? functionIn(value.arguments[0]) : undefined;
};

/**
 * @param {any} variable
 * @returns {any}
 */
const definitionOf = variable => {
  const [first] = variable?.defs ?? [];
  if (empty(first) || not(definitionTypes.has(first.type))) return undefined;
  const definition = first.node;
  return definition.type === 'VariableDeclarator' ? unwrapped(definition.init) : definition;
};

/** @type {import('eslint').Rule.RuleModule} */
const renderedAsJsx = {
  meta: {
    type: 'problem',
    schema: [{type: 'object', properties: {still: {type: 'array', items: {type: 'string'}}}, additionalProperties: false}],
    messages: {
      called: 'render {{name}} as JSX, <Name …/>, and name it in PascalCase if it isn\'t',
      mended: '{{file}} now keeps this rule: take it off stillCallComponents in eslint.config.cjs'
    }
  },
  create(context) {
    const file = relative(context.cwd, context.filename);
    /** @type {string[]} */
    const still = context.options[0]?.still ?? [];
    const source = context.sourceCode;
    const functionsReturningJsx = new Set();
    const callsByName = [];
    const variableOf = identifier =>
      source.getScope(identifier).references.find(each => each.identifier === identifier)?.resolved;
    /**
     * @param {any} node
     * @returns {boolean}
     */
    const isJsx = node => {
      const value = unwrapped(node);
      if (empty(value)) return false;
      if (value.type === 'JSXElement' || value.type === 'JSXFragment') return true;
      if (value.type === 'ConditionalExpression') return isJsx(value.consequent) || isJsx(value.alternate);
      if (value.type === 'LogicalExpression') return isJsx(value.right);
      if (value.type === 'Identifier') return isJsx(definitionOf(variableOf(value)));
      return false;
    };
    const enclosingFunction = node => source.getAncestors(node).findLast(ancestor => functionTypes.has(ancestor.type));
    return {
      'ArrowFunctionExpression[expression=true]': arrow => {
        if (isJsx(arrow.body)) functionsReturningJsx.add(arrow);
      },
      ReturnStatement: statement => {
        if (isJsx(statement.argument)) functionsReturningJsx.add(enclosingFunction(statement));
      },
      CallExpression: call => {
        if (call.callee.type === 'Identifier') callsByName.push({node: call, identifier: call.callee});
        const mapped = call.callee.type === 'MemberExpression' && call.callee.property.name === 'map';
        call.arguments.filter(argument => mapped && argument.type === 'Identifier')
          .forEach(argument => callsByName.push({node: argument, identifier: argument}));
      },
      'Program:exit': program => {
        const found = callsByName.filter(({identifier}) =>
          functionsReturningJsx.has(functionIn(definitionOf(variableOf(identifier)))));
        if (still.includes(file)) {
          if (empty(found)) context.report({node: program, messageId: 'mended', data: {file}});
          return;
        }
        found.forEach(({node, identifier}) => context.report({node, messageId: 'called', data: {name: identifier.name}}));
      }
    };
  }
};

export const components = {rules: {'rendered-as-jsx': renderedAsJsx}};
