import type {Pace} from '../../../Controls';
import eager from './Eager.ts?raw';
import lazy from './Lazy.ts?raw';

export const buildSources: Record<Pace, string> = {eager, lazy};
