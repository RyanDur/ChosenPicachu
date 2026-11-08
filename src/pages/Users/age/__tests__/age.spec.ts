import {age} from '..';

const agedSince = (dateOfBirth: string): string => age.worded(age.of(new Date(dateOfBirth)));

describe('age', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2021-07-11'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('a birthday a year or more ago reads in years', () => {
    expect(agedSince('1978-11-28')).toBe('42 years old');
  });

  test('a birthday a month or more ago, but under a year, reads in months', () => {
    expect(agedSince('2021-01-09')).toBe('6 months old');
  });

  test('a birthday under a month ago reads in days', () => {
    expect(agedSince('2021-07-05')).toBe('6 days old');
  });

  test('a birthday one year ago reads 1 year old', () => {
    expect(agedSince('2020-07-11')).toBe('1 year old');
  });

  test('a birthday one month ago reads 1 month old', () => {
    expect(agedSince('2021-06-09')).toBe('1 month old');
  });

  test('a birthday one day ago reads 1 day old', () => {
    expect(agedSince('2021-07-10')).toBe('1 day old');
  });
});
