import {Line} from './Snippet';

const openers: Record<string, string> = {'{': '}', '(': ')', '[': ']'};
const closers = new Set(Object.values(openers));

const dedented = (lines: string[]): Line[] => {
  const margin = Math.min(...lines
    .filter(line => line.trim().length > 0)
    .map(line => line.length - line.trimStart().length));
  return lines.map(line => ({text: line.slice(margin)}));
};

const closesTheUnit = (source: string, at: number): boolean => {
  const ahead = source.slice(at + 1).match(/\S/);
  return ahead === null || !'=:'.includes(ahead[0]);
};

export const unit = (source: string, anchor: string): Line[] => {
  const found = source.indexOf(anchor);
  if (found < 0) {
    throw new Error(`no unit anchored at "${anchor}"`);
  }
  const start = source.lastIndexOf('\n', found) + 1;
  const pending: string[] = [];
  let at = found;
  while (at < source.length) {
    const glyph = source[at];
    if (glyph in openers) {
      pending.push(openers[glyph]);
    } else if (closers.has(glyph) && glyph === pending[pending.length - 1]) {
      pending.pop();
      if (pending.length === 0 && closesTheUnit(source, at)) {
        break;
      }
    }
    at += 1;
  }
  const close = source.indexOf('\n', at);
  return dedented(source.slice(start, close < 0 ? source.length : close).split('\n'));
};

export const span = (source: string, from: string, to: string): Line[] => {
  const first = source.indexOf(from);
  if (first < 0) {
    throw new Error(`no span opens at "${from}"`);
  }
  const last = source.indexOf(to, first);
  if (last < 0) {
    throw new Error(`no span closes at "${to}"`);
  }
  const start = source.lastIndexOf('\n', first) + 1;
  const close = source.indexOf('\n', last);
  return dedented(source.slice(start, close < 0 ? source.length : close).split('\n'));
};
