import {FC} from 'react';
import reducerSource from '@components/DragSortableTable/model/reducer.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

export const WalkCaseCarve: FC = () =>
  <Snippet label="TS" lines={carve.between(reducerSource, "case 'columnMovedBeside':", "const to = action.type === 'columnWalkedTo'")}/>;
