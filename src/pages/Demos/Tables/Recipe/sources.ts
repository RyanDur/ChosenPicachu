import {Motion, Origin, Pace} from '../../Controls';

import eksTable from '../Builds/EagerKeepStaticTable/EagerKeepStaticTable.tsx?raw';
import ekaTable from '../Builds/EagerKeepAnimatedTable/EagerKeepAnimatedTable.tsx?raw';
import ehsTable from '../Builds/EagerHideStaticTable/EagerHideStaticTable.tsx?raw';
import ehaTable from '../Builds/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import lksTable from '../Builds/LazyKeepStaticTable/LazyKeepStaticTable.tsx?raw';
import lkaTable from '../Builds/LazyKeepAnimatedTable/LazyKeepAnimatedTable.tsx?raw';
import lhsTable from '../Builds/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import lhaTable from '../Builds/LazyHideAnimatedTable/LazyHideAnimatedTable.tsx?raw';
import ehsCss from '../Builds/EagerHideStaticTable/EagerHideStaticTable.css?raw';
import ehaCss from '@components/DragSortableTable/motion.css?raw';
import lhsCss from '../Builds/LazyHideStaticTable/LazyHideStaticTable.css?raw';
import lhaCss from '../Builds/LazyHideAnimatedTable/LazyHideAnimatedTable.css?raw';
import ekaCss from '../Builds/EagerKeepAnimatedTable/EagerKeepAnimatedTable.css?raw';
import lkaCss from '../Builds/LazyKeepAnimatedTable/LazyKeepAnimatedTable.css?raw';

import eksHeader from '../Builds/EagerKeepStaticTable/DraggableColumn.tsx?raw';
import eksRow from '../Builds/EagerKeepStaticTable/RowHeader.tsx?raw';
import ekaHeader from '../Builds/EagerKeepAnimatedTable/DraggableColumn.tsx?raw';
import ekaRow from '../Builds/EagerKeepAnimatedTable/RowHeader.tsx?raw';
import ehsHeader from '../Builds/EagerHideStaticTable/DraggableColumn.tsx?raw';
import ehsRow from '../Builds/EagerHideStaticTable/RowHeader.tsx?raw';
import ehaHeader from '@components/DragSortableTable/DraggableColumn.tsx?raw';
import ehaRow from '@components/DragSortableTable/RowHeader.tsx?raw';
import lksHeader from '../Builds/LazyKeepStaticTable/DraggableColumn.tsx?raw';
import lksRow from '../Builds/LazyKeepStaticTable/RowHeader.tsx?raw';
import lkaHeader from '../Builds/LazyKeepAnimatedTable/DraggableColumn.tsx?raw';
import lkaRow from '../Builds/LazyKeepAnimatedTable/RowHeader.tsx?raw';
import lhsHeader from '../Builds/LazyHideStaticTable/DraggableColumn.tsx?raw';
import lhsRow from '../Builds/LazyHideStaticTable/RowHeader.tsx?raw';
import lhaHeader from '../Builds/LazyHideAnimatedTable/DraggableColumn.tsx?raw';
import lhaRow from '../Builds/LazyHideAnimatedTable/RowHeader.tsx?raw';

type Sources = Record<Pace, Record<Origin, Record<Motion, string>>>;

export const tableSources: Sources = {
  eager: {keep: {animated: ekaTable, static: eksTable}, hide: {animated: ehaTable, static: ehsTable}},
  lazy: {keep: {animated: lkaTable, static: lksTable}, hide: {animated: lhaTable, static: lhsTable}}
};

export const headerSources: Sources = {
  eager: {keep: {animated: ekaHeader, static: eksHeader}, hide: {animated: ehaHeader, static: ehsHeader}},
  lazy: {keep: {animated: lkaHeader, static: lksHeader}, hide: {animated: lhaHeader, static: lhsHeader}}
};

export const rowSources: Sources = {
  eager: {keep: {animated: ekaRow, static: eksRow}, hide: {animated: ehaRow, static: ehsRow}},
  lazy: {keep: {animated: lkaRow, static: lksRow}, hide: {animated: lhaRow, static: lhsRow}}
};

export const cssSources: Record<Pace, Record<Origin, Partial<Record<Motion, string>>>> = {
  eager: {keep: {animated: ekaCss}, hide: {animated: ehaCss, static: ehsCss}},
  lazy: {keep: {animated: lkaCss}, hide: {animated: lhaCss, static: lhsCss}}
};
