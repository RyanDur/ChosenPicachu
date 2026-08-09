import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Column} from '@components/Table';

export type Slid = Readonly<Record<string, {toward: 'left' | 'right'; by: number}>>;
export type Shifted = Readonly<Record<number, number>>;
import {Shares} from '@components/Table';

export type Bounds = {
    left: number;
    top: number;
    width: number;
    height: number;
};

export type Survey = Bounds & {
    rowHeights: Readonly<Record<number, number>>;
};

export const bounded = (surface: HTMLTableElement): Bounds => {
    const bounds = surface.getBoundingClientRect();
    return {left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height};
};

export const surveyed = (surface: HTMLTableElement, seats: readonly number[]): Survey => {
    const body = surface.tBodies[0];
    return {
        ...bounded(surface),
        rowHeights: seats.reduce((heights, card, position) => ({
            ...heights,
            [card]: body?.rows[position]?.getBoundingClientRect().height ?? 0
        }), {})
    };
};

const deadZone = (struckSize: number, aloftSize: number): number =>
    Math.max(struckSize / 4, (struckSize - aloftSize) / 2);

export const columnUnder = (order: readonly string[], shares: Shares, survey?: Bounds) =>
    (x: number, y: number, aloft?: string): string | undefined => {
        if (has(survey) && has(aloft) && y >= survey.top && y <= survey.top + survey.height) {
            let edge = survey.left;
            const slots = order.map((column, at) => {
                const width = (shares[column] ?? 0) / 100 * survey.width;
                edge += width;
                return {column, at, width, start: edge - width, end: edge};
            });
            const struck = slots.find(({end}) => x < end);
            if (has(struck) && struck.column !== aloft) {
                const home = order.indexOf(aloft);
                const held = deadZone(struck.width, slots[home]?.width ?? 0);
                return (struck.at < home ? x < struck.end - held : x > struck.start + held)
                    ? struck.column
                    : undefined;
            }
            return struck?.column;
        }
        return undefined;
    };

export const cardUnder = (seats: readonly number[], survey?: Survey) =>
    (x: number, y: number, aloft?: number): number | undefined => {
        if (has(survey) && has(aloft) && x >= survey.left && x <= survey.left + survey.width) {
            const {top, height, rowHeights} = survey;
            let edge = top + height -
                seats.reduce((total, card) => total + rowHeights[card], 0);
            const slots = seats.map((card, at) => {
                const rowHeight = rowHeights[card];
                edge += rowHeight;
                return {card, at, height: rowHeight, start: edge - rowHeight, end: edge};
            });
            const struck = slots.find(({end}) => y < end);
            if (has(struck) && struck.card !== aloft) {
                const home = seats.indexOf(aloft);
                const held = deadZone(struck.height, slots[home]?.height ?? 0);
                return (struck.at < home ? y < struck.end - held : y > struck.start + held)
                    ? struck.card
                    : undefined;
            }
            return struck?.card;
        }
        return undefined;
    };

export const anchored = (position: number, count: number): boolean =>
    position === 0 || position === count - 1;

export const interior = (at: number, count: number): number =>
    Math.min(Math.max(at, 1), count - 2);

export const placed = (ordered: readonly Column[], column: string, to: number): Column[] => {
    const lifted = ordered.find(definition => definition.column === column);
    return has(lifted) ? array.moveToIndex(to, lifted, ordered) : [...ordered];
};

export const displaced = (
    order: readonly string[],
    column: string,
    struck: string,
    shares: Shares
): Slid => {
    const from = order.indexOf(column);
    const to = Math.min(Math.max(order.indexOf(struck), 1), order.length - 2);
    const between = from < to ? order.slice(from + 1, to + 1) : order.slice(to, from);
    return Object.fromEntries(between.map(neighbour =>
        [neighbour, {toward: from < to ? 'left' : 'right', by: shares[column] ?? 0}]));
};

export const shifts = (
    heights: Readonly<Record<number, number>>,
    before: readonly number[],
    after: readonly number[],
    riding?: number
): Record<number, number> => {
    const tops = (seated: readonly number[]): Record<number, number> => {
        let y = 0;
        return seated.reduce<Record<number, number>>((at, card) => {
            at[card] = y;
            y += heights[card] ?? 0;
            return at;
        }, {});
    };
    const was = tops(before);
    const now = tops(after);
    return Object.fromEntries(after
        .filter(card => card !== riding && (was[card] ?? 0) !== (now[card] ?? 0))
        .map(card => [card, (was[card] ?? 0) - (now[card] ?? 0)]));
};
