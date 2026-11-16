import {RuleTester} from 'eslint';
import {elements} from '../lint/elements.mjs';

const tester = new RuleTester({languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}}});

tester.run('no-div', elements.rules['no-div'], {
  valid: [
    {name: 'should accept an element that says what it is', code: 'export const s = <section aria-label="steps"><p>one</p></section>;'},
    {name: 'should accept a component whose name holds the word', code: 'export const d = <Divider/>;'}
  ],
  invalid: [
    {name: 'should refuse a div', code: 'export const d = <div className="step-code"/>;', errors: [{messageId: 'meaningless'}]},
    {name: 'should refuse a div that wraps other elements', code: 'export const d = <div><p>one</p></div>;', errors: [{messageId: 'meaningless'}]}
  ]
});
