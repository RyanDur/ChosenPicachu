import {has} from '@ryandur/sand';
import {TableProps} from '@components/Table';

export type Direction = 'ascending' | 'descending';

export type Rule = {
    column: string;
    direction: Direction;
};

export const glyphs: Record<Direction, string> = {ascending: '▲', descending: '▼'};

export const unsorted = '⇅';

export const sortedBy = (column: string, rule?: Rule): Direction | undefined =>
    has(rule) && rule.column === column ? rule.direction : undefined;

export const glyphOf = (sorted?: Direction): string =>
    has(sorted) ? glyphs[sorted] : unsorted;

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

export const ranked = (rows: TableProps['rows'], dealt: readonly number[], rule: Rule): number[] =>
    [...dealt].sort((left, right) => {
        const first = rows[left][rule.column]?.value;
        const second = rows[right][rule.column]?.value;
        const gap = typeof first === 'string' || typeof second === 'string'
            ? String(first ?? '').localeCompare(String(second ?? ''))
            : (first ?? Number.NEGATIVE_INFINITY) - (second ?? Number.NEGATIVE_INFINITY);
        return rule.direction === 'ascending' ? gap : -gap;
    });
