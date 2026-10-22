import type {Pace} from '../../../Controls';
import {DragSortableTable as Eager} from './Eager';
import {DragSortableTable as Lazy} from './Lazy';

export const builds: Record<Pace, typeof Eager | typeof Lazy> = {eager: Eager, lazy: Lazy};
