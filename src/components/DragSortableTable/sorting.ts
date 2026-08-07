import {TableProps} from '@components/Table';

export type Direction = 'ascending' | 'descending';

export type Rule = {
    column: string;
    direction: Direction;
};

export const ranked = (rows: TableProps['rows'], dealt: readonly number[], rule: Rule): number[] =>
    [...dealt].sort((left, right) => {
        const gap = (rows[left][rule.column]?.value ?? Number.NEGATIVE_INFINITY) -
            (rows[right][rule.column]?.value ?? Number.NEGATIVE_INFINITY);
        return rule.direction === 'ascending' ? gap : -gap;
    });
