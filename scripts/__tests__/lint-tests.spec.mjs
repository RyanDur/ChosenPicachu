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

tester.run('devices-are-projects', tests.rules['devices-are-projects'], {
  valid: [
    {name: 'should accept a journey that turns script off', code: 'test.use({javaScriptEnabled: false});'},
    {name: 'should accept a journey that blocks service workers', code: "test.use({serviceWorkers: 'block'});"},
    {name: 'should accept a journey given a worker of its own', code: "test.use({workerOfItsOwn: 'the measured folds'});"},
    {name: 'should accept use on something that runs no test', code: 'tool.use(iPhone);'}
  ],
  invalid: [
    {name: 'should refuse a journey pinned to a device', code: 'test.use(iPhone);', errors: [{messageId: 'pinned'}]},
    {name: 'should refuse a device taken from a loop', code: 'for (const {device} of readers) { test.describe(\'x\', () => { test.use(device); }); }', errors: [{messageId: 'pinned'}]},
    {name: 'should refuse a viewport set for a journey', code: 'test.use({viewport: {width: 390, height: 844}});', errors: [{messageId: 'pinned'}]},
    {name: 'should refuse touch set for a journey', code: 'test.use({hasTouch: true});', errors: [{messageId: 'pinned'}]},
    {name: 'should refuse a device spread into a journey\'s options', code: 'test.use({...iPhone, javaScriptEnabled: false});', errors: [{messageId: 'pinned'}]}
  ]
});

tester.run('tags-are-devices', tests.rules['tags-are-devices'], {
  valid: [
    {name: 'should accept a journey tagged with a device', code: "test('x', {tag: '@iPhone'}, () => {});"},
    {name: 'should accept a describe tagged with devices', code: "test.describe('x', {tag: ['@desktop', '@phoneSideways']}, () => {});"},
    {name: 'should accept a journey with no options', code: "test('x', () => {});"},
    {name: 'should accept a tag on something that runs no test', code: "label('x', {tag: '@iphone'});"}
  ],
  invalid: [
    {name: 'should refuse a misspelled device', code: "test('x', {tag: '@iphone'}, () => {});", errors: [{messageId: 'unknown'}]},
    {name: 'should refuse an unknown device among known ones', code: "test.describe('x', {tag: ['@desktop', '@tablet']}, () => {});", errors: [{messageId: 'unknown'}]},
    {name: 'should refuse a tag held in a variable', code: "test('x', {tag: onAPhone}, () => {});", errors: [{messageId: 'unread'}]},
    {name: 'should refuse a tag built in a template', code: "test('x', {tag: [`@${reader}`]}, () => {});", errors: [{messageId: 'unread'}]},
    {name: 'should refuse a tag written in a title', code: "test('a phone reader @iphone', () => {});", errors: [{messageId: 'titled'}]}
  ]
});
