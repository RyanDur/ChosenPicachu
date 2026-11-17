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
const irregularSpellings = {
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
  ...Object.entries(irregularSpellings)
]);
const wordsIn = /[A-Z]?[a-z]+|[A-Z]+(?![a-z])/g;
const ariaLabelledBy = /labelled-?by/gi;

/** @type {import('eslint').Rule.RuleModule} */
const americanSpelling = {
  meta: {type: 'suggestion', schema: [], messages: {british: 'spell it the American way: {{american}}, not {{british}}'}},
  create(context) {
    /**
     * @param {any} node
     * @param {string} name
     */
    const reportBritishWordsIn = (node, name) => [...new Set(maybe(name.replace(ariaLabelledBy, '').match(wordsIn))
      .orElse([]).map(word => word.toLowerCase()))]
      .filter(word => Object.hasOwn(american, word))
      .forEach(british => context.report({node, messageId: 'british', data: {british, american: american[british]}}));
    return {
      Identifier: node => reportBritishWordsIn(node, node.name),
      JSXIdentifier: node => reportBritishWordsIn(node, node.name)
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
