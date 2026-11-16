import {FC} from 'react';
import reportSource from '@components/DragSortableTable/model/report.ts?sample';
import {carve, Snippet} from '@pages/Demos/Recipe';

export const MoveReportCarve: FC = () =>
  <Snippet label="TS" lines={carve.between(reportSource, 'const move', '`${report.name} moved to ${report.landedAt')}/>;
