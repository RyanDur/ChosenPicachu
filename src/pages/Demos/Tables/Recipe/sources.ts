import {Motion, Origin, Pace} from '../../Controls';

import eksTable from '@components/DragSortableTable/EagerKeepStaticTable/EagerKeepStaticTable.tsx?raw';
import eksHeader from '@components/DragSortableTable/EagerKeepStaticTable/DraggableColumn.tsx?raw';
import eksCell from '@components/DragSortableTable/EagerKeepStaticTable/Cell.tsx?raw';
import ekaTable from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.tsx?raw';
import ekaHeader from '@components/DragSortableTable/EagerKeepAnimatedTable/DraggableColumn.tsx?raw';
import ekaCell from '@components/DragSortableTable/EagerKeepAnimatedTable/Cell.tsx?raw';
import ehsTable from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.tsx?raw';
import ehsHeader from '@components/DragSortableTable/EagerHideStaticTable/DraggableColumn.tsx?raw';
import ehsCell from '@components/DragSortableTable/EagerHideStaticTable/Cell.tsx?raw';
import ehaTable from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import ehaHeader from '@components/DragSortableTable/EagerHideAnimatedTable/DraggableColumn.tsx?raw';
import ehaCell from '@components/DragSortableTable/EagerHideAnimatedTable/Cell.tsx?raw';
import lksTable from '@components/DragSortableTable/LazyKeepStaticTable/LazyKeepStaticTable.tsx?raw';
import lksHeader from '@components/DragSortableTable/LazyKeepStaticTable/DraggableColumn.tsx?raw';
import lksCell from '@components/DragSortableTable/LazyKeepStaticTable/Cell.tsx?raw';
import lkaTable from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.tsx?raw';
import lkaHeader from '@components/DragSortableTable/LazyKeepAnimatedTable/DraggableColumn.tsx?raw';
import lkaCell from '@components/DragSortableTable/LazyKeepAnimatedTable/Cell.tsx?raw';
import lhsTable from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import lhsHeader from '@components/DragSortableTable/LazyHideStaticTable/DraggableColumn.tsx?raw';
import lhsCell from '@components/DragSortableTable/LazyHideStaticTable/Cell.tsx?raw';
import lhaTable from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.tsx?raw';
import lhaHeader from '@components/DragSortableTable/LazyHideAnimatedTable/DraggableColumn.tsx?raw';
import lhaCell from '@components/DragSortableTable/LazyHideAnimatedTable/Cell.tsx?raw';
import ekaCss from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.css?raw';
import ehsCss from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.css?raw';
import ehaCss from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.css?raw';
import lkaCss from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.css?raw';
import lhsCss from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.css?raw';
import lhaCss from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.css?raw';

type Sources = Record<Pace, Record<Origin, Record<Motion, string>>>;

export const tableSources: Sources = {
  eager: {keep: {animated: ekaTable, static: eksTable}, hide: {animated: ehaTable, static: ehsTable}},
  lazy: {keep: {animated: lkaTable, static: lksTable}, hide: {animated: lhaTable, static: lhsTable}}
};

export const headerSources: Sources = {
  eager: {keep: {animated: ekaHeader, static: eksHeader}, hide: {animated: ehaHeader, static: ehsHeader}},
  lazy: {keep: {animated: lkaHeader, static: lksHeader}, hide: {animated: lhaHeader, static: lhsHeader}}
};

export const cellSources: Sources = {
  eager: {keep: {animated: ekaCell, static: eksCell}, hide: {animated: ehaCell, static: ehsCell}},
  lazy: {keep: {animated: lkaCell, static: lksCell}, hide: {animated: lhaCell, static: lhsCell}}
};

export const cssSources: Record<Pace, Record<Origin, Partial<Record<Motion, string>>>> = {
  eager: {keep: {animated: ekaCss}, hide: {animated: ehaCss, static: ehsCss}},
  lazy: {keep: {animated: lkaCss}, hide: {animated: lhaCss, static: lhsCss}}
};
