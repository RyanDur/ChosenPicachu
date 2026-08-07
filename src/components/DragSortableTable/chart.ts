import {has} from '@ryandur/sand';

export type Slid = Readonly<Record<string, {toward: 'left' | 'right'; by: number}>>;
export type Shifted = Readonly<Record<number, number>>;
import {Shares} from '@components/Table';

export type Bounds = {
    left: number;
    top: number;
    width: number;
    height: number;
};

export type Chart = Bounds & {
    rowHeights: Readonly<Record<number, number>>;
};

export const bounded = (surface: HTMLTableElement): Bounds => {
    const bounds = surface.getBoundingClientRect();
    return {left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height};
};

export const charted = (surface: HTMLTableElement, seats: readonly number[]): Chart => {
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

export const columnUnder = (order: readonly string[], shares: Shares, chart?: Bounds) =>
    (x: number, y: number, aloft?: string): string | undefined => {
        if (has(chart) && has(aloft) && y >= chart.top && y <= chart.top + chart.height) {
            let edge = chart.left;
            const slots = order.map((column, at) => {
                const width = (shares[column] ?? 0) / 100 * chart.width;
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

export const cardUnder = (seats: readonly number[], chart?: Chart) =>
    (x: number, y: number, aloft?: number): number | undefined => {
        if (has(chart) && has(aloft) && x >= chart.left && x <= chart.left + chart.width) {
            const {top, height, rowHeights} = chart;
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
