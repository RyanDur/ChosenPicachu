import {age, AgeIn, formatAge} from '@components/Users/age';

describe('age', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2021-07-11'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('a birthday a year or more ago counts in years', () => {
    expect(age(new Date('1978-11-28'))).toEqual({value: 42, unit: AgeIn.YEARS});
    expect(age(new Date('1979-11-28'))).toEqual({value: 41, unit: AgeIn.YEARS});
  });

  test('a birthday a month or more ago, but under a year, counts in months', () => {
    expect(age(new Date('2021-06-09'))).toEqual({value: 1, unit: AgeIn.MONTHS});
    expect(age(new Date('2021-01-09'))).toEqual({value: 6, unit: AgeIn.MONTHS});
  });

  test('a birthday under a month ago counts in days', () => {
    expect(age(new Date('2021-07-05'))).toEqual({value: 6, unit: AgeIn.DAYS});
    expect(age(new Date('2021-07-01'))).toEqual({value: 10, unit: AgeIn.DAYS});
  });

  test('an age reads in its unit', () => {
    expect(formatAge(age(new Date('1978-11-28')))).toBe('42 years old');
    expect(formatAge(age(new Date('2021-01-09')))).toBe('6 months old');
    expect(formatAge(age(new Date('2021-07-05')))).toBe('6 days old');
  });
});
