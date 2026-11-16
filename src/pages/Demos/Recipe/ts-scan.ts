import {maybe, not} from '@ryandur/sand';
import {tsWords} from './ts-words';

export type Span = {
  start: number;
  length: number;
  kind: 'string' | 'comment' | 'tag' | 'attribute';
};

export type Scanned = {
  spans: Span[];
  code: boolean[];
};

type Code = {within: 'code'; closesOnBrace: boolean; braces: number};
type Tag = {within: 'tag'; closing: boolean};
type Text = {within: 'text'; open: number};
type Template = {within: 'template'; from: number};
type Frame = Code | Tag | Text | Template;

const valueCanStart = new RegExp(String.raw`(?:^|[([{=,:;?!&|+\-*/%<~]|=>|\.\.\.|\b(?:${tsWords.beforeAValue.join('|')}))\s*$`);
const elementCanStart = /(?:^|\s|[>([{}=,:;?!&|+\-*/%<])$/;
const plainlyAnElement = /^<[A-Za-z][\w.:-]*(?:\s+[A-Za-z][\w-]*=|\s*\/>)/;
const typeParameters = /^<[A-Za-z_$][\w$]*(?:\s+extends\b|\s*,|>\s*\()/;

const endOfQuoted = (text: string, from: number, quote: string): number => {
  const crossesLines = quote === '`';
  let at = from + 1;
  while (at < text.length && text[at] !== quote && (crossesLines || text[at] !== '\n')) at += text[at] === '\\' ? 2 : 1;
  return text[at] === quote ? at + 1 : Math.min(at, text.length);
};

const endOf = (text: string, from: number, closer: string): number => {
  const found = text.indexOf(closer, from);
  return found === -1 ? text.length : found + closer.length;
};

const endOfLine = (text: string, from: number): number => {
  const found = text.indexOf('\n', from);
  return found === -1 ? text.length : found;
};

const startOfLine = (text: string, at: number): number => text.lastIndexOf('\n', at - 1) + 1;

const nameAt = (line: string, from: number): number =>
  maybe(/^[A-Za-z_$][\w$.:-]*/.exec(line.slice(from))).map(([name]) => name.length).orElse(0);

const scanFrom = (text: string, first: Frame): Scanned => {
  const spans: Span[] = [];
  const code = Array.from({length: text.length}, () => false);
  const stack: Frame[] = [first];
  const mark = (start: number, end: number, kind: Span['kind']): number => {
    spans.push({start, length: end - start, kind});
    return end;
  };
  const top = (): Frame => stack[stack.length - 1];
  const openTag = (at: number): number => {
    const closing = text[at + 1] === '/';
    stack.push({within: 'tag', closing});
    const nameStart = at + (closing ? 2 : 1);
    const length = nameAt(text, nameStart);
    return length === 0 ? nameStart : mark(nameStart, nameStart + length, 'tag');
  };
  const closeTag = (closing: boolean, selfClosing: boolean): void => {
    stack.pop();
    const around = top();
    if (around.within !== 'text') return;
    around.open += closing ? -1 : selfClosing ? 0 : 1;
    if (around.open <= 0) stack.pop();
  };
  const enterBraces = (at: number): number => {
    stack.push({within: 'code', closesOnBrace: true, braces: 0});
    return at + 1;
  };
  const leaveBraces = (at: number): number => {
    stack.pop();
    const around = top();
    if (around.within === 'template') around.from = at;
    return at + 1;
  };
  const opensAnElement = (at: number, before: string): boolean => /[A-Za-z/>]/.test(text[at + 1] ?? '')
    && (text[at + 1] === '/' || plainlyAnElement.test(text.slice(at))
      || (elementCanStart.test(before) && not(typeParameters.test(text.slice(at)))));

  const inCode = (frame: Code, at: number): number => {
    const here = text[at];
    const before = text.slice(startOfLine(text, at), at);
    if (text.startsWith('{/*', at)) return mark(at, endOf(text, at + 3, '*/}'), 'comment');
    if (text.startsWith('//', at)) return mark(at, endOfLine(text, at), 'comment');
    if (text.startsWith('/*', at)) return mark(at, endOf(text, at + 2, '*/'), 'comment');
    if (here === '`') {
      stack.push({within: 'template', from: at});
      return at + 1;
    }
    if ((here === '"' || here === '\'') && valueCanStart.test(before)) return mark(at, endOfQuoted(text, at, here), 'string');
    if (here === '<' && opensAnElement(at, before)) {
      stack.push({within: 'text', open: 0});
      return openTag(at);
    }
    if (here === '}' && frame.braces === 0 && frame.closesOnBrace) return leaveBraces(at);
    if (here === '{') frame.braces += 1;
    if (here === '}') frame.braces -= 1;
    code[at] = true;
    return at + 1;
  };

  const inTemplate = (frame: Template, at: number): number => {
    if (text[at] === '\\') return at + 2;
    if (text[at] === '`') {
      stack.pop();
      return mark(frame.from, at + 1, 'string');
    }
    if (text.startsWith('${', at)) {
      mark(frame.from, at + 2, 'string');
      return enterBraces(at + 1);
    }
    return at + 1;
  };

  const inTag = (frame: Tag, at: number): number => {
    const here = text[at];
    const length = nameAt(text, at);
    if (here === '>' || text.startsWith('/>', at)) {
      const selfClosing = here === '/';
      closeTag(frame.closing, selfClosing);
      return at + (selfClosing ? 2 : 1);
    }
    if (here === '"' || here === '\'') return mark(at, endOfQuoted(text, at, here), 'string');
    if (here === '{') return enterBraces(at);
    if (length > 0 && text[at + length] === '=') return mark(at, at + length, 'attribute');
    return at + Math.max(length, 1);
  };

  const inText = (at: number): number => {
    const here = text[at];
    if (text.startsWith('{/*', at)) return mark(at, endOf(text, at + 3, '*/}'), 'comment');
    if (text.startsWith('<!--', at)) return mark(at, endOf(text, at + 4, '-->'), 'comment');
    if (at === 0 && /["'`]/.test(here)) return mark(at, endOfQuoted(text, at, here), 'string');
    if (here === '{') return enterBraces(at);
    if (here === '<' && /[A-Za-z/>]/.test(text[at + 1] ?? '')) return openTag(at);
    return at + 1;
  };

  const step = (at: number): number => {
    const frame = top();
    if (frame.within === 'code') return inCode(frame, at);
    if (frame.within === 'tag') return inTag(frame, at);
    if (frame.within === 'template') return inTemplate(frame, at);
    return inText(at);
  };

  let at = 0;
  while (at < text.length) at = step(at);
  const last = top();
  if (last.within === 'template' && last.from < text.length) mark(last.from, text.length, 'string');
  return {spans, code};
};

type Scan = {
  ts: (text: string) => Scanned;
  markup: (text: string) => Scanned;
};

export const scan: Scan = {
  ts: text => scanFrom(text, {within: 'code', closesOnBrace: false, braces: 0}),
  markup: text => scanFrom(text, {within: 'text', open: Number.POSITIVE_INFINITY})
};
