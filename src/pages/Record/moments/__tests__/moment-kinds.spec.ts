import {ComponentProps} from 'react';
import {expectTypeOf, test} from 'vitest';
import {moments} from '../../calendar';
import {MonthMoment} from '../MonthMoment';
import {YearMoment} from '../YearMoment';

test('should hold a year moment to a heading dated by its year alone', () => {
  // @ts-expect-error a heading with a month belongs to a month moment
  expectTypeOf(moments.headings.htmlTwo).toExtend<ComponentProps<typeof YearMoment>['heading']>();
});

test('should hold a month moment to a heading dated by its month', () => {
  // @ts-expect-error a heading dated by its year alone belongs to a year moment
  expectTypeOf(moments.headings.ecmaScript).toExtend<ComponentProps<typeof MonthMoment>['heading']>();
});
