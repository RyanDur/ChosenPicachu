import {empty, has, maybe, not} from '@ryandur/sand';
import {limit} from './wrap.mjs';

const stringTokenTypes = new Set(['String', 'Template']);
const spaceClosedAtLineEnd = /^}[ \t]*\n/;
const endsInWord = /[^\s<>{}]$/;
const startsWithMarkup = /^[<{]/;
const lineBreakAhead = /^[ \t]*\n(?:[ \t]*\n)*([ \t]*)/;
const indentOfLine = /^[ \t]*/;
const lastWordOfLine = /^(.*\S)( +)([^\s<>{}]+)$/;
const firstWordOfLine = /^([^\s<>{}]+) +(\S.*)$/;

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

const american = {
  aluminium: 'aluminum', amongst: 'among', analogue: 'analog', analyse: 'analyze', analysed: 'analyzed',
  apologise: 'apologize', artefact: 'artifact', artefacts: 'artifacts', behaviour: 'behavior', behaviours: 'behaviors',
  cancelled: 'canceled', cancelling: 'canceling', catalogue: 'catalog', centre: 'center', centred: 'centered',
  centres: 'centers', cheque: 'check', colour: 'color', coloured: 'colored', colours: 'colors', cosy: 'cozy',
  customise: 'customize', defence: 'defense', emphasise: 'emphasize', enrol: 'enroll', favour: 'favor',
  favourite: 'favorite', finalise: 'finalize', flavour: 'flavor', focussed: 'focused', fulfil: 'fulfill',
  fuelled: 'fueled', grey: 'gray', honour: 'honor', initialise: 'initialize', judgement: 'judgment',
  labelled: 'labeled', labelling: 'labeling', labour: 'labor', levelled: 'leveled', licence: 'license',
  litre: 'liter', maximise: 'maximize', metre: 'meter', minimise: 'minimize', modelled: 'modeled',
  modelling: 'modeling', mould: 'mold', neighbour: 'neighbor', neighbours: 'neighbors', normalise: 'normalize',
  offence: 'offense', optimisation: 'optimization', optimise: 'optimize', optimised: 'optimized',
  organisation: 'organization', organise: 'organize', organised: 'organized', practise: 'practice',
  prioritise: 'prioritize', programme: 'program', realise: 'realize', realised: 'realized', recognise: 'recognize',
  recognised: 'recognized', sceptical: 'skeptical', serialise: 'serialize', signalled: 'signaled',
  summarise: 'summarize', theatre: 'theater', travelled: 'traveled', travelling: 'traveling', tyre: 'tire',
  utilise: 'utilize', visualise: 'visualize', whilst: 'while'
};
const quoting = new Set(['Quotation', 'blockquote', 'q']);
const wordsIn = /[A-Z]?[a-z]+|[A-Z]+(?![a-z])/g;
const quotedWords = /“[^”]*”/g;
const ariaLabelledBy = /labelled-?by/gi;

/**
 * @param {any} node
 * @returns {boolean}
 */
const quoted = node => has(node)
  && (node.type === 'JSXElement' && quoting.has(node.openingElement.name.name) || quoted(node.parent));

/**
 * A word spelled the British way, outside a quotation, which keeps its source's spelling,
 * and outside ARIA's labelledby.
 */
/** @type {import('eslint').Rule.RuleModule} */
const americanSpelling = {
  meta: {type: 'suggestion', schema: [], messages: {british: 'spell it the American way: {{american}}, not {{british}}'}},
  create(context) {
    /**
     * @param {object} node
     * @param {string} text
     */
    const check = (node, text) => {
      const ours = text.replace(quotedWords, '').replace(ariaLabelledBy, '');
      [...new Set(maybe(ours.match(wordsIn)).orElse([]).map(word => word.toLowerCase()))]
        .filter(word => Object.hasOwn(american, word))
        .forEach(british => context.report({node, messageId: 'british', data: {british, american: american[british]}}));
    };
    /**
     * @param {any} node
     * @param {string} text
     */
    const unlessQuoted = (node, text) => {
      if (not(quoted(node))) check(node, text);
    };
    return {
      Program: () => context.sourceCode.getAllComments().forEach(comment => check(comment, comment.value)),
      Identifier: node => check(node, node.name),
      JSXIdentifier: node => check(node, node.name),
      JSXText: node => unlessQuoted(node, node.value),
      Literal: node => {
        if (typeof node.value === 'string') unlessQuoted(node, node.value);
      },
      TemplateElement: node => unlessQuoted(node, maybe(node.value.cooked).orElse(''))
    };
  }
};

export const prose = {
  rules: {'breaks-between-words': breaksBetweenWords, 'american-spelling': americanSpelling},
  patterns: {
    spaceClosedAtLineEnd,
    endsInWord,
    startsWithMarkup,
    lineBreakAhead,
    indentOfLine,
    lastWordOfLine,
    firstWordOfLine
  }
};
