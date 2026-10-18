import {expect, expectTypeOf, test} from 'vitest';
import {monthOf, moments} from '../moments';

test.each([
  [moments.need.date, {kind: 'year', year: '1989'}],
  [moments.behaviorBorn.date, {kind: 'month', year: '1995', month: 5}],
  [moments.cssOne.date, {kind: 'day', year: '1996', month: 12, day: 17}]
])('should read a written date as the case it is: %o', (date, read) => {
  expect(date).toEqual(read);
});

test('should name a month only for a date that has one', () => {
  // @ts-expect-error a year alone has no month
  expectTypeOf(monthOf).toBeCallableWith(moments.need.date);
});
