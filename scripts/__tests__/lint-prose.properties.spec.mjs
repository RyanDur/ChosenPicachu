import {not} from '@ryandur/sand';
import fc from 'fast-check';
import {Linter} from 'eslint';
import parser from '@babel/eslint-parser';
import {transformSync} from 'rolldown/utils';
import {runInNewContext} from 'node:vm';
import {prose} from '../lint/prose.mjs';

const linter = new Linter({configType: 'flat'});
const config = [{
  files: ['**/*.jsx'],
  languageOptions: {
    parser,
    parserOptions: {requireConfigFile: false, babelOptions: {plugins: ['@babel/plugin-syntax-jsx']}}
  },
  plugins: {prose},
  rules: {'prose/breaks-between-words': 'error'}
}];

const fixed = code => linter.verifyAndFix(code, config, {filename: 'prose.jsx'}).output;

// The text a reader meets: Vite's own compiler turns the JSX into calls with the language's whitespace rules, and
// each element renders its children's text.
const rendered = code => {
  const compiled = transformSync('prose.jsx', code, {jsx: {runtime: 'classic'}}).code;
  const React = {createElement: (_, __, ...children) => children.flat().join('')};
  return runInNewContext(`${compiled}said;`, {React});
};

const word = fc.constantFrom(
  'read', 'the', 'record', 'first,', 'a', 'details', 'element.', 'Berners-Lee’s', 'web',
  'interpolate-size-and-a-long-run-of-words-that-pushes-the-line-past-its-limit');
const words = count => fc.array(word, {minLength: 1, maxLength: count}).map(chosen => chosen.join(' '));
const element = fc.oneof(
  words(4).map(text => `<b>${text}</b>`),
  words(2).map(text => `<code className="monospaced">${text}</code>`),
  words(3).map(text => `<a href="/record">${text}</a>`)
);
const piece = fc.oneof({arbitrary: words(12).map(text => ({text, element: false})), weight: 2},
  element.map(text => ({text, element: true})));

// How a person writes prose in JSX: a space between pieces on one line, a plain break between two words, and a
// space held as {' '} beside an element's break: at the line's end, on a line of its own, or before a blank line.
const heldBreak = fc.constantFrom('{\' \'}\n  ', '\n  {\' \'}\n  ', '{\' \'}\n\n  ');
const gap = fc.record({breaks: fc.boolean(), held: heldBreak});

const paragraph = fc.array(fc.tuple(piece, gap), {minLength: 2, maxLength: 14}).map(pieces => {
  const body = pieces.map(([{text}], index) => {
    if (index === 0) return text;
    const [{element: before}, {breaks, held}] = pieces[index - 1];
    const [{element: after}] = pieces[index];
    if (not(breaks)) return ` ${text}`;
    return before || after ? `${held}${text}` : `\n  ${text}`;
  }).join('');
  return `const said = <p>\n  ${body}\n</p>;\n`;
});

describe('the prose lint, over any paragraph', () => {
  test('its fix never changes the text a reader meets', () => {
    fc.assert(fc.property(paragraph, code => {
      expect(rendered(fixed(code))).toBe(rendered(code));
    }));
  });
});
