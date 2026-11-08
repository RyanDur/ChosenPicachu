import {differenceInDays, differenceInMonths, differenceInYears} from 'date-fns';

type Age = {
  value: number;
  unit: 'years' | 'months' | 'days';
};

type Ages = {
  of: (dob: Date) => Age;
  worded: (age: Age) => string;
};

const of = (dob: Date): Age => {
  const today = Date.now();
  const years = differenceInYears(today, dob);
  if (years > 0) return {value: years, unit: 'years'};
  const months = differenceInMonths(today, dob);
  if (months > 0) return {value: months, unit: 'months'};
  return {value: differenceInDays(today, dob), unit: 'days'};
};

export const age: Ages = {
  of,
  worded: ({value, unit}) => `${value} ${unit} old`
};
