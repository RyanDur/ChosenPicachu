import type {Pace} from '../../../Controls';
import eager from './Eager.ts?sample';
import lazy from './Lazy.ts?sample';
import {Sample} from '@pages/Demos/Recipe/sample';

export const buildSources: Record<Pace, Sample> = {eager, lazy};
