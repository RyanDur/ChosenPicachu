import {is, not} from '@ryandur/sand';

/** @type {import('eslint').Rule.RuleModule} */
const noDiv = {
  meta: {
    type: 'problem',
    messages: {meaningless: 'a div means nothing to a reader; write the element that says what the part is, or let the parent\'s grid place its children'}
  },
  create: context => ({
    'JSXOpeningElement[name.type="JSXIdentifier"][name.name="div"]': node => context.report({node, messageId: 'meaningless'})
  })
};

/**
 * @param {any} node
 * @returns {any}
 */
const firstPartOf = node => node.children.find(child => child.type !== 'JSXText' || child.value.trim() !== '');

/**
 * @param {any} node
 * @param {string} name
 * @returns {boolean}
 */
const isElement = (node, name) => is(node) && node.type === 'JSXElement' && node.openingElement.name.name === name;

/** @type {import('eslint').Rule.RuleModule} */
const stepOpensWithItsHeading = {
  meta: {
    type: 'problem',
    messages: {unheaded: 'a step opens with its StepHeading, so a reader moving by headings reaches every step'}
  },
  create: context => ({
    'JSXElement[openingElement.name.name=/^(Dial)?Step$/]': node => {
      if (not(isElement(firstPartOf(node), 'StepHeading'))) context.report({node: node.openingElement, messageId: 'unheaded'});
    }
  })
};

/** @type {import('eslint').Rule.RuleModule} */
const fieldsetOpensWithItsLegend = {
  meta: {
    type: 'problem',
    messages: {unnamed: 'a fieldset is named by the legend that opens it, off screen when the group shows its own heading'}
  },
  create: context => ({
    'JSXElement[openingElement.name.name="fieldset"]': node => {
      if (not(isElement(firstPartOf(node), 'legend'))) context.report({node: node.openingElement, messageId: 'unnamed'});
    }
  })
};

/** @type {import('eslint').Rule.RuleModule} */
const noFooterInADialog = {
  meta: {
    type: 'problem',
    messages: {landmark: 'a footer inside a dialog is a second landmark; the dialog\'s actions sit in its form'}
  },
  create: context => ({
    'JSXElement[openingElement.name.name=/^(dialog|Modal)$/] JSXOpeningElement[name.name="footer"]': node =>
      context.report({node, messageId: 'landmark'})
  })
};

export const elements = {rules: {
  'no-div': noDiv,
  'step-opens-with-its-heading': stepOpensWithItsHeading,
  'fieldset-opens-with-its-legend': fieldsetOpensWithItsLegend,
  'no-footer-in-a-dialog': noFooterInADialog
}};
