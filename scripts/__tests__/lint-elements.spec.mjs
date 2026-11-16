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

tester.run('fieldset-opens-with-its-legend', elements.rules['fieldset-opens-with-its-legend'], {
  valid: [
    {name: 'should accept a fieldset whose first part is its legend', code: 'export const f = <fieldset>\n  <legend>Size</legend>\n  <input/>\n</fieldset>;'}
  ],
  invalid: [
    {name: 'should refuse a fieldset with no legend', code: 'export const f = <fieldset><input/></fieldset>;', errors: [{messageId: 'unnamed'}]},
    {name: 'should refuse a fieldset whose legend comes after another part', code: 'export const f = <fieldset><input/><legend>Size</legend></fieldset>;', errors: [{messageId: 'unnamed'}]},
    {name: 'should refuse a fieldset named only by the legend of a fieldset inside it', code: 'export const f = <fieldset><fieldset><legend>Home</legend></fieldset></fieldset>;', errors: [{messageId: 'unnamed'}]}
  ]
});

tester.run('no-footer-in-a-dialog', elements.rules['no-footer-in-a-dialog'], {
  valid: [
    {name: 'should accept a footer outside a dialog', code: 'export const f = <section><footer>notes</footer></section>;'}
  ],
  invalid: [
    {name: 'should refuse a footer inside a dialog', code: 'export const d = <dialog><form><footer/></form></dialog>;', errors: [{messageId: 'landmark'}]},
    {name: 'should refuse a footer inside a Modal', code: 'export const d = <Modal><form><footer/></form></Modal>;', errors: [{messageId: 'landmark'}]}
  ]
});
