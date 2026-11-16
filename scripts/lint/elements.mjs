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

/** @type {import('eslint').Rule.RuleModule} */
const stepOpensWithItsHeading = {
  meta: {
    type: 'problem',
    messages: {unheaded: 'a step opens with its StepHeading, so a reader moving by headings reaches every step'}
  },
  create: context => ({
    'JSXElement[openingElement.name.name=/^(Dial)?Step$/]': node => {
      const first = node.children.find(child => child.type !== 'JSXText' || child.value.trim() !== '');
      const opensWithHeading = first?.type === 'JSXElement' && first.openingElement.name.type === 'JSXIdentifier'
        && first.openingElement.name.name === 'StepHeading';
      if (!opensWithHeading) context.report({node: node.openingElement, messageId: 'unheaded'});
    }
  })
};

export const elements = {rules: {'no-div': noDiv, 'step-opens-with-its-heading': stepOpensWithItsHeading}};
