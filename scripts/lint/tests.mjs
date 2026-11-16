const platform = new Set([
  'window', 'document', 'navigator', 'console', 'globalThis', 'history', 'location', 'Date', 'Math', 'performance',
  'crypto', 'localStorage', 'sessionStorage'
]);
const platformElement = /^(Node|Element|Document|Window|EventTarget|HTML\w*Element|SVG\w*Element)$/;
const ours = /^[.@]/;

/**
 * @param {any} target
 * @returns {boolean}
 */
const ownedByThePlatform = target =>
  target.type === 'Identifier' && platform.has(target.name)
  || target.type === 'MemberExpression' && target.object.type === 'Identifier' && platformElement.test(target.object.name)
    && target.property.name === 'prototype';

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
      if (!ownedByThePlatform(node.arguments[0])) context.report({node, messageId: 'spied'});
    },
    'CallExpression[callee.object.name="vi"][callee.property.name=/^(mock|doMock)$/] > Literal.arguments:first-child': node => {
      if (ours.test(node.value)) context.report({node, messageId: 'mocked', data: {path: node.value}});
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
    'MemberExpression[object.name=/^(test|it|describe)$/][property.name="each"]': node =>
      context.report({node, messageId: 'drift'})
  })
};

export const tests = {rules: {'no-double-of-ours': noDoubleOfOurs, 'parameterized-for-drift': parameterizedForDrift}};
