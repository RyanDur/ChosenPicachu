import type {Pace} from '../../../Controls';
import {wire as eager} from './Eager';
import {wire as lazy} from './Lazy';

export const wires: Record<Pace, (document: Document) => void> = {eager, lazy};
