import {Line} from './Snippet';

type Lines = {
  plain: (text: string) => Line;
  aside: (text: string) => Line;
};

export const lines: Lines = {
  plain: text => ({text}),
  aside: text => ({text, dim: true})
};
