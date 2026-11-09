import {Line} from './Snippet';

type Lines = {
  plain: (text: string) => Line;
  blank: Line;
  aside: (text: string) => Line;
};

export const lines: Lines = {
  plain: text => ({text}),
  blank: {text: ' '},
  aside: text => ({text, dim: true})
};
