import {Pace} from '../../Controls';

import eagerTable from '../Builds/EagerTable/EagerTable.tsx?raw';
import lazyTable from '../Builds/LazyTable/LazyTable.tsx?raw';
import eagerHeader from '@components/DragSortableTable/DraggableColumn.tsx?raw';
import eagerRow from '@components/DragSortableTable/RowHeader.tsx?raw';
import lazyHeader from '../Builds/LazyTable/DraggableColumn.tsx?raw';
import lazyRow from '../Builds/LazyTable/RowHeader.tsx?raw';

export const tableSources: Record<Pace, string> = {eager: eagerTable, lazy: lazyTable};

export const headerSources: Record<Pace, string> = {eager: eagerHeader, lazy: lazyHeader};

export const rowSources: Record<Pace, string> = {eager: eagerRow, lazy: lazyRow};
