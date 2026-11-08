import {FC} from 'react';
import {Report} from '../drag-sort';
import {useDragSort} from '../useDragSort';

const moveReport = ({item, position, stayed}: Report, count: number): string =>
  `${item} ${stayed ? 'stays at' : 'moved to'} ${position + 1} of ${count}`;

export const MoveReport: FC = () => {
  const {report, order} = useDragSort();
  return <output className="off-screen" aria-label="move report">{
    report.map(said => moveReport(said, order.length)).orElse('')
  }</output>;
};
