import {differenceInDays, differenceInMonths, differenceInYears} from 'date-fns';

export const join =
    (...classes: Partial<(string | boolean)[]>) => classes.filter(className => className).join(' ').trim();

export const toISOWithoutTime = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

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
