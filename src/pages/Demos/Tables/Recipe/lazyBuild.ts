import {SortBuild} from './sort-build';
import {Sample} from '../../Recipe';
import buildSource from '../Frame/builds/Lazy.ts?sample';
import tableSource from '../Builds/LazyTable/LazyTable.tsx?sample';
import headerSource from '../Builds/LazyTable/DraggableColumn.tsx?sample';
import rowSource from '../Builds/LazyTable/RowHeader.tsx?sample';
import paceSource from '../Builds/LazyTable/lazyDrop.ts?sample';

export const lazyBuild: SortBuild & {paceSource: Sample} = {
  react: 'Builds/LazyTable',
  vanilla: 'Frame/builds/Lazy.ts',
  tableSource,
  buildSource,
  headerSource,
  rowSource,
  paceSource
};
