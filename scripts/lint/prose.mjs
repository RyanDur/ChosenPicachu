import {empty, has, is, maybe, not} from '@ryandur/sand';
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

const roots = {
  aluminium: 'aluminum', amongst: 'among', artefact: 'artifact', behaviour: 'behavior', centre: 'center',
  cheque: 'check', colour: 'color', cosy: 'cozy', defence: 'defense', favour: 'favor', flavour: 'flavor',
  focussed: 'focused', honour: 'honor', judgement: 'judgment', labour: 'labor', licence: 'license', litre: 'liter',
  metre: 'meter', mould: 'mold', neighbour: 'neighbor', offence: 'offense', programme: 'program',
  sceptical: 'skeptical', theatre: 'theater', tyre: 'tire', whilst: 'while'
};
const verbsEndingIse = ['apologise', 'customise', 'emphasise', 'finalise', 'initialise', 'maximise', 'minimise',
  'normalise', 'optimise', 'organise', 'prioritise', 'realise', 'recognise', 'serialise', 'summarise', 'utilise',
  'visualise'];
const doubledL = ['cancel', 'channel', 'dial', 'duel', 'fuel', 'funnel', 'label', 'level', 'model', 'quarrel', 'signal',
  'total', 'travel', 'tunnel'];
const forms = {
  analyse: 'analyze', analysed: 'analyzed', analysing: 'analyzing', analyser: 'analyzer',
  analogue: 'analog', analogues: 'analogs', catalogue: 'catalog', catalogues: 'catalogs', catalogued: 'cataloged',
  cataloguing: 'cataloging', enrol: 'enroll', enrols: 'enrolls', enrolment: 'enrollment', fulfil: 'fulfill',
  fulfils: 'fulfills', fulfilment: 'fulfillment', grey: 'gray', greys: 'grays', greyed: 'grayed', greying: 'graying',
  greyish: 'grayish', practise: 'practice', practised: 'practiced', practises: 'practices', practising: 'practicing'
};

/**
 * @param {string} british
 * @param {string} american
 * @param {[string, string][]} endings
 * @returns {[string, string][]}
 */
const ending = (british, american, endings) => endings.map(([ours, theirs]) => [british + ours, american + theirs]);
const sharedEndings = (/** @type {string[]} */ ...endings) =>
  endings.map(end => /** @type {[string, string]} */ ([end, end]));

/**
 * @param {[string, string]} root
 * @returns {[string, string][]}
 */
const family = ([british, american]) => {
  if (british.endsWith('our'))
    return ending(british, american, sharedEndings('', 's', 'ed', 'ing', 'ful', 'less', 'able', 'ite', 'ites'));
  if (british.endsWith('re') && american.endsWith('er'))
    return ending(british.slice(0, -2), american.slice(0, -2),
      [['re', 'er'], ['res', 'ers'], ['red', 'ered'], ['ring', 'ering']]);
  return ending(british, american, sharedEndings('', 's'));
};
const american = Object.fromEntries([
  ...Object.entries(roots).flatMap(family),
  ...verbsEndingIse.flatMap(verb => ending(verb.slice(0, -1), `${verb.slice(0, -2)}z`,
    sharedEndings('e', 'ed', 'es', 'ing', 'er', 'ers', 'ation', 'ations'))),
  ...doubledL.flatMap(root => ending(root, root, [['led', 'ed'], ['ling', 'ing'], ['ler', 'er'], ['lers', 'ers']])),
  ...Object.entries(forms)
]);
const quoting = new Set(['Quotation', 'Attribution', 'blockquote', 'q', 'cite']);
const wordsIn = /[A-Z]?[a-z]+|[A-Z]+(?![a-z])/g;
const quoteMarks = /[“”‘]|’(?![a-z])/gi;
const straightQuoted = /"[^"\n]*"/g;
const address = /\bhttps?:\/\/[^\s"'`<>)]+/g;
const ariaLabelledBy = /labelled-?by/gi;

/**
 * @param {any} node
 * @returns {boolean}
 */
const quoted = node => has(node)
  && (node.type === 'JSXElement' && quoting.has(node.openingElement.name.name) || quoted(node.parent));

/**
 * @param {string} text
 * @param {RegExp} pattern
 */
const spacedOut = (text, pattern) => text.replace(pattern, found => ' '.repeat(found.length));

/**
 * @typedef {{node: any, range: [number, number], container: object, prose: boolean}} Text
 */

/** @type {import('eslint').Rule.RuleModule} */
const americanSpelling = {
  meta: {type: 'suggestion', schema: [], messages: {british: 'spell it the American way: {{american}}, not {{british}}'}},
  create(context) {
    const source = context.sourceCode.text;
    /** @type {Text[]} */
    const texts = [];
    /** @type {Text[]} */
    const names = [];

    // The parser splits a sentence around markup and placeholders, so a quotation's marks can sit in two text nodes
    // of one element or one template. Marks pair within that element or template, never across code.
    const quotationsIn = (/** @type {Text[]} */ held) => {
      /** @type {Map<object, number[]>} */
      const marksBy = new Map();
      held.forEach(({range: [from, to], container}) => [...source.slice(from, to).matchAll(quoteMarks)]
        .forEach(mark => marksBy.set(container, [...maybe(marksBy.get(container)).orElse([]), from + mark.index])));
      return [...marksBy.values()].flatMap(marks => marks.reduce((spans, at) => {
        const opening = source[at] === '“' || source[at] === '‘';
        const open = spans.findLast(span => span.length === 1 && (source[span[0]] === '“') === (source[at] === '”'));
        if (opening) return [...spans, [at]];
        return is(open) ? spans.map(span => span === open ? [span[0], at] : span) : spans;
      }, /** @type {number[][]} */ ([])).filter(span => span.length === 2));
    };

    /**
     * @param {Text} text
     * @param {number[][]} quotations
     */
    const reportBritishWordsIn = ({node, range: [from, to], prose}, quotations) => {
      const masks = [address, ariaLabelledBy, ...prose ? [straightQuoted] : []];
      const shown = masks.reduce(spacedOut, source.slice(from, to));
      const inQuotation = (/** @type {number} */ at) => quotations.some(([open, close]) => open <= at && at < close);
      [...new Set([...shown.matchAll(wordsIn)]
        .filter(found => not(inQuotation(from + found.index)))
        .map(found => found[0].toLowerCase()))]
        .filter(word => Object.hasOwn(american, word))
        .forEach(british => context.report({node, messageId: 'british', data: {british, american: american[british]}}));
    };

    /**
     * @param {any} node
     * @param {[number, number]} range
     * @param {object} container
     * @param {boolean} prose
     */
    const hold = (node, range, container, prose) => {
      if (not(quoted(node))) texts.push({node, range, container, prose});
    };
    return {
      Identifier: node => names.push({node, range: node.range, container: node, prose: false}),
      JSXIdentifier: node => names.push({node, range: node.range, container: node, prose: false}),
      JSXText: node => hold(node, node.range, node.parent, true),
      Literal: node => {
        if (typeof node.value === 'string') hold(node, node.range, node, false);
      },
      TemplateElement: node => hold(node, node.range, node.parent, false),
      'Program:exit': () => {
        const comments = context.sourceCode.getAllComments()
          .map(comment => ({node: comment, range: comment.range, container: comment, prose: true}));
        const quotations = quotationsIn([...texts, ...comments]);
        [...texts, ...comments].forEach(text => reportBritishWordsIn(text, quotations));
        names.forEach(name => reportBritishWordsIn(name, []));
      }
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
