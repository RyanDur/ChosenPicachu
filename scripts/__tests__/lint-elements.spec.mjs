import {RuleTester} from 'eslint';
import {elements} from '../lint/elements.mjs';

const tester = new RuleTester({languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}}});

tester.run('no-div', elements.rules['no-div'], {
  valid: [
    {name: 'should accept an element that says what it is', code: 'export const s = <section aria-label="steps"><p>one</p></section>;'},
    {name: 'should accept a component whose name holds the word', code: 'export const d = <Divider/>;'}
  ],
  invalid: [
    {name: 'should refuse a div', code: 'export const d = <div/>;', errors: [{messageId: 'meaningless'}]},
    {name: 'should refuse a div that wraps other elements', code: 'export const d = <div><p>one</p></div>;', errors: [{messageId: 'meaningless'}]}
  ]
});

tester.run('step-opens-with-its-heading', elements.rules['step-opens-with-its-heading'], {
  valid: [
    {name: 'should accept a step whose first part is its heading', code: 'export const s = <Step>\n  <StepHeading title="Lift"/>\n  <Words/>\n</Step>;'},
    {name: 'should accept a dial step whose first part is its heading', code: 'export const s = <DialStep id="lift"><StepHeading title="Lift"><Dial/></StepHeading><Codes/></DialStep>;'},
    {name: 'should leave other elements alone', code: 'export const s = <Steps><Step><StepHeading title="Lift"/></Step></Steps>;'}
  ],
  invalid: [
    {name: 'should refuse a step with no heading', code: 'export const s = <Step><Words/></Step>;', errors: [{messageId: 'unheaded'}]},
    {name: 'should refuse a dial step whose heading comes after its words', code: 'export const s = <DialStep><Words/><StepHeading title="Lift"/></DialStep>;', errors: [{messageId: 'unheaded'}]},
    {name: 'should refuse a step that opens with words before its heading', code: 'export const s = <Step>lift<StepHeading title="Lift"/></Step>;', errors: [{messageId: 'unheaded'}]},
    {name: 'should refuse an empty step', code: 'export const s = <Step/>;', errors: [{messageId: 'unheaded'}]}
  ]
});
