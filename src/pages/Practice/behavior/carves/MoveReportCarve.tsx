import {FC} from 'react';
import reportSource from '@components/DragSortableTable/model/report.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

export const MoveReportCarve: FC = () =>
  <Snippet label="TS" lines={carve.span(reportSource, 'const move', '`${report.name} moved to ${report.position')}/>;
