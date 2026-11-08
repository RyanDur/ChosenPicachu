import {carve, Line, Sample} from '../../../Recipe';
import {gap} from './gap';

export const carriedProperties = (cssSource: Sample): Line[] => [
  ...carve.unit(cssSource, '@property --seat-x {'), gap,
  ...carve.unit(cssSource, '@property --seat-y {'), gap,
  ...carve.unit(cssSource, '@property --drift-x {'), gap,
  ...carve.unit(cssSource, '@property --drift-y {'), gap
];
