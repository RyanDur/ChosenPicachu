import {Motion, Origin, Pace} from '../../Controls';

import eksTable from '@components/DragSortableTable/EagerKeepStaticTable/EagerKeepStaticTable.tsx?raw';
import eksHeader from '@components/DragSortableTable/EagerKeepStaticTable/Header.tsx?raw';
import eksHook from '@components/DragSortableTable/EagerKeepStaticTable/useColumnTravel.ts?raw';
import ekaTable from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.tsx?raw';
import ekaHeader from '@components/DragSortableTable/EagerKeepAnimatedTable/Header.tsx?raw';
import ekaHook from '@components/DragSortableTable/EagerKeepAnimatedTable/useColumnTravel.ts?raw';
import ehsTable from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.tsx?raw';
import ehsHeader from '@components/DragSortableTable/EagerHideStaticTable/Header.tsx?raw';
import ehsHook from '@components/DragSortableTable/EagerHideStaticTable/useColumnTravel.ts?raw';
import ehaTable from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import ehaHeader from '@components/DragSortableTable/EagerHideAnimatedTable/Header.tsx?raw';
import ehaHook from '@components/DragSortableTable/EagerHideAnimatedTable/useColumnTravel.ts?raw';
import lksTable from '@components/DragSortableTable/LazyKeepStaticTable/LazyKeepStaticTable.tsx?raw';
import lksHeader from '@components/DragSortableTable/LazyKeepStaticTable/Header.tsx?raw';
import lksHook from '@components/DragSortableTable/LazyKeepStaticTable/useColumnTravel.ts?raw';
import lkaTable from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.tsx?raw';
import lkaHeader from '@components/DragSortableTable/LazyKeepAnimatedTable/Header.tsx?raw';
import lkaHook from '@components/DragSortableTable/LazyKeepAnimatedTable/useColumnTravel.ts?raw';
import lhsTable from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import lhsHeader from '@components/DragSortableTable/LazyHideStaticTable/Header.tsx?raw';
import lhsHook from '@components/DragSortableTable/LazyHideStaticTable/useColumnTravel.ts?raw';
import lhaTable from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.tsx?raw';
import lhaHeader from '@components/DragSortableTable/LazyHideAnimatedTable/Header.tsx?raw';
import lhaHook from '@components/DragSortableTable/LazyHideAnimatedTable/useColumnTravel.ts?raw';
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

export const hookSources: Sources = {
  eager: {keep: {animated: ekaHook, static: eksHook}, hide: {animated: ehaHook, static: ehsHook}},
  lazy: {keep: {animated: lkaHook, static: lksHook}, hide: {animated: lhaHook, static: lhsHook}}
};

export const cssSources: Record<Pace, Record<Origin, Partial<Record<Motion, string>>>> = {
  eager: {keep: {animated: ekaCss}, hide: {animated: ehaCss, static: ehsCss}},
  lazy: {keep: {animated: lkaCss}, hide: {animated: lhaCss, static: lhsCss}}
};
