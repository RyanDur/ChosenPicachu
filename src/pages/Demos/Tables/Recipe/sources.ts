import {Pace} from '../../Controls';

import eagerTable from '../Builds/EagerTable/EagerTable.tsx?sample';
import lazyTable from '../Builds/LazyTable/LazyTable.tsx?sample';
import eagerHeader from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import eagerRow from '@components/DragSortableTable/RowHeader.tsx?sample';
import lazyHeader from '../Builds/LazyTable/DraggableColumn.tsx?sample';
import lazyRow from '../Builds/LazyTable/RowHeader.tsx?sample';
import {Sample} from '@pages/Demos/Recipe/sample';

export const tableSources: Record<Pace, Sample> = {eager: eagerTable, lazy: lazyTable};

export const headerSources: Record<Pace, Sample> = {eager: eagerHeader, lazy: lazyHeader};

export const rowSources: Record<Pace, Sample> = {eager: eagerRow, lazy: lazyRow};
