import {Line} from './sample';

type Lines = {
  plain: (text: string) => Line;
  blank: Line;
  aside: (text: string) => Line;
  written: (carved: readonly Line[]) => Line[];
};

export const lines: Lines = {
  plain: text => ({text}),
  blank: {text: ' '},
  aside: text => ({text, dim: true}),
  written: carved => carved.map(({text, dim}) => ({text, dim}))
};
