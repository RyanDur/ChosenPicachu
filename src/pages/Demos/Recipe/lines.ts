import {maybe} from '@ryandur/sand';
import {Line} from './sample';

const fromTheExhibit = ({from, ...line}: Line): Line =>
  maybe(from).map((origin): Line => ({...line, from: {...origin, kind: 'exhibit'}})).orElse(line);

type Lines = {
  plain: (text: string) => Line;
  blank: Line;
  aside: (text: string) => Line;
  marked: (shown: readonly Line[]) => Line[];
  fromTheExhibit: (carved: readonly Line[]) => Line[];
};

export const lines: Lines = {
  plain: text => ({text}),
  blank: {text: ' '},
  aside: text => ({text, dim: true}),
  marked: shown => shown.map(line => ({...line, marked: true})),
  fromTheExhibit: carved => carved.map(fromTheExhibit)
};
