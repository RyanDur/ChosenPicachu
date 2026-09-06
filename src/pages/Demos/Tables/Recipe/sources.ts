import {Motion, Origin, Pace} from '../../Controls';

import headerSource from '@components/DragSortableTable/elements/DraggableColumn.tsx?raw';
import rowHeaderSource from '@components/DragSortableTable/elements/RowHeader.tsx?raw';
import eksTable from '@components/DragSortableTable/EagerKeepStaticTable/EagerKeepStaticTable.tsx?raw';
import ekaTable from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.tsx?raw';
import ehsTable from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.tsx?raw';
import ehaTable from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import lksTable from '@components/DragSortableTable/LazyKeepStaticTable/LazyKeepStaticTable.tsx?raw';
import lkaTable from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.tsx?raw';
import lhsTable from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import lhaTable from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.tsx?raw';
import ehsCss from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.css?raw';
import ehaCss from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.css?raw';
import lhsCss from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.css?raw';
import lhaCss from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.css?raw';

type Sources = Record<Pace, Record<Origin, Record<Motion, string>>>;

export const tableSources: Sources = {
  eager: {keep: {animated: ekaTable, static: eksTable}, hide: {animated: ehaTable, static: ehsTable}},
  lazy: {keep: {animated: lkaTable, static: lksTable}, hide: {animated: lhaTable, static: lhsTable}}
};

export {headerSource, rowHeaderSource};

export const cssSources: Record<Pace, Record<Origin, Partial<Record<Motion, string>>>> = {
  eager: {keep: {}, hide: {animated: ehaCss, static: ehsCss}},
  lazy: {keep: {}, hide: {animated: lhaCss, static: lhsCss}}
};
