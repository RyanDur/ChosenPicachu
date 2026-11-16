import {empty, has, maybe, not} from '@ryandur/sand';
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
     * @param {import('eslint').AST.Token} token
     * @returns {boolean}
     */
    const heldAtLineEnd = token => token.value === "' '" && /^}[ \t]*\n/.test(source.text.slice(token.range[1]));
    /**
     * @param {number} line
     * @returns {boolean}
     */
    const stringsOn = line =>
      source.ast.tokens.some(token => exempt.has(token.type) && not(heldAtLineEnd(token)) && onLine(token, line));
    /**
     * @param {string} text
     * @param {boolean} exemptLine
     * @returns {boolean}
     */
    const fits = (text, exemptLine) => text.length <= limit || exemptLine;
    const endsInWord = /[^\s<>{}]$/;
    const startsWithMarkup = /^[<{]/;
    return {
      JSXExpressionContainer: held => {
        const {expression, parent} = held;
        if (expression.type !== 'Literal' || expression.value !== ' ') return;
        if (parent.type !== 'JSXElement' && parent.type !== 'JSXFragment') return;
        const after = source.text.slice(held.range[1]).match(/^[ \t]*\n(?:[ \t]*\n)*([ \t]*)/);
        if (empty(after)) return;
        const report = fix => context.report({node: held, messageId: 'beside', fix});
        const line = held.loc.start.line;
        const head = source.text.slice(held.range[0] - held.loc.start.column, held.range[0]);
        if (head.trim() === '') return report(null);
        const nextAt = held.range[1] + after[0].length;
        const nextLine = source.getLocFromIndex(nextAt).line;
        const indent = after[1];
        const proseIndent = head.match(/^[ \t]*/)[0];
        const next = source.lines[nextLine - 1].trimStart();
        const tokenBefore = held.range[0] - head.length;
        const headStrings = stringsOn(line);
        const nextStrings = stringsOn(nextLine);

        const moves = [
          {lines: [[`${head} ${next}`, headStrings || nextStrings, 0]], fix: fixer => fixer.replaceTextRange([held.range[0], nextAt], ' ')}
        ];

        const before = head.match(/^(.*\S)( +)([^\s<>{}]+)$/);
        if (has(before) && endsInWord.test(before[1])) {
          const [, kept, , word] = before;
          moves.push({
            lines: [[kept, headStrings, head.length], [`${proseIndent}${word} ${next}`, nextStrings, 0]],
            fix: fixer => fixer.replaceTextRange([tokenBefore + kept.length, nextAt], `\n${proseIndent}${word} `)
          });
        }

        const following = next.match(/^([^\s<>{}]+) +(\S.*)$/);
        if (has(following) && not(startsWithMarkup.test(following[2]))) {
          const [, word, rest] = following;
          moves.push({
            lines: [[`${head} ${word}`, headStrings, 0], [`${indent}${rest}`, nextStrings, indent.length + next.length]],
            fix: fixer => fixer.replaceTextRange([held.range[0], nextAt + word.length + 1], ` ${word}\n${indent}`)
          });
        }

        const within = moves.find(move => move.lines.every(([text, , was]) => text.length <= Math.max(limit, was)));
        const exempted = moves.find(move => move.lines.every(([text, exemptLine]) => fits(text, exemptLine)));
        return report(maybe(within).or(() => maybe(exempted)).map(move => move.fix).orNull());
      }
    };
  }
};

export const prose = {rules: {'breaks-between-words': breaksBetweenWords}};
