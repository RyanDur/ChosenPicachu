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

const british = (word, american) => [{messageId: 'british', data: {british: word, american}}];

tester.run('american-spelling', prose.rules['american-spelling'], {
  valid: [
    {name: 'should accept a name spelled the American way', code: 'const colorOfCenter = 1;'},
    {name: 'should accept ARIA’s labelledby', code: '<div aria-labelledby="x" />;'},
    {name: 'should accept ARIA’s labelledby spelled as a property', code: 'const props = {ariaLabelledBy: 1};'},
    {name: 'should accept the American plural analyses', code: 'const analyses = 1;'},
    {name: 'should leave a string to the reader', code: "const said = 'the colour';"}
  ],
  invalid: [
    {name: 'should refuse a British name', code: 'const colour = 1;', errors: british('colour', 'color')},
    {name: 'should refuse a British word inside a camel-cased name', code: 'const wayLabelled = 1;', errors: british('labelled', 'labeled')},
    {name: 'should refuse a British word in capitals', code: 'const COLOUR = 1;', errors: british('colour', 'color')},
    {name: 'should refuse a British JSX name', code: '<Colour />;', errors: british('colour', 'color')},
    {name: 'should report a word said twice in one name once', code: 'const colourOnColour = 1;', errors: british('colour', 'color')},
    {name: 'should refuse an -ise verb’s form', code: 'const initialised = 1;', errors: british('initialised', 'initialized')},
    {name: 'should refuse an -our word with an ending', code: 'const colourful = 1;', errors: british('colourful', 'colorful')},
    {name: 'should refuse an -re word’s form', code: 'const centred = 1;', errors: british('centred', 'centered')},
    {name: 'should refuse a doubled l', code: 'const fuelling = 1;', errors: british('fuelling', 'fueling')},
    {name: 'should refuse an irregular spelling', code: 'const analysed = 1;', errors: british('analysed', 'analyzed')},
    {name: 'should refuse a plain plural', code: 'const cheques = 1;', errors: british('cheques', 'checks')}
  ]
});
