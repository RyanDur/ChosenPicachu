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

export const elements = {rules: {'no-div': noDiv}};
