import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {Landed, moveReport} from './table-state';

export const MoveReport: FC<{landed: Landed | undefined}> = ({landed}) =>
  <output className="move-report off-screen">{maybe(landed).map(moveReport).orElse('')}</output>;
