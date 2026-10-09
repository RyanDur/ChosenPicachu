import {RuleTester} from 'eslint';
import classes from '../lint/classes.mjs';

const tester = new RuleTester({languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}}});
const unread = name => ({messageId: 'undefined', data: {name}});

tester.run('class-defined', classes.rules['class-defined'], {
  valid: [
    {name: 'should accept a class a sheet reads', code: '<p className="muted-ink"/>'},
    {name: 'should accept a template whose prefix opens a class', code: 'const p = <p className={`stack-${side}`}/>;'},
    {name: 'should read a comparison as no class', code: "const p = <p className={classNames(state === 'refused' && 'muted-ink')}/>;"},
    {name: 'should accept a class a classList call adds', code: "cell.classList.add('muted-ink');"},
    {name: 'should accept a class an html class attribute wears', code: "__htmlClass('fancy muted-ink');"}
  ],
  invalid: [
    {name: 'should refuse a class no sheet reads', code: '<p className="no-such-word"/>', errors: [unread('no-such-word')]},
    {name: 'should refuse a template prefix no class starts with', code: 'const p = <p className={`nowhere-${side}`}/>;', errors: [{messageId: 'unopened', data: {prefix: 'nowhere-'}}]},
    {name: 'should read both sides of a ternary', code: "const p = <p className={on ? 'no-such-word' : 'nor-this'}/>;", errors: [unread('no-such-word'), unread('nor-this')]},
    {name: 'should read the right side of &&', code: "const p = <p className={classNames('muted-ink', on && 'no-such-word')}/>;", errors: [unread('no-such-word')]},
    {name: 'should read what a classList call adds', code: "cell.classList.toggle('no-such-word', on);", errors: [unread('no-such-word')]},
    {name: 'should read what an html class attribute wears', code: "__htmlClass('muted-ink no-such-word');", errors: [unread('no-such-word')]},
    {name: 'should read both sides of || and ??', code: "const p = <p className={classNames(chosen || 'no-such-word', given ?? 'nor-this')}/>;", errors: [unread('no-such-word'), unread('nor-this')]}
  ]
});

tester.run('own-class-first', classes.rules['own-class-first'], {
  valid: [
    {name: 'should accept an own class first', code: '<p className="fancy muted-ink"/>'},
    {name: 'should accept an element that wears only shared words', code: '<p className="muted-ink bold"/>'},
    {name: 'should not judge the order of a classNames call that opens with a condition', code: "const p = <p className={classNames(on && 'muted-ink', 'fancy')}/>;"}
  ],
  invalid: [
    {name: 'should refuse an own class behind a shared word', code: '<p className="muted-ink fancy"/>', errors: [{messageId: 'behind', data: {name: 'fancy'}}]},
    {name: 'should refuse it in a classNames call too', code: "const p = <p className={classNames('muted-ink', 'fancy')}/>;", errors: [{messageId: 'behind', data: {name: 'fancy'}}]},
    {name: 'should refuse it in an html class attribute too', code: "__htmlClass('muted-ink fancy');", errors: [{messageId: 'behind', data: {name: 'fancy'}}]}
  ]
});

describe('the html processor', () => {
  test('should hand each class attribute to the rule on its own line', () => {
    const [{text}] = classes.processors.html.preprocess('<p>\n  <span class="fancy muted-ink"></span>\n</p>');

    expect(text.split('\n')).toEqual(['', '__htmlClass("fancy muted-ink");', '']);
  });
});
