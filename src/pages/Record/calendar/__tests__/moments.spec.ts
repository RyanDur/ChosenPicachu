import {expectTypeOf, test} from 'vitest';
import {AuthoredDate, moments} from '../moments';

test('should name a month only for a date that has one', () => {
  // @ts-expect-error a year alone has no month
  expectTypeOf(moments.monthOf).toBeCallableWith(moments.headings.need.date);
});

test('should date a day only within its month', () => {
  // @ts-expect-error a day needs its month
  expectTypeOf<{year: '1995'; day: 17}>().toExtend<AuthoredDate>();
});
