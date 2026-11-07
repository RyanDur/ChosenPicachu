const limit = 120;

/** A value wrapped onto its own line after `=` that would fit on the line before it. */
/** @type {import('eslint').Rule.RuleModule} */
const needlessWrap = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    messages: {fits: 'this fits on the line above at {{length}} characters; join it'}
  },
  create(context) {
    const source = context.sourceCode;
    /**
     * @param {import('eslint').AST.Token | null} operator
     * @param {import('estree').Node} value
     */
    const check = (operator, value) => {
      if (operator === null) return;
      const before = operator.loc.end.line;
      const at = value.loc.start.line;
      if (at === before || value.loc.end.line !== at) return;
      const next = source.getTokenAfter(operator, {includeComments: true});
      if (next.type === 'Line' || next.type === 'Block') return;
      const joined = `${source.lines[before - 1].trimEnd()} ${source.lines[at - 1].trimStart()}`;
      if (joined.length > limit || at - before > 1) return;
      context.report({
        node: value,
        messageId: 'fits',
        data: {length: joined.length},
        fix: fixer => fixer.replaceTextRange([operator.range[1], value.range[0]], ' ')
      });
    };
    const assigned = (left, operator, right) =>
      check(source.getFirstTokenBetween(left, right, token => token.value === operator), right);
    return {
      VariableDeclarator: node => node.init && assigned(node.id, '=', node.init),
      AssignmentExpression: node => assigned(node.left, node.operator, node.right)
    };
  }
};

export const wrap = {rules: {'needless-wrap': needlessWrap}};
