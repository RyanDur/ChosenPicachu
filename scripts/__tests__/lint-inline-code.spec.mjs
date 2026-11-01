import {RuleTester} from 'eslint';
import {builtinRules} from 'eslint/use-at-your-own-risk';
import {bareInlineCode} from '../lint/inline-code.mjs';

const tester = new RuleTester({languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}}});
const options = [bareInlineCode];
const refused = [{message: bareInlineCode.message}];

tester.run('inline code wears monospaced', builtinRules.get('no-restricted-syntax'), {
  valid: [
    {name: 'should accept a code element that wears monospaced among other classes', code: '<p>the <code className="readout monospaced unbroken">sized</code> class</p>;', options},
    {name: 'should accept a code element that is the sample inside a pre that wears monospaced', code: '<pre className="snippet monospaced"><code>{lines}</code></pre>;', options}
  ],
  invalid: [
    {name: 'should refuse a code element in a sentence that does not wear monospaced', code: '<p>the <code>sized</code> class</p>;', options, errors: refused},
    {name: 'should refuse a sample inside a pre that does not wear monospaced', code: '<pre className="snippet"><code>{lines}</code></pre>;', options, errors: refused},
    {name: 'should refuse a code element whose class only contains monospaced inside a longer word', code: '<p>the <code className="notmonospaced">sized</code> class</p>;', options, errors: refused}
  ]
});
