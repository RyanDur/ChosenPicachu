import {FC} from 'react';
import {Maybe} from '@ryandur/sand';
import {Moved} from '../session';

const moveReport = ({item, position, of}: Moved): string =>
  `${item} moved to ${position + 1} of ${of}`;

export const MoveReport: FC<{moved: Maybe<Moved>}> = ({moved}) =>
  <output className="off-screen" aria-label="move report">{moved.map(moveReport).orElse('')}</output>;
