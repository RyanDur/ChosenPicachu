import {empty, has, maybe, not} from '@ryandur/sand';
import {limit} from './wrap.mjs';

const stringTokenTypes = new Set(['String', 'Template']);
export const spaceClosedAtLineEnd = /^}[ \t]*\n/;
export const endsInWord = /[^\s<>{}]$/;
export const startsWithMarkup = /^[<{]/;
export const lineBreakAhead = /^[ \t]*\n(?:[ \t]*\n)*([ \t]*)/;
export const indentOfLine = /^[ \t]*/;
export const lastWordOfLine = /^(.*\S)( +)([^\s<>{}]+)$/;
export const firstWordOfLine = /^([^\s<>{}]+) +(\S.*)$/;

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
    const heldAtLineEnd = token => token.value === "' '" && spaceClosedAtLineEnd.test(source.text.slice(token.range[1]));
    /**
     * @param {number} line
     * @returns {boolean}
     */
    const stringsOn = line =>
      source.ast.tokens.some(token =>
        stringTokenTypes.has(token.type) && not(heldAtLineEnd(token)) && onLine(token, line));
    /**
     * @param {string} text
     * @param {boolean} exemptLine
     * @returns {boolean}
     */
    const fits = (text, exemptLine) => text.length <= limit || exemptLine;
    return {
      JSXExpressionContainer: held => {
        const {expression, parent} = held;
        if (expression.type !== 'Literal' || expression.value !== ' ') return;
        if (parent.type !== 'JSXElement' && parent.type !== 'JSXFragment') return;
        const lineBreak = source.text.slice(held.range[1]).match(lineBreakAhead);
        if (empty(lineBreak)) return;
        const report = fix => context.report({node: held, messageId: 'beside', fix});
        const lineNumber = held.loc.start.line;
        const textBeforeSpace = source.text.slice(held.range[0] - held.loc.start.column, held.range[0]);
        if (textBeforeSpace.trim() === '') return report(null);
        const nextAt = held.range[1] + lineBreak[0].length;
        const nextLineNumber = source.getLocFromIndex(nextAt).line;
        const nextLineIndent = lineBreak[1];
        const proseIndent = textBeforeSpace.match(indentOfLine)[0];
        const nextLineText = source.lines[nextLineNumber - 1].trimStart();
        const lineStart = held.range[0] - textBeforeSpace.length;
        const stringOnThisLine = stringsOn(lineNumber);
        const stringOnNextLine = stringsOn(nextLineNumber);

        const moves = [
          {lines: [[`${textBeforeSpace} ${nextLineText}`, stringOnThisLine || stringOnNextLine, 0]], fix: fixer => fixer.replaceTextRange([held.range[0], nextAt], ' ')}
        ];

        const wordBeforeBreak = textBeforeSpace.match(lastWordOfLine);
        if (has(wordBeforeBreak) && endsInWord.test(wordBeforeBreak[1])) {
          const [, kept, , word] = wordBeforeBreak;
          moves.push({
            lines: [[kept, stringOnThisLine, textBeforeSpace.length], [`${proseIndent}${word} ${nextLineText}`, stringOnNextLine, 0]],
            fix: fixer => fixer.replaceTextRange([lineStart + kept.length, nextAt], `\n${proseIndent}${word} `)
          });
        }

        const wordAfterBreak = nextLineText.match(firstWordOfLine);
        if (has(wordAfterBreak) && not(startsWithMarkup.test(wordAfterBreak[2]))) {
          const [, word, rest] = wordAfterBreak;
          moves.push({
            lines: [[`${textBeforeSpace} ${word}`, stringOnThisLine, 0], [`${nextLineIndent}${rest}`, stringOnNextLine, nextLineIndent.length + nextLineText.length]],
            fix: fixer => fixer.replaceTextRange([held.range[0], nextAt + word.length + 1], ` ${word}\n${nextLineIndent}`)
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
