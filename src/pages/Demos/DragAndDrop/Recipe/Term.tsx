import {FC, PropsWithChildren, ReactNode} from 'react';
import {Defined} from '../../Recipe/Defined';

export type Word = 'session' | 'crossing' | 'landing';

const definitions: Record<Word, ReactNode> = {
  session: 'the platform’s drag, from dragstart to dragend: the ceremony you rent instead of build',
  crossing: 'the moment the carried card passes far enough over a neighbour to trade places',
  landing: 'the destination a lazy drag remembers instead of committing'
};

export const Term: FC<PropsWithChildren<{word: Word}>> = ({word, children}) =>
  <Defined definition={definitions[word]}>{children ?? word}</Defined>;
