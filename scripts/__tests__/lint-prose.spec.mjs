import {RuleTester} from 'eslint';
import parser from '@babel/eslint-parser';
import {prose} from '../lint/prose.mjs';

const tester = new RuleTester({languageOptions: {
  parser,
  parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript'], plugins: ['@babel/plugin-syntax-jsx']}}
}});

const long = 'words '.repeat(17).trim();

tester.run('breaks-between-words', prose.rules['breaks-between-words'], {
  valid: [
    {name: 'should accept prose that breaks between two words', code: 'const said = <p>\n  read the\n  <a href="/">record</a> first\n</p>;'},
    {name: 'should accept a space held mid-line', code: 'const said = <p>\n  read the{\' \'}<a href="/">record</a>\n</p>;'},
    {name: 'should accept a line break held at a line\'s end, which a code sample keeps', code: 'const sample = <span>\n  x =&gt;{\'\\n\'}\n</span>;'}
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
    }
  ]
});
