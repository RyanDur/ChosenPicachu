import {carve, Line, lines, Sample} from '../../../Recipe';

export const carriedProperties = (cssSource: Sample): Line[] => [
  ...carve.unit(cssSource, '@property --seat-x {'), lines.blank,
  ...carve.unit(cssSource, '@property --seat-y {'), lines.blank,
  ...carve.unit(cssSource, '@property --drift-x {'), lines.blank,
  ...carve.unit(cssSource, '@property --drift-y {'), lines.blank
];
