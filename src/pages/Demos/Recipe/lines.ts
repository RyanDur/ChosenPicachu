import {Line} from './sample';

type Lines = {
  plain: (text: string) => Line;
  blank: Line;
  aside: (text: string) => Line;
  fromTheExhibit: (carved: readonly Line[]) => Line[];
};

export const lines: Lines = {
  plain: text => ({text}),
  blank: {text: ' '},
  aside: text => ({text, dim: true}),
  fromTheExhibit: carved => carved.map(({text, dim}) => ({text, dim, exhibit: true}))
};
