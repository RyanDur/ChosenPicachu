import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {Report, moveReport} from './report';

export const MoveReport: FC<{report?: Report}> = ({report}) =>
  <output className="move-report off-screen"
    aria-label="move report">{maybe(report).map(moveReport).orElse('')}</output>;
