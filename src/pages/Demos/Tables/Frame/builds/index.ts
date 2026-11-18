import type {Pace} from '../../../ReaderSettings';
import {dragSortable as eager} from './Eager';
import {dragSortable as lazy} from './Lazy';

export const builds: Record<Pace, typeof eager> = {eager, lazy};
