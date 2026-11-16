import {RuleTester} from 'eslint';
import parser from '@babel/eslint-parser';
import {prose} from '../lint/prose.mjs';

const tester = new RuleTester({languageOptions: {
  parser,
  parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript'], plugins: ['@babel/plugin-syntax-jsx']}}
}});

const long = 'words '.repeat(17).trim();
const half = 'words '.repeat(10).trim();
const page = `/${'x'.repeat(60)}`;

tester.run('breaks-between-words', prose.rules['breaks-between-words'], {
  valid: [
    {name: 'should accept prose that breaks between two words', code: 'const said = <p>\n  read the\n  <a href="/">record</a> first\n</p>;'},
    {name: 'should accept a space held mid-line', code: 'const said = <p>\n  read the{\' \'}<a href="/">record</a>\n</p>;'},
    {name: 'should accept a line break held at a line\'s end, which a code sample keeps', code: 'const sample = <span>\n  x =&gt;{\'\\n\'}\n</span>;'},
    {name: 'should leave a space held as an attribute value alone', code: 'export const said = <abbr title={\' \'}\n  className="term"/>;'}
  ],
  invalid: [
    {
      name: 'should join an element up onto the line where it fits',
      code: 'const said = <p>\n  read the{\' \'}\n  <a href="/">record</a> first\n</p>;',
      output: 'const said = <p>\n  read the <a href="/">record</a> first\n</p>;',
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should join two elements onto one line where they fit',
      code: 'const said = <p>\n  <cite>Weaving the Web</cite>{\' \'}\n  <a href="/">read it</a>\n</p>;',
      output: 'const said = <p>\n  <cite>Weaving the Web</cite> <a href="/">read it</a>\n</p>;',
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should carry the word before the break down at the prose\'s indent when the join runs long',
      code: `const said = <p>\n    ${long} the{' '}\n  <b>${long}</b>\n</p>;`,
      output: `const said = <p>\n    ${long}\n    the <b>${long}</b>\n</p>;`,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should carry the word after the break up when the join runs long and the word before it cannot move',
      code: `const said = <p>\n  <b>${long}</b>.{' '}\n  says, ${long}\n</p>;`,
      output: `const said = <p>\n  <b>${long}</b>. says,\n  ${long}\n</p>;`,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should leave the break to a person when no move fits',
      code: `const said = <p>\n  <b>${long} ${long}</b>{' '}\n  <i>${long} ${long}</i>\n</p>;`,
      output: null,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should not carry a word down when an element would end the line it leaves',
      code: `const said = <p>\n  ${long} <b>bold</b> the{' '}\n  <i>${long}</i>\n</p>;`,
      output: null,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should not carry a word up when an element would start the line it leaves',
      code: `const said = <p>\n  <b>${long}</b>{' '}\n  says <i>${long}</i>\n</p>;`,
      output: null,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should leave a space held on a line of its own to a person',
      code: 'const said = <p>\n  read the\n  {\' \'}\n  <a href="/">record</a>\n</p>;',
      output: null,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should leave a space held on its own line after an element to a person',
      code: 'const said = <p>\n  <code className="monospaced">read</code>\n  {\' \'}\n  read read\n</p>;',
      output: null,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should join across a blank line to the next line with content',
      code: 'const said = <p>\n  read the{\' \'}\n\n  <b>record</b>\n</p>;',
      output: 'const said = <p>\n  read the <b>record</b>\n</p>;',
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should not count the next line\'s own space as a string that lets the join run long',
      code: `const said = <p>\n  ${long} the{' '}\n  <b>${long}</b>{' '}\n  <i>${long}</i>\n</p>;`,
      output: `const said = <p>\n  ${long}\n  the <b>${long}</b>{' '}\n  <i>${long}</i>\n</p>;`,
      errors: [{messageId: 'beside'}, {messageId: 'beside'}]
    },
    {
      name: 'should carry a word within 120 columns before joining a line that only a string lets run long',
      code: `const said = <p>\n  <b title="lead">bold</b> ${half} the{' '}\n  <i>${half}</i>\n</p>;`,
      output: `const said = <p>\n  <b title="lead">bold</b> ${half}\n  the <i>${half}</i>\n</p>;`,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should join a line that only a string lets run long when no move fits within 120 columns',
      code: `const said = <p>\n  <a href="/record">${long}</a>{' '}\n  <i>${long}</i>\n</p>;`,
      output: `const said = <p>\n  <a href="/record">${long}</a> <i>${long}</i>\n</p>;`,
      errors: [{messageId: 'beside'}]
    },
    {
      name: 'should carry a word down from a line a string already runs past 120, since that line only shortens',
      code: `const said = <p>\n  <a href="${page}">x</a> ${half} the{' '}\n  <i>${half}</i>\n</p>;`,
      output: `const said = <p>\n  <a href="${page}">x</a> ${half}\n  the <i>${half}</i>\n</p>;`,
      errors: [{messageId: 'beside'}]
    }
  ]
});
