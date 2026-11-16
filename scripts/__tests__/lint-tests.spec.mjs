import {RuleTester} from 'eslint';
import {tests} from '../lint/tests.mjs';

const tester = new RuleTester();

tester.run('no-double-of-ours', tests.rules['no-double-of-ours'], {
  valid: [
    {name: 'should accept a spy that listens to the console', code: "vi.spyOn(console, 'error');"},
    {name: 'should accept a spy on the page\'s scrollTo', code: "vi.spyOn(window, 'scrollTo');"},
    {name: 'should accept a spy on an element\'s scrollTo', code: "vi.spyOn(Element.prototype, 'scrollTo');"}
  ],
  invalid: [
    {name: 'should refuse a spy on our own module', code: "vi.spyOn(store, 'get');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a spy on another window method', code: "vi.spyOn(window, 'matchMedia');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a spy on an element\'s layout read', code: "vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a spy on the clock', code: "vi.spyOn(Date, 'now');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a mock of a module', code: "vi.mock('react-router');", errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a spy still being written', code: 'vi.spyOn();', errors: [{messageId: 'spied'}]},
    {name: 'should refuse a mock still being written', code: 'vi.mock();', errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a mock made later', code: "vi.doMock('./store');", errors: [{messageId: 'mocked'}]}
  ]
});

tester.run('parameterized-for-drift', tests.rules['parameterized-for-drift'], {
  valid: [
    {name: 'should accept a plain test', code: "test('reads', () => {});"},
    {name: 'should accept each on something that runs no test', code: 'rows.each(row => row);'}
  ],
  invalid: [
    {name: 'should refuse test.each', code: "test.each([1])('x', () => {});", errors: [{messageId: 'drift'}]},
    {name: 'should refuse it.each', code: "it.each([1])('x', () => {});", errors: [{messageId: 'drift'}]},
    {name: 'should refuse describe.each', code: "describe.each([1])('x', () => {});", errors: [{messageId: 'drift'}]},
    {name: 'should refuse test.for', code: "test.for([1])('x', () => {});", errors: [{messageId: 'drift'}]},
    {name: 'should refuse each behind a modifier', code: "test.concurrent.each([1])('x', () => {});", errors: [{messageId: 'drift'}]}
  ]
});
