import {is, maybe, not} from '@ryandur/sand';
import {highlight, Label, Token} from './highlight';
import {Line} from './sample';

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

const grammarsCarryingState: Record<string, Label> = {ts: 'TS', tsx: 'TS', html: 'HTML'};

const writtenIn = (path: string): Label | undefined => grammarsCarryingState[path.slice(path.lastIndexOf('.') + 1)];

const linesBefore = (label: Label, line: Line): string[] => maybe(line.from)
  .map(({file, line: number}) => writtenIn(file.path) === label
    ? maybe(file.text).map(text => text.split('\n').slice(0, number - 1)).orElse([])
    : [])
  .orElse([]);

type Excerpts = {
  tokensOf: (label: Label, lines: readonly Line[]) => Token[][];
};

export const excerpts: Excerpts = {
  tokensOf: (label, lines) => {
    const inked = new Map(excerptsOf(lines).flatMap(excerpt => {
      const before = linesBefore(label, lines[excerpt[0]]);
      const tokens = highlight.tokensOf(label, [...before, ...excerpt.map(at => lines[at].text)]).slice(before.length);
      return excerpt.map((at, index): [number, Token[]] => [at, tokens[index]]);
    }));
    return lines.map(({text}, at) => inked.get(at) ?? [{text, kind: 'plain'}]);
  }
};
