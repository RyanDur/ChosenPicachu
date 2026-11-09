import {carve, Line, Sample} from '../../../Recipe';
import {blankLine} from './blankLine';

export const carriedProperties = (cssSource: Sample): Line[] => [
  ...carve.unit(cssSource, '@property --seat-x {'), blankLine,
  ...carve.unit(cssSource, '@property --seat-y {'), blankLine,
  ...carve.unit(cssSource, '@property --drift-x {'), blankLine,
  ...carve.unit(cssSource, '@property --drift-y {'), blankLine
];
