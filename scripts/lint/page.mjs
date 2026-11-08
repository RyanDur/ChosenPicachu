import {has, not} from '@ryandur/sand';
const globals = new Set(['document', 'window']);

/**
 * A reference to the page's document or window. ESLint's no-restricted-globals did this until Babel's scope manager
 * counted a TypeScript member's name, `window: string`, as a read of the global.
 * @param {import('estree').Node & {parent?: import('estree').Node & {key?: unknown}}} identifier
 */
const isTypeMember = identifier =>
  has(identifier.parent) && identifier.parent.type.startsWith('TS') && identifier.parent.key === identifier;

/** @type {import('eslint').Rule.RuleModule} */
const noPageGlobals = {
  meta: {
    type: 'problem',
    messages: {reached: 'React code never reaches for the {{name}}; a vanilla build lives in its own directory'}
  },
  create(context) {
    return {
      'Program:exit'(program) {
        const scope = context.sourceCode.getScope(program);
        scope.through
          .filter(reference => globals.has(reference.identifier.name) && not(isTypeMember(reference.identifier)))
          .forEach(reference => context.report({
            node: reference.identifier, messageId: 'reached', data: {name: reference.identifier.name}
          }));
      }
    };
  }
};

export const page = {rules: {'no-page-globals': noPageGlobals}};
