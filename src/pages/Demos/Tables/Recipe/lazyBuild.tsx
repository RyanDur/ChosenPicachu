import {LazyPace} from './steps';
import {SortBuild} from './sort-build';
import buildSource from '../Frame/builds/Lazy.ts?sample';
import tableSource from '../Builds/LazyTable/LazyTable.tsx?sample';
import headerSource from '../Builds/LazyTable/DraggableColumn.tsx?sample';
import rowSource from '../Builds/LazyTable/RowHeader.tsx?sample';
import paceSource from '../Builds/LazyTable/lazyDrop.ts?sample';

export const lazyBuild: SortBuild = {
  react: 'Builds/LazyTable',
  vanilla: 'Frame/builds/Lazy.ts',
  tableSource,
  buildSource,
  headerSource,
  rowSource,
  pace: <LazyPace headerSource={headerSource} paceSource={paceSource} buildSource={buildSource}/>
};
