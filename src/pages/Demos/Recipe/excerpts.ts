import {is, maybe, not} from '@ryandur/sand';
import {highlight, Label, Token} from './highlight';
import {Line} from './Snippet';

const followsInItsFile = (previous: Line, line: Line): boolean => maybe(previous.from)
  .map(before => maybe(line.from)
    .map(after => before.file.path === after.file.path && before.line + 1 === after.line)
    .orElse(false))
  .orElse(not(line.from));

const continues = (line: Line, previous?: Line): boolean =>
  maybe(previous).map(before => not(before.dim) && followsInItsFile(before, line)).orElse(false);

const excerptsOf = (lines: readonly Line[]): number[][] => lines.reduce<number[][]>((excerpts, line, at) => {
  if (is(line.dim)) return excerpts;
  return continues(line, lines[at - 1])
    ? [...excerpts.slice(0, -1), [...excerpts[excerpts.length - 1], at]]
    : [...excerpts, [at]];
}, []);

type Excerpts = {
  tokensOf: (label: Label, lines: readonly Line[]) => Token[][];
};

export const excerpts: Excerpts = {
  tokensOf: (label, lines) => {
    const inked = new Map(excerptsOf(lines).flatMap(excerpt => {
      const tokens = highlight.tokensOf(label, excerpt.map(at => lines[at].text));
      return excerpt.map((at, index): [number, Token[]] => [at, tokens[index]]);
    }));
    return lines.map(({text}, at) => inked.get(at) ?? [{text, kind: 'plain'}]);
  }
};
