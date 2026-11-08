import {age} from '..';

describe('age', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2021-07-11'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('a birthday a year or more ago counts in years', () => {
    expect(age.of(new Date('1978-11-28'))).toEqual({count: 42, unit: 'years'});
    expect(age.of(new Date('1979-11-28'))).toEqual({count: 41, unit: 'years'});
  });

  test('a birthday a month or more ago, but under a year, counts in months', () => {
    expect(age.of(new Date('2021-06-09'))).toEqual({count: 1, unit: 'months'});
    expect(age.of(new Date('2021-01-09'))).toEqual({count: 6, unit: 'months'});
  });

  test('a birthday under a month ago counts in days', () => {
    expect(age.of(new Date('2021-07-05'))).toEqual({count: 6, unit: 'days'});
    expect(age.of(new Date('2021-07-01'))).toEqual({count: 10, unit: 'days'});
  });

  test('an age reads in its unit', () => {
    expect(age.worded(age.of(new Date('1978-11-28')))).toBe('42 years old');
    expect(age.worded(age.of(new Date('2021-01-09')))).toBe('6 months old');
    expect(age.worded(age.of(new Date('2021-07-05')))).toBe('6 days old');
  });
});
