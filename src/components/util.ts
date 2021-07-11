import differenceInYears from 'date-fns/differenceInYears';
import differenceInMonths from 'date-fns/differenceInMonths';
import differenceInDays from 'date-fns/differenceInDays';

type Indexable = {
    [index in (string | number)]: unknown;
};

export const notEmpty = <T>(obj?: T, ...optional: (string | number)[]): boolean => {
    if (typeof obj === 'object') {
        const indexable = obj as Indexable;
        return !!Object.keys(indexable)
            .filter(key => !optional.includes(key))
            .map(key => indexable[key])
            .filter(value => !!value)
            .length;
    } return false;
};

export const join =
    (...classes: Partial<(string | boolean)[]>) => classes.filter(className => className).join(' ').trim();

export const toISOWithoutTime = (date: Date): string => date.toISOString().split('T')[0];

export enum AgeIn {
    YEARS = 'years',
    MONTHS = 'months',
    DAYS = 'days'
}

interface Age {
    value: number;
    unit: AgeIn
}

export const age = (dob: Date = new Date()): Age => {
    const today = Date.now();
    const years = differenceInYears(today, dob);
    if (years === 0) {
        const months = differenceInMonths(today, dob);
        if (months === 0) {
            return {value: differenceInDays(today, dob), unit: AgeIn.DAYS};
        } else return {value: months, unit: AgeIn.MONTHS};
    } else return {value: years, unit: AgeIn.YEARS};
};

export const formatAge = ({value, unit}: Age): string => {
    switch (unit) {
        case AgeIn.YEARS:
            return `${value} years old`;
        case AgeIn.MONTHS:
            return `${value} months old`;
        case AgeIn.DAYS:
            return `${value} days old`;
    }
    return '';
};