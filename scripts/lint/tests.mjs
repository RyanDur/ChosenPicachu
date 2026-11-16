import {not} from '@ryandur/sand';
import {structure} from './structure.mjs';

const platform = new Set([
  'window', 'document', 'navigator', 'console', 'globalThis', 'history', 'location', 'Date', 'Math', 'performance',
  'crypto', 'localStorage', 'sessionStorage'
]);
const platformClass = /^(Node|Element|Document|Window|EventTarget|Storage|HTML\w*Element|SVG\w*Element|\w+Observer)$/;
const runners = new Set(['test', 'it', 'describe']);

/**
 * @param {any} node
 * @returns {any}
 */
const rootOf = node => node.type === 'MemberExpression' ? rootOf(node.object) : node;

/**
 * @param {any} target
 * @returns {boolean}
 */
const ownedByThePlatform = target => {
  const root = rootOf(target);
  if (root.type !== 'Identifier') return false;
  if (platform.has(root.name)) return true;
  return platformClass.test(root.name) && target.type === 'MemberExpression' && target.object === root
    && target.property.name === 'prototype';
};

/**
 * @param {string} path
 * @returns {boolean}
 */
const ours = path => path.startsWith('.')
  || structure.aliases.some(alias => path === alias || path.startsWith(`${alias}/`));

/**
 * @param {any} argument
 * @returns {string}
 */
const pathIn = argument => {
  if (argument.type === 'Literal' && typeof argument.value === 'string') return argument.value;
  if (argument.type === 'TemplateLiteral' && argument.expressions.length === 0) return argument.quasis[0].value.cooked;
  if (argument.type === 'ImportExpression') return pathIn(argument.source);
  return '';
};

/** @type {import('eslint').Rule.RuleModule} */
const noDoubleOfOurs = {
  meta: {
    type: 'problem',
    messages: {
      spied: 'spy on what the platform owns, never on our own code: render the real thing and read what a reader meets',
      mocked: 'mock what crosses the network, never our own module: {{path}} is ours'
    }
  },
  create: context => ({
    'CallExpression[callee.object.name="vi"][callee.property.name="spyOn"]': node => {
      if (not(ownedByThePlatform(node.arguments[0]))) context.report({node, messageId: 'spied'});
    },
    'CallExpression[callee.object.name="vi"][callee.property.name=/^(mock|doMock)$/]': node => {
      const path = pathIn(node.arguments[0]);
      if (ours(path)) context.report({node, messageId: 'mocked', data: {path}});
    }
  })
};

/** @type {import('eslint').Rule.RuleModule} */
const parameterizedForDrift = {
  meta: {
    type: 'problem',
    messages: {
      drift: 'a parameterized test guards drift only: one behavior across browsers, operating systems, engines, the site\'s ' +
        'builds of one feature, or every page in the site\'s page list; disable this rule with a reason that names the drift'
    }
  },
  create: context => ({
    'MemberExpression[property.name=/^(each|for)$/]': node => {
      const root = rootOf(node.object);
      if (root.type === 'Identifier' && runners.has(root.name)) context.report({node, messageId: 'drift'});
    }
  })
};

export const tests = {rules: {'no-double-of-ours': noDoubleOfOurs, 'parameterized-for-drift': parameterizedForDrift}};
