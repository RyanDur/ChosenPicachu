import {expectTypeOf, test} from 'vitest';
import {monthOf, moments} from '../moments';

test('should name a month only for a date that has one', () => {
  // @ts-expect-error a year alone has no month
  expectTypeOf(monthOf).toBeCallableWith(moments.need.date);
});
