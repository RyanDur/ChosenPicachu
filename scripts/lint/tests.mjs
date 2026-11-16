import {is, not} from '@ryandur/sand';

const runners = new Set(['test', 'it', 'describe']);

/**
 * @param {any} node
 * @returns {any}
 */
const rootOf = node => node.type === 'MemberExpression' ? rootOf(node.object) : node;

/**
 * @param {any} node
 * @returns {string}
 */
const spelled = node => {
  if (not(is(node))) return '';
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'Literal') return String(node.value);
  if (node.type === 'MemberExpression') return `${spelled(node.object)}.${spelled(node.property)}`;
  return '';
};

/**
 * The page is read through these alone: console to hear what it reported, and scrollTo, which jsdom does not
 * carry out, to hear where it scrolled.
 * @param {any[]} args
 * @returns {boolean}
 */
const onlyListens = ([spiedOn, method]) => spelled(spiedOn) === 'console'
  || ['window', 'Element.prototype'].includes(spelled(spiedOn)) && spelled(method) === 'scrollTo';

/** @type {import('eslint').Rule.RuleModule} */
const noDoubleOfOurs = {
  meta: {
    type: 'problem',
    messages: {
      spied: 'a spy may only listen, on console or scrollTo; render the real thing and read what a reader meets',
      mocked: 'the world is stubbed only at its edge, the network through msw; render the real collaborators'
    }
  },
  create: context => ({
    'CallExpression[callee.object.name="vi"][callee.property.name="spyOn"]': node => {
      if (not(onlyListens(node.arguments))) context.report({node, messageId: 'spied'});
    },
    'CallExpression[callee.object.name="vi"][callee.property.name=/^(mock|doMock)$/]': node =>
      context.report({node, messageId: 'mocked'})
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
