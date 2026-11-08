import {differenceInDays, differenceInMonths, differenceInYears} from 'date-fns';

type Age = {
  count: number;
  unit: 'years' | 'months' | 'days';
};

type Ages = {
  of: (dateOfBirth: Date) => Age;
  worded: (age: Age) => string;
};

const of = (dateOfBirth: Date): Age => {
  const today = Date.now();
  const years = differenceInYears(today, dateOfBirth);
  if (years > 0) return {count: years, unit: 'years'};
  const months = differenceInMonths(today, dateOfBirth);
  if (months > 0) return {count: months, unit: 'months'};
  return {count: differenceInDays(today, dateOfBirth), unit: 'days'};
};

export const age: Ages = {
  of,
  worded: ({count, unit}) => `${count} ${unit} old`
};
