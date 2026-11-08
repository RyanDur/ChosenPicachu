import {FC} from 'react';
import draggableColumnSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

const tableCondition = 'if (has(drag) && has(settling))';

export const ConditionCarve: FC = () =>
  <Snippet label="TS" lines={carve.span(draggableColumnSource, tableCondition, tableCondition)}/>;
