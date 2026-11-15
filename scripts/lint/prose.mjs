import {empty, has} from '@ryandur/sand';
import {limit} from './wrap.mjs';

const exempt = new Set(['String', 'Template']);

/** A space held in `{' '}` at a line's end, which JSX needs only because the break sits beside an element. */
/** @type {import('eslint').Rule.RuleModule} */
const breaksBetweenWords = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: {beside: 'prose breaks between two words, never beside an element; join the line or move a word across the break'}
  },
  create(context) {
    const source = context.sourceCode;
    /**
     * @param {import('eslint').AST.Token} token
     * @param {number} line
     * @returns {boolean}
     */
    const onLine = (token, line) => token.loc.start.line <= line && token.loc.end.line >= line;
    /**
     * @param {number} line
     * @param {number} spaceAt
     * @returns {boolean}
     */
    const stringsOn = (line, spaceAt) =>
      source.ast.tokens.some(token => exempt.has(token.type) && token.range[0] !== spaceAt && onLine(token, line));
    /**
     * @param {string} text
     * @param {boolean} exemptLine
     * @returns {boolean}
     */
    const fits = (text, exemptLine) => text.length <= limit || exemptLine;
    return {
      JSXExpressionContainer: held => {
        const {expression} = held;
        if (expression.type !== 'Literal' || expression.value !== ' ') return;
        const after = source.text.slice(held.range[1]).match(/^[ \t]*\n([ \t]*)/);
        if (empty(after)) return;
        const line = held.loc.start.line;
        const head = source.text.slice(held.range[0] - held.loc.start.column, held.range[0]);
        const nextAt = held.range[1] + after[0].length;
        const indent = after[1];
        const proseIndent = head.match(/^[ \t]*/)[0];
        const next = source.lines[line];
        const tokenBefore = held.range[0] - head.length;
        const headStrings = stringsOn(line, expression.range[0]);
        const nextStrings = stringsOn(line + 1, expression.range[0]);
        const report = fix => context.report({node: held, messageId: 'beside', fix});

        const joined = `${head} ${next.trimStart()}`;
        if (fits(joined, headStrings || nextStrings)) return report(fixer => fixer.replaceTextRange([held.range[0], nextAt], ' '));

        const before = head.match(/^(.*\S)( +)([^\s<>{}]+)$/);
        if (has(before)) {
          const kept = before[1];
          const word = before[3];
          if (fits(kept, headStrings) && fits(`${proseIndent}${word} ${next.trimStart()}`, nextStrings)) {
            const wordAt = tokenBefore + kept.length;
            return report(fixer => fixer.replaceTextRange([wordAt, nextAt], `\n${proseIndent}${word} `));
          }
        }

        const following = next.trimStart().match(/^([^\s<>{}]+) +(\S.*)$/);
        if (has(following)) {
          const [, word, rest] = following;
          if (fits(`${head} ${word}`, headStrings) && fits(`${indent}${rest}`, nextStrings)) {
            return report(fixer => fixer.replaceTextRange([held.range[0], nextAt + word.length + 1], ` ${word}\n${indent}`));
          }
        }
        return report(null);
      }
    };
  }
};

export const prose = {rules: {'breaks-between-words': breaksBetweenWords}};
