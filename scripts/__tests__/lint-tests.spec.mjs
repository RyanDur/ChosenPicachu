import {RuleTester} from 'eslint';
import {tests} from '../lint/tests.mjs';

const tester = new RuleTester();

tester.run('no-double-of-ours', tests.rules['no-double-of-ours'], {
  valid: [
    {name: 'should accept a spy on a platform global', code: "vi.spyOn(window, 'scrollTo');"},
    {name: 'should accept a spy on the clock', code: "vi.spyOn(Date, 'now');"},
    {name: 'should accept a spy on a platform element\'s prototype', code: "vi.spyOn(HTMLElement.prototype, 'scrollTo');"},
    {name: 'should accept a mock of a package', code: "vi.mock('node:fs');"},
    {name: 'should accept a mock of a scoped package', code: "vi.mock('@testing-library/react');"},
    {name: 'should accept a spy on a platform object reached through a member', code: "vi.spyOn(navigator.clipboard, 'writeText');"},
    {name: 'should accept a spy on storage\'s prototype', code: "vi.spyOn(Storage.prototype, 'getItem');"},
    {name: 'should accept a spy on an observer\'s prototype', code: "vi.spyOn(ResizeObserver.prototype, 'observe');"}
  ],
  invalid: [
    {name: 'should refuse a spy on our own module', code: "vi.spyOn(store, 'get');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a spy on a member of our own module', code: "vi.spyOn(candles.mergeLive, 'call');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a spy on our own prototype', code: "vi.spyOn(Store.prototype, 'get');", errors: [{messageId: 'spied'}]},
    {name: 'should refuse a mock of a relative path', code: "vi.mock('./store');", errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a mock of an aliased path', code: "vi.mock('@pages/Users');", errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a hoisted-later mock of our own module', code: "vi.doMock('./store');", errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a mock of our own module named in a template', code: 'vi.mock(`./store`);', errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a mock of our own module named by import()', code: "vi.mock(import('./store'));", errors: [{messageId: 'mocked'}]},
    {name: 'should refuse a spy on a member of a platform class that is not a prototype', code: "vi.spyOn(Element.thing, 'x');", errors: [{messageId: 'spied'}]}
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
