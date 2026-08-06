import {CSSProperties} from 'react';
import {glide} from '@components/glide';

export type Pushed = Readonly<Record<string, 'left' | 'right'>>;

type Stage = {
  pushed: (marks: Pushed) => void;
};

export type ListTheater = (stage: Stage) => {
  crossed: (item: string, toward: 'left' | 'right') => void;
  walked: (item: string, neighbor: string, toward: 1 | -1) => void;
  named: (item: string) => CSSProperties | undefined;
  glided: (update: () => void) => void;
};

export const staged: ListTheater = ({pushed}) => ({
  crossed: (item, toward) => pushed({[item]: toward}),
  walked: (item, neighbor, toward) => pushed({
    [item]: toward > 0 ? 'right' : 'left',
    [neighbor]: toward > 0 ? 'left' : 'right'
  }),
  named: item => ({viewTransitionName: `sort-${item}`}),
  glided: glide(true)
});

export const still: ListTheater = () => ({
  crossed: () => undefined,
  walked: () => undefined,
  named: () => undefined,
  glided: glide(false)
});
