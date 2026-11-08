import {has} from '@ryandur/sand';

const isFunction = node => ['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'].includes(node.type);

/**
 * Whether an expression is JSX, or a choice between values one of which is.
 * @param {{type: string, consequent?: object, alternate?: object, right?: object} | null | undefined} node
 * @returns {boolean}
 */
const isJsx = node => has(node) && (['JSXElement', 'JSXFragment'].includes(node.type)
  || (node.type === 'ConditionalExpression' && (isJsx(node.consequent) || isJsx(node.alternate)))
  || (node.type === 'LogicalExpression' && isJsx(node.right)));

const nameOf = fn => fn.type === 'FunctionDeclaration'
  ? fn.id?.name
  : fn.parent.type === 'VariableDeclarator' && fn.parent.id.type === 'Identifier' ? fn.parent.id.name : undefined;

/** A function that returns JSX, called by name or handed to `.map`, where it should be rendered as a component. */
/** @type {import('eslint').Rule.RuleModule} */
const renderedAsJsx = {
  meta: {
    type: 'problem',
    messages: {called: '{{name}} returns JSX, so it is a component: name it in PascalCase and render it as JSX'}
  },
  create(context) {
    const returningJsx = new Set();
    const uses = [];
    const enclosing = node => context.sourceCode.getAncestors(node).findLast(isFunction);
    const mark = fn => {
      const name = has(fn) ? nameOf(fn) : undefined;
      if (has(name)) returningJsx.add(name);
    };
    return {
      'ArrowFunctionExpression[expression=true]': fn => isJsx(fn.body) && mark(fn),
      ReturnStatement: node => isJsx(node.argument) && mark(enclosing(node)),
      CallExpression: node => {
        if (node.callee.type === 'Identifier') uses.push({node, name: node.callee.name});
        const mapped = node.callee.type === 'MemberExpression' && node.callee.property.name === 'map';
        node.arguments.filter(argument => mapped && argument.type === 'Identifier')
          .forEach(argument => uses.push({node: argument, name: argument.name}));
      },
      'Program:exit': () => uses.filter(({name}) => returningJsx.has(name)).forEach(({node, name}) => context.report({
        node,
        messageId: 'called',
        data: {name}
      }))
    };
  }
};

export const components = {rules: {'rendered-as-jsx': renderedAsJsx}};
