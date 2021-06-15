
export const remove = <T extends Object>(index: number, list: T[]): T[] =>
    [...list.slice(0, index), ...list.slice(index + 1)];

export const add = <T extends Object>(index: number, item: T, list: T[]): T[] =>
    [...list.slice(0, index), item, ...list.slice(index)];