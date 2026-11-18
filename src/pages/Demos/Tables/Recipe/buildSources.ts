import type {Pace} from '../../ReaderSettings';
import eager from '../Frame/builds/Eager.ts?sample';
import lazy from '../Frame/builds/Lazy.ts?sample';
import {Sample} from '../../Recipe';

export const buildSources: Record<Pace, Sample> = {eager, lazy};
