import {has} from '@ryandur/sand';
import {Shares} from '@components/Table';

export type Chart = {
    left: number;
    top: number;
    width: number;
    height: number;
    rowHeights: Readonly<Record<number, number>>;
};

export const charted = (surface: HTMLTableElement, arranged: readonly {seat: number}[]): Chart => {
    const bounds = surface.getBoundingClientRect();
    const body = surface.tBodies[0];
    return {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        rowHeights: arranged.reduce((heights, {seat}, position) => ({
            ...heights,
            [seat]: body?.rows[position]?.getBoundingClientRect().height ?? 0
        }), {})
    };
};

export const columnUnder = (chart: Chart | undefined, order: readonly string[], shares: Shares) =>
    (x: number, y: number, aloft: string | undefined): string | undefined => {
        if (has(chart) && has(aloft) && y >= chart.top && y <= chart.top + chart.height) {
            let edge = chart.left;
            const slots = order.map((key, at) => {
                const width = (shares[key] ?? 0) / 100 * chart.width;
                edge += width;
                return {key, at, center: edge - width / 2, end: edge};
            });
            const struck = slots.find(({end}) => x < end);
            if (has(struck) && struck.key !== aloft) {
                const homeward = struck.at < order.indexOf(aloft);
                return (homeward ? x < struck.center : x > struck.center) ? struck.key : undefined;
            }
            return struck?.key;
        }
        return undefined;
    };

export const seatUnder = (chart: Chart | undefined, seats: readonly number[]) =>
    (x: number, y: number, aloft: number | undefined): number | undefined => {
        if (has(chart) && has(aloft) && x >= chart.left && x <= chart.left + chart.width) {
            const {top, height, rowHeights} = chart;
            let edge = top + height -
                seats.reduce((total, seat) => total + rowHeights[seat], 0);
            const slots = seats.map((seat, at) => {
                edge += rowHeights[seat];
                return {seat, at, center: edge - rowHeights[seat] / 2, end: edge};
            });
            const struck = slots.find(({end}) => y < end);
            if (has(struck) && struck.seat !== aloft) {
                const homeward = struck.at < seats.indexOf(aloft);
                return (homeward ? y < struck.center : y > struck.center) ? struck.seat : undefined;
            }
            return struck?.seat;
        }
        return undefined;
    };

export const anchored = (position: number, count: number): boolean =>
    position === 0 || position === count - 1;
