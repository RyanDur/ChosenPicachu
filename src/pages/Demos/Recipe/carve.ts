import {Line} from './Snippet';
import {Sample} from './sample';

type Closer = '}' | ')' | ']';

const openers: Record<string, Closer> = {'{': '}', '(': ')', '[': ']'};

const lineAt = (source: string, offset: number): number => source.slice(0, offset).split('\n').length;

const dedented = (lines: string[], from: Sample, firstLine: number): Line[] => {
  const margin = Math.min(...lines
    .filter(line => line.trim().length > 0)
    .map(line => line.length - line.trimStart().length));
  return lines.map((line, at) => ({text: line.slice(margin), from: {sample: from, line: firstLine + at}}));
};

const closesTheUnit = (source: string, at: number, closer: Exclude<Closer, ']'>): boolean => {
  const ahead = source.slice(at + 1).match(/\S/);
  if (!ahead) {
    return true;
  }
  if (ahead[0] === '.') {
    return closer !== ')';
  }
  if (ahead[0] === ':') {
    return closer === '}' && /^:\S/.test(source.slice(at + 1).trimStart());
  }
  return !'=:{>~+['.includes(ahead[0]);
};

export const unit = (sample: Sample, anchor: string): Line[] => {
  const source = sample.text;
  const found = source.indexOf(anchor);
  if (found < 0) {
    throw new Error(`no unit anchored at "${anchor}"`);
  }
  const start = source.lastIndexOf('\n', found) + 1;
  const pending: Closer[] = [];
  let at = found;
  while (at < source.length) {
    const glyph = source[at];
    if (glyph === ';' && pending.length === 0) {
      break;
    }
    if (glyph in openers) {
      pending.push(openers[glyph]);
    } else if (glyph === pending[pending.length - 1]) {
      const closer = pending[pending.length - 1];
      pending.pop();
      if (pending.length === 0 && closer !== ']' && closesTheUnit(source, at, closer)) {
        break;
      }
    }
    at += 1;
  }
  const close = source.indexOf('\n', at);
  return dedented(source.slice(start, close < 0 ? source.length : close).split('\n'), sample, lineAt(source, start));
};

export const span = (sample: Sample, from: string, to: string): Line[] => {
  const source = sample.text;
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
  return dedented(source.slice(start, close < 0 ? source.length : close).split('\n'), sample, lineAt(source, start));
};

export const withoutImports = (sample: Sample): Line[] => {
  const lines = sample.text.split('\n');
  const lastImport = lines.reduce((found, line, at) => line.startsWith('import ') ? at : found, -1);
  const body = lines.slice(lastImport + 1);
  let firstLine = lastImport + 2;
  while (body[0]?.trim() === '') {
    body.shift();
    firstLine += 1;
  }
  while (body[body.length - 1]?.trim() === '') {
    body.pop();
  }
  return dedented(body, sample, firstLine);
};
