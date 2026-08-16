import type {Motion, Origin, Pace} from '../../Controls';
import {wires} from './builds';

declare global {
  // augmenting Window only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Window {
    __frame?: {pace: Pace; origin: Origin; motion: Motion};
  }
}

const {pace = 'eager', origin = 'hide', motion = 'animated'} = window.__frame ?? {};

wires[pace][origin][motion](document);
