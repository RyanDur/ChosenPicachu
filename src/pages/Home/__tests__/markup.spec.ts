import {markup} from '../markup';

test('a tag opens with its bracket, its name and its closing bracket', () => {
  expect(markup.tokensOf('<article>')).toEqual([
    {ink: 'bracket', text: '<'},
    {ink: 'tag', text: 'article'},
    {ink: 'bracket', text: '>'}
  ]);
});

test('a closing tag opens with a bracket and a slash', () => {
  expect(markup.tokensOf('</article>')).toEqual([
    {ink: 'bracket', text: '</'},
    {ink: 'tag', text: 'article'},
    {ink: 'bracket', text: '>'}
  ]);
});

test('a tag name keeps its digits', () => {
  expect(markup.tokensOf('<h1>')).toEqual([
    {ink: 'bracket', text: '<'},
    {ink: 'tag', text: 'h1'},
    {ink: 'bracket', text: '>'}
  ]);
});

test('a bare attribute is inked as an attribute', () => {
  expect(markup.tokensOf('<nav popover>')).toEqual([
    {ink: 'bracket', text: '<'},
    {ink: 'tag', text: 'nav'},
    {ink: 'attribute', text: ' popover'},
    {ink: 'bracket', text: '>'}
  ]);
});

test('an attribute keeps its quoted value', () => {
  expect(markup.tokensOf('<main class="app-main">')).toEqual([
    {ink: 'bracket', text: '<'},
    {ink: 'tag', text: 'main'},
    {ink: 'attribute', text: ' class="app-main"'},
    {ink: 'bracket', text: '>'}
  ]);
});

test('a tag\'s attributes are inked together, however many it has', () => {
  expect(markup.tokensOf('<nav class="rail" popover>')).toEqual([
    {ink: 'bracket', text: '<'},
    {ink: 'tag', text: 'nav'},
    {ink: 'attribute', text: ' class="rail" popover'},
    {ink: 'bracket', text: '>'}
  ]);
});

test('the words between tags are inked as words', () => {
  expect(markup.tokensOf('<h1>…</h1>')).toEqual([
    {ink: 'bracket', text: '<'},
    {ink: 'tag', text: 'h1'},
    {ink: 'bracket', text: '>'},
    {ink: 'words', text: '…'},
    {ink: 'bracket', text: '</'},
    {ink: 'tag', text: 'h1'},
    {ink: 'bracket', text: '>'}
  ]);
});
