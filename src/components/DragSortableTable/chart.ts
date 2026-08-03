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
    (x: number, y: number): string | undefined => {
        if (has(chart) && y >= chart.top && y <= chart.top + chart.height) {
            const {left, width} = chart;
            let edge = left;
            return order.find(key => {
                edge += (shares[key] ?? 0) / 100 * width;
                return x < edge;
            });
        }
        return undefined;
    };

export const seatUnder = (chart: Chart | undefined, seats: readonly number[]) =>
    (x: number, y: number): number | undefined => {
        if (has(chart) && x >= chart.left && x <= chart.left + chart.width) {
            const {top, height, rowHeights} = chart;
            let edge = top + height -
                seats.reduce((total, seat) => total + rowHeights[seat], 0);
            return seats.find(seat => {
                edge += rowHeights[seat];
                return y < edge;
            });
        }
        return undefined;
    };

export const anchored = (position: number, count: number): boolean =>
    position === 0 || position === count - 1;
