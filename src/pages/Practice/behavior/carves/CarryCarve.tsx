import {FC} from 'react';
import tableStateSource from '@components/DragSortableTable/model/table-state.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

export const CarryCarve: FC = () => <Snippet label="TS" lines={carve.unit(tableStateSource, 'export type Carry')}/>;
