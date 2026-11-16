import {RuleTester} from 'eslint';
import {tests} from '../lint/tests.mjs';

const tester = new RuleTester();

tester.run('no-double-of-ours', tests.rules['no-double-of-ours'], {
  valid: [
    {name: 'should accept a spy that listens to the console', code: "vi.spyOn(console, 'error');"},
    {name: 'should accept a scrollTo spy that records where the page went', code: "vi.spyOn(window, 'scrollTo').mockImplementation(record);"},
    {name: 'should accept a spy on the page\'s scrollTo', code: "vi.spyOn(window, 'scrollTo');"},
    {name: 'should accept a spy on an element\'s scrollTo', code: "vi.spyOn(Element.prototype, 'scrollTo');"},
    {name: 'should accept a value set on an object that isn\'t a prototype', code: 'store.count = 1;'},
    {name: 'should accept a property defined on an object that isn\'t a prototype', code: "Object.defineProperty(navigator, 'onLine', {});"}
  ],
  invalid: [
    {name: 'should refuse a spy on our own module', code: "vi.spyOn(store, 'get');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a spy on another window method', code: "vi.spyOn(window, 'matchMedia');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a spy on an element\'s layout read', code: "vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a spy on the clock', code: "vi.spyOn(Date, 'now');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a mock of a module', code: "vi.mock('react-router');", errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a spy still being written', code: 'vi.spyOn();', errors: [{messageId: 'spied'}]},
    {name: 'should refuse a mock still being written', code: 'vi.mock();', errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a module mocked on import', code: "vi.importMock('./store');", errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a global stubbed', code: "vi.stubGlobal('fetch', vi.fn());", errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a prototype method assigned', code: 'HTMLElement.prototype.getBoundingClientRect = () => ({});', errors: [{messageId: 'replaced'}]},
    {name: 'should refuse a prototype method defined', code: "Object.defineProperty(Node.prototype, 'blur', {});", errors: [{messageId: 'replaced'}]},
    {name: 'should refuse a console spy that silences what it hears', code: "vi.spyOn(console, 'warn').mockImplementation(() => {});", errors: [{messageId: 'silenced'}]},
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
