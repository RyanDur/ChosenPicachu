import {FC} from 'react';
import {Maybe} from '@ryandur/sand';
import {Report, moveReport} from './report';

export const MoveReport: FC<{report: Maybe<Report>}> = ({report}) =>
  <output className="move-report off-screen"
    aria-label="move report">{report.map(moveReport).orElse('')}</output>;
