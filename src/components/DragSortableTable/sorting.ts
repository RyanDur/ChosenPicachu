import {has} from '@ryandur/sand';

export type Direction = 'ascending' | 'descending';

export type Values = Readonly<Record<string, number | string | undefined>>;

export type Rule = {
    column: string;
    direction: Direction;
};

export const sortedBy = (column: string, rule?: Rule): Direction | undefined =>
    has(rule) && rule.column === column ? rule.direction : undefined;

export type Choice = {
    display: string;
    direction?: Direction;
};

export const choices: readonly Choice[] = [
    {display: 'ascending', direction: 'ascending'},
    {display: 'descending', direction: 'descending'},
    {display: 'as dealt'}
];

export const directionOf = (label: string): Direction | undefined => {
    const choice = choices.find(({display}) => display === label);
    return has(choice) ? choice.direction : undefined;
};

export const ranked = (values: readonly Values[], dealt: readonly number[], rule: Rule): number[] =>
    [...dealt].sort((left, right) => {
        const first = values[left]?.[rule.column];
        const second = values[right]?.[rule.column];
        const gap = typeof first === 'string' || typeof second === 'string'
            ? String(first ?? '').localeCompare(String(second ?? ''))
            : (first ?? Number.NEGATIVE_INFINITY) - (second ?? Number.NEGATIVE_INFINITY);
        return rule.direction === 'ascending' ? gap : -gap;
    });
