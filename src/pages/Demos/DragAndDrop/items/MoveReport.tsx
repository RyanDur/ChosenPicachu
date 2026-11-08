import {FC} from 'react';
import {Moved} from '../drag-sort';
import {useDragSort} from '../useDragSort';

const moveReport = ({item, position}: Moved, count: number): string =>
  `${item} moved to ${position + 1} of ${count}`;

export const MoveReport: FC = () => {
  const {lastMove, order} = useDragSort();
  return <output className="off-screen" aria-label="move report">{
    lastMove.map(moved => moveReport(moved, order.length)).orElse('')
  }</output>;
};
