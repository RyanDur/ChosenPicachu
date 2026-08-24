import {FC} from 'react';
import {Maybe} from '@ryandur/sand';
import {Moved, moveReport} from '../session';

export const MoveReport: FC<{moved: Maybe<Moved>}> = ({moved}) =>
  <output className="move-report off-screen">{moved.map(moveReport).orElse('')}</output>;
