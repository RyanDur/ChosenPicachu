import {EagerPace} from './steps';
import {SortBuild} from './sort-build';
import buildSource from '../Frame/builds/Eager.ts?sample';
import tableSource from '../Builds/EagerTable/EagerTable.tsx?sample';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import rowSource from '@components/DragSortableTable/RowHeader.tsx?sample';

export const eagerBuild: SortBuild = {
  react: 'Builds/EagerTable',
  vanilla: 'Frame/builds/Eager.ts',
  tableSource,
  buildSource,
  headerSource,
  rowSource,
  pace: <EagerPace headerSource={headerSource} buildSource={buildSource}/>
};
