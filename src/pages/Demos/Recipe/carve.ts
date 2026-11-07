import {Line} from './Snippet';
import {Sample} from './sample';

type Closer = '}' | ')' | ']';

const openers: Record<string, Closer> = {'{': '}', '(': ')', '[': ']'};

const lineAt = (source: string, offset: number): number => source.slice(0, offset).split('\n').length;

const dedented = (lines: string[], from: Sample, firstLine: number): Line[] => {
  const margin = Math.min(...lines
    .filter(line => line.trim().length > 0)
    .map(line => line.length - line.trimStart().length));
  return lines.map((line, at) => ({text: line.slice(margin), from: {file: from, line: firstLine + at}}));
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
  return !'=:{>~+[|'.includes(ahead[0]);
};

const opensABlock = (line: string, pending: Closer[]): boolean =>
  pending.length === 1 && pending[0] === '}' && line.trimEnd().endsWith('{');

const halfAStatement = (line: string): boolean => {
  const pending: Closer[] = [];
  for (const glyph of line.split('')) {
    if (glyph in openers) {
      pending.push(openers[glyph]);
    } else if ('})]'.includes(glyph) && pending.pop() !== glyph) {
      return true;
    }
  }
  return pending.length > 0 && !opensABlock(line, pending);
};

const unit = (sample: Sample, anchor: string): Line[] => {
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

const span = (sample: Sample, from: string, to: string): Line[] => {
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
  const lines = source.slice(start, close < 0 ? source.length : close).split('\n');
  if (lines.length === 1 && halfAStatement(lines[0])) {
    throw new Error(`the one line at "${from}" is half a statement; carve its whole statement`);
  }
  return dedented(lines, sample, lineAt(source, start));
};

const withoutImports = (sample: Sample): Line[] => {
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

type Carve = {
  unit: (sample: Sample, anchor: string) => Line[];
  span: (sample: Sample, from: string, to: string) => Line[];
  withoutImports: (sample: Sample) => Line[];
};

export const carve = (): Carve => ({unit, span, withoutImports});
