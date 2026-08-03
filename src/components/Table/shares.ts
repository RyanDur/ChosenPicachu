import {has} from '@ryandur/sand';
import {Column} from './Table';

export const SLIMMEST = 5;

export type Shares = Readonly<Record<string, number>>;

export const seededShares = (columns: Column[]): Shares => {
    const sized = columns.filter(({width}) => has(width));
    const total = sized.reduce((sum, {width}) => sum + (width ?? 0), 0);
    return sized.reduce<Shares>((shares, {column, width}) =>
        ({...shares, [String(column)]: (width ?? 0) / total * 100}), {});
};

export const traded = (column: string, neighbor: string, delta: number) => (previous: Shares): Shares => {
    const given = Math.min(
        Math.max(delta, SLIMMEST - previous[column]),
        previous[neighbor] - SLIMMEST
    );
    return {...previous, [column]: previous[column] + given, [neighbor]: previous[neighbor] - given};
};

export const neighborOf = (apportioned: readonly string[], key: string): string => {
    const index = apportioned.indexOf(key);
    return apportioned[index + 1] ?? apportioned[index - 1];
};
